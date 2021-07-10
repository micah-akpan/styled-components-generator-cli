import arg from 'arg'
import fs from 'fs'
import CSSOM from 'cssom'
import { generateStyles, generateStyledComponents, displayInfo } from './utils'
import { version } from '../package.json'
import scssParser from 'scss-parser'
import createQueryWrapper from 'query-ast'

const log = console.log

const parseArgumentsIntoOpts = (rawArgs) => {
  const args = arg(
    {
      '--type': String,
      '--quiet': Boolean,
      '--source': String,
      '--dest': String,
      '--version': String,
      '-t': '--type',
      '-q': '--quiet',
      '-s': '--source',
      '-d': '--dest',
      '--version': version
    },
    {
      argv: rawArgs.slice(2),
      permissive: true
    }
  )

  return {
    type: args['--type'],
    quiet: args['--quiet'] || false,
    source: args['--source'],
    dest: args['--dest'],
    version
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOpts(args)
  if (!options.type) {
    log(displayInfo('You did not specify --type. CSS will be used as the default type', 'normal'))
  } else {
    const type = options.type.toLowerCase()
    if (type == 'css') {
      convertCSS(options.source, options, type)
    } else if (type == 'scss') {
      transformSCSS(options.source, options)
    }
  }

}

function getFileStream(cssFile, options) {
  let stream = fs.createReadStream(cssFile, { encoding: 'utf-8', ...options })
  return stream;
}

function convertCSS(cssFile, options) {
  let stream;
  try {
    stream = fs.createReadStream(cssFile, { encoding: 'utf-8' })
    stream.on('data', (data) => {
      let cssString = CSSOM.parse(data)

      const styles = generateStyles(cssString.cssRules)
      const components = generateStyledComponents(styles)

      const componentStr = components.join('\n')

      if (options.dest) {
        writeToFile(options.dest, componentStr)
        return;
      }

      log(displayInfo(componentStr, 'normal'))
    })

    stream.on('error', (err) => {
      if (err.code == 'ENOENT') {
        log(displayInfo('the provided file does not exist. please check the path and try again'))
      } else if (err.code == 'EACCES') {
        log(displayInfo('You do not have the necessary permission to this file'))
      }
    })
    stream.read()
  } catch (error) {

  } finally {

  }
}

const writeToFile = (file, component) => {
  const destination = fs.createWriteStream(file)
  destination.write(component, 'utf-8', (error) => {
    if (error) {
      log(displayInfo('Does the specified destination exist?'))
    } else {
      log(displayInfo('Operation Successful: The components have been written to specified file', 'normal'))
    }
    destination.close()
  })
}

function transformSCSS(filePath, options) {
  try {
    const dataStream = getFileStream(filePath, options)
    dataStream.on('data', (data) => {
      const ast = scssParser.parse(data)
      let $ = createQueryWrapper(ast)

      let nodes = []
      let node = null

      // console.log($('rule').eq(0))

      // console.log($('rule'))

      const rules = []

      // console.log($('selector').value());

      const selectors = $('selector')
        .map((n) => n.node.value.find((v) => v.type == 'identifier'))
        .map((v) => ({ selector: v.value }))

      const declarations = $('declaration')
        .map((n) => {
          let obj = {}

          const objs = n.node.value.map(d => {
            if (d.type === 'property') {
              obj.prop = d.value.find(v => v.type == 'identifier').value
            } else if (d.type === 'value') {
              const units = d.value.find(v => v.type == 'number')
              const charValue = d.value.find(v => v.type == 'identifier')

              if (units && charValue) {
                obj.value = units.value + charValue.value
              } else if (units) {
                obj.value = units.value;
              } else {
                obj.value = charValue.value;
              }

              return obj;
            }
          })

          return objs
        })
        .reduce((acc, item) => acc.concat(item), [])
        .filter(Boolean)

      console.log(declarations)
    })
    dataStream.read()
  } catch (e) {

  }

}
