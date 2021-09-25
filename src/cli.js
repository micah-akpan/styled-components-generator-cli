import arg from 'arg'
import fs from 'fs'
import CSSOM from 'cssom'
import { generateStyles, generateStyledComponents, displayInfo } from './utils'
import { version } from '../package.json'
import sass from 'node-sass'

const log = console.log

const parseArgumentsIntoOpts = (rawArgs) => {
  const args = arg(
    {
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
    quiet: args['--quiet'] || false,
    source: args['--source'],
    dest: args['--dest'],
    version
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOpts(args)
  if (!options.source) {
    log(displayInfo('Please provide a css, scss or less file path', 'normal'))
    process.exit(1)
  }
  try {
    const { css } = sass.renderSync({
      file: options.source,
      outputStyle: 'expanded'
    })

    convertToStyledComponents(css.toString('utf-8'), options)
  } catch (error) {
    log(displayInfo(error, 'error'))
  }
}

function convertToStyledComponents(cssFile, options) {
  try {
    let cssString = CSSOM.parse(cssFile)

    const styles = generateStyles(cssString.cssRules)
    const components = generateStyledComponents(styles)

    const componentStr = components.join('\n')

    if (options.dest) {
      writeToFile(options.dest, componentStr)
      return;
    }

    log(displayInfo(componentStr, 'normal'))
  } catch (error) {
    console.error(error)
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
