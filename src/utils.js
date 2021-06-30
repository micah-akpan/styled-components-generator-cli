import chalk from 'chalk'

function getDeclarations(ruleStyle) {
  let declarations = []
  let foundDeclaration = true
  let ruleCount = 0; // first rule's prop starts at 0
  while (foundDeclaration) {
    let declarationProp = ruleStyle[ruleCount]
    let declarationValue = ruleStyle[declarationProp]
    declarations.push({ prop: declarationProp, value: declarationValue })

    ++ruleCount;
    foundDeclaration = Boolean(ruleStyle[ruleCount])
  }
  return declarations;
}

function generateStyles(rules) {
  // returns an map of selectors to their respective declarations
  return rules.map((rule) => ({
    selector: rule.selectorText,
    declarations: getDeclarations(rule.style)
  }))
}

function generateStyledComponents(styles) {
  let components = []
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i]
    let component = `const ${style.selector}Component = styled.${style.selector}\`
    ${style.declarations.map(declaration => {
      return `\t${declaration.prop}: ${declaration.value};`
    }).join('\n')}
  \`
  `
    components.push(component)
  }
  return components;
}

function displayInfo(msg, level = 'error') {
  let info = ''
  if (level == 'error') {
    info = chalk.red.bold(`Operation Failed: ${msg}`)
  } else if (level == 'normal') {
    info = chalk.green.bold(msg)
  }
  return info
}

export {
  getDeclarations,
  generateStyles,
  generateStyledComponents,
  displayInfo
}