import arg from 'arg'
import path from 'path'
import fs from 'fs'
import CSSOM from 'cssom'
import { generateStyles, generateStyledComponents } from './utils'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--type': String,
      '--quiet': Boolean,
      '--file': String,
      '-t': '--type',
      '-q': '--quiet',
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  return {
    type: args['--type'] || 'css',
    quiet: args['--quiet'] || false,
    file: args['--file']
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  // console.log(options);
  convertCSS(options.file)
}

function convertCSS(cssFile) {
  let filePath = path.resolve(__dirname, cssFile)
  let stream = fs.createReadStream(filePath, { encoding: 'utf-8' })

  stream.on('data', (data) => {
    let cssString = CSSOM.parse(data)

    const styles = generateStyles(cssString.cssRules)
    const components = generateStyledComponents(styles)
  })

  stream.read()
}

