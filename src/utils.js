import chalk from 'chalk'

export const getDeclarations = (ruleStyle) => {
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

export const generateStyles = (rules) => {
  // returns an map of selectors to their respective declarations
  return rules.map((rule) => ({
    selector: rule.selectorText,
    declarations: getDeclarations(rule.style)
  }))
}

export const generateStyledComponents = (styles) => {
  let components = []
  for (let i = 0; i < styles.length; i++) {
    let style = styles[i]
    let selector = removePrefixInSelector(getLastSelector(style.selector))
    let component = `const ${selector}Component = styled.${selector}\`
    ${style.declarations.map(declaration => {
      return `\t${declaration.prop}: ${declaration.value};`
    }).join('\n')}
  \`
  `
    components.push(component)
  }
  return components;
}

export const displayInfo = (msg, level = 'error') => {
  let info = ''
  if (level == 'error') {
    info = chalk.red.bold(`Operation Failed: ${msg}`)
  } else if (level == 'normal') {
    info = chalk.green.bold(msg)
  }
  return info
}

export const getLastSelector = (selectors) => {
  let combinatorsRegExp = /[+|~|>| ]+/
  let selectorList = selectors.split(combinatorsRegExp)
  return selectorList[selectorList.length - 1]
}

export const removePrefixInSelector = (selector) => {
  const classIDPrefixRegExp = /[.|#]/
  return selector.replace(classIDPrefixRegExp, '')
}