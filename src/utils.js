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
  // returns an hash of selectors to their respective declarations
  let styles = []
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    let ruleStyle = rule.style
    let style = { selector: rule.selectorText }
    let declarations = getDeclarations(ruleStyle)
    style.declarations = declarations;
    styles.push(style)
  }
  return styles;
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
      info = chalk.green.bold(`${msg}`)
    }
    return info
}

export {
  getDeclarations,
  generateStyles,
  generateStyledComponents,
  displayInfo
}