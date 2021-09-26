# sc-gen
sc-gen is a tool to migrate stylesheets written in several CSS dialects to Styled Components. sc-gen can transform your less, css or scss files to use the styled components styling pattern.

# Installation
Using [npm](http://npmjs.org)

```bash
  $ npm install -g sc-gen # or using yarn: yarn global add sc-gen
```

And voila!, sc-gen is accessible globally on your system path.

*OR*
you can run it without installing it to your system path:
```bash
  $ npx sc-gen --source=App.scss
```

## Usage
App.scss
```scss
.container {
  width: 100%;
  div {
    background: green;
  }
}
```

```bash
  $ npx sc-gen --source=App.scss --dest=App.js
```

App.js
```javascript
  const ContainerComponent = styled.container`
        width: 100%;
  `
  
const DivComponent = styled.div`
        background: green;
  `
```

### CLI options:
sc-gen accepts the following options

```bash
    -d, --dest                 (Optional) Output file - prints output to stdout if absent
    -q, --quiet                (Optional) Suppresses non-error log output
    -v, --version              Prints version info
```
## License

See [LICENSE](https://github.com/micah-akpan/styled-components-generator-cli/blob/dev/LICENSE) for details.
