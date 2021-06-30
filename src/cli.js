import arg from 'arg'
import path from 'path'
import fs from 'fs'
import CSSOM from 'cssom'
import { generateStyles, generateStyledComponents, displayInfo } from './utils'

const log = console.log

function parseArgumentsIntoOpts(rawArgs) {
  const args = arg(
    {
      '--type': String,
      '--quiet': Boolean,
      '--source': String,
      '--dest': String,
      '-t': '--type',
      '-q': '--quiet',
      '-s': '--source',
      '-d': '--dest'
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  return {
    type: args['--type'],
    quiet: args['--quiet'] || false,
    source: args['--source'],
    dest: args['--dest']
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOpts(args)
  if (!options.type) {
    log(displayInfo('You did not specify --type. CSS will be used as the default type', 'normal'))
  }
  convertCSS(options.source, options)
}

function convertCSS(cssFile, options) {
  try {
    let stream = fs.createReadStream(cssFile, { encoding: 'utf-8' })
    stream.on('data', (data) => {
      let cssString = CSSOM.parse(data)

      const styles = generateStyles(cssString.cssRules)
      const components = generateStyledComponents(styles)

      const componentStr = components.join('\n')

      if (options.dest) {
        const destination = fs.createWriteStream(options.dest)
        destination.write(componentStr, 'utf-8', (error) => {
          if (error) {
            log(displayInfo('Does the specified destination exist?'))
          } else {
            log(displayInfo('Operation Successful: The components have been written to specified file', 'normal'))
          }
          destination.close()
        })
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

  }
}
