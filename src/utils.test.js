import { describe, expect, jest, test } from '@jest/globals';
import * as Utils from './utils'
import chalk from 'chalk'

jest.mock('chalk')

describe('Utils', () => {
  let rules = [
    {
      selectorText: 'span',
      style: {
        '0': 'color',
        'color': 'red'
      }
    }
  ]
  describe('getDeclarations', () => {
    let ruleStyle = {
      '0': 'color',
      color: 'red'
    }

    test('can parse the stylesheet AST to obtain declarations', () => {
      let declarations = Utils.getDeclarations(ruleStyle)
      expect(Array.isArray(declarations)).toEqual(true)
      expect(declarations[0].value).toEqual('red')
      expect(declarations[0].prop).toEqual('color')
    });

    test('can parse the stylesheet AST to obtain declarations', () => {
      ruleStyle = {
        ...ruleStyle,
        '1': 'padding',
        padding: '1px'
      }

      let declarations = Utils.getDeclarations(ruleStyle)
      expect(declarations.length).toEqual(2)
      expect(declarations[1].prop).toEqual('padding')
    });
  })

  describe('generateStyles', () => {
    test('can generate styles map from CSS declarations', () => {
      const styles = Utils.generateStyles(rules)
      expect(Array.isArray(styles)).toEqual(true)
      expect(styles.length).toBeGreaterThan(0)
    })

    test('can generate styles containing declarations and selectors', () => {
      const [style] = Utils.generateStyles(rules)
      expect(style.selector).toEqual('span')
      expect(style.declarations['0'].value).toEqual('red')
    })
  })

  describe('generateStyledComponents', () => {

    test('can generate styled components', () => {
      let styles = Utils.generateStyles(rules)
      let components = Utils.generateStyledComponents(styles)
      expect(components.length).toBeGreaterThan(0)
    })

    test('can generate styled components', () => {
      let styles = Utils.generateStyles([])
      let components = Utils.generateStyledComponents(styles)
      expect(components.length).toEqual(0)
    })
  })


  describe('displayInfo', () => {
    let mockedFn = jest.fn((val) => val);
    chalk.red = { bold: mockedFn }
    chalk.green = { bold: mockedFn }

    test('should display info (error level)', () => {
      let info = Utils.displayInfo('error')
      expect(info.search(/error/)).not.toEqual(-1)
    })

    test('should display info (normal level)', () => {
      let info = Utils.displayInfo('success', 'normal')
      expect(info).toEqual('success')
    })
  })

  describe('getLastSelector', () => {
    test('should get last selector from a string of selectors', () => {
      let lastSelector = Utils.getLastSelector('a > b > c')
      expect(lastSelector).toEqual('c')
    })

    test('should get last selector from a string of selectors', () => {
      let lastSelector = Utils.getLastSelector('a + b ~ c')
      expect(lastSelector).toEqual('c')
    })

    test('should get last selector from a string of selectors', () => {
      let lastSelector = Utils.getLastSelector('a  b  c')
      expect(lastSelector).toEqual('c')
    })
  })

  describe('removePrefixInSelector', () => {
    test('should remove class prefix in selector', () => {
      let selector = Utils.removePrefixInSelector('.selector')
      expect(selector).toEqual('selector')
    })
    test('should remove id prefix in selector', () => {
      let selector = Utils.removePrefixInSelector('#selector')
      expect(selector).toEqual('selector')
    })
    test('should return the selector without a prefix', () => {
      let selector = Utils.removePrefixInSelector('selector')
      expect(selector).toEqual('selector')
    })
  })

  describe('toSentenceCase', () => {
    test('should convert selectors to title case', () => {
      let sentenceCased = Utils.toSentenceCase('headerComponent')
      expect(sentenceCased).toEqual('HeaderComponent')
    })
  })
})
