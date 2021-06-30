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
    let component = `styled.${style.selector}\`
    ${style.declarations.map(declaration => {
      return `${declaration.prop}: ${declaration.value}`
    }).join('\n')}
  \`
  `
    components.push(component)
  }
  return components;
}

export {
  getDeclarations,
  generateStyles,
  generateStyledComponents
}