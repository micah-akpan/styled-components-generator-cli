import arg from 'arg'
import path from 'path'
import fs from 'fs'
import CSSOM from 'cssom'
import { generateStyles, generateStyledComponents } from './utils'
import chalk from 'chalk'

function parseArgumentsIntoOpts(rawArgs) {
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
    type: args['--type'],
    quiet: args['--quiet'] || false,
    file: args['--file']
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOpts(args)
  if (!options.type) {
    console.log(chalk.green.bold('You did not specify --type. CSS will be used as the default type'))
  }
  convertCSS(options.file)
}

function convertCSS(cssFile) {
  // let filePath = path.resolve(__dirname, cssFile)
  try {
    let stream = fs.createReadStream(cssFile, { encoding: 'utf-8' })
    stream.on('data', (data) => {
      let cssString = CSSOM.parse(data)

      const styles = generateStyles(cssString.cssRules)
      const components = generateStyledComponents(styles)
    })

    stream.on('error', (err) => {
      if (err.code == 'ENOENT') {
        chalk.red.bold('the provided file does not exist. please check the path and try again')
      } else if (err.code == 'EACCES') {
        console.log(chalk.red.bold('You do not have the necessary permission to this file'))
      }
    })
    stream.read()
  } catch (error) {

  }
}

