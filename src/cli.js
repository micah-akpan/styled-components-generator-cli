import arg from 'arg'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--type': String,
      '--quiet': Boolean,
      '-t': '--type',
      '-q': '--quiet',
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  return {
    type: args['--type'] || 'css',
    quiet: args['--quiet'] || false
  }
}

export function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  console.log(options);
}
