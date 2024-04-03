const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const UglifyJS = require('uglify-js')
const { paths } = require('../webpack-utils')

const PLUGIN_NAME = 'webpackWidgetLoaderPlugin'
const extensionRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i

function writeJavaScriptLoader(entryName, outputPath, params) {
  const result = ejs.render(
    fs.readFileSync(paths.webpack('widget-loader/widget-loader-template.js.ejs'), 'utf8'),
    { ...params },
  )

  fs.writeFileSync(
    path.resolve(__dirname, outputPath, `${entryName}-loader.js`),
    params.env === 'production' ? UglifyJS.minify(result).code : result,
  )
}

module.exports = class WebpackWidgetLoaderPlugin {
  constructor(options) {
    this.settings = Object.assign({ chunkNames: {} }, options)
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      for (const [name, entry] of compilation.entrypoints) {
        if (
          Object.keys(this.settings.chunkNames).length ? this.settings.chunkNames?.[name] : true
        ) {
          const files = {
            scripts: [],
            stylesheets: [],
            env: this.settings.env,
          }

          entry.getFiles().forEach((file) => {
            const matches = file.match(extensionRegex)
            const extension = matches?.[1]

            switch (extension) {
              case 'js': {
                files.scripts.push(file)
                break
              }
              case 'css': {
                files.stylesheets.push(file)
                break
              }
            }
          })

          writeJavaScriptLoader(name, compilation.outputOptions.path, files)
        }
      }
    })
  }
}
