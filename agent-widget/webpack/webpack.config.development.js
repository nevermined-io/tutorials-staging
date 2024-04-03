const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { paths } = require('./webpack-utils')
const common = require('./webpack.config.common.js')

module.exports = (env, options) =>
  merge(common(env, options), {
    devtool: 'inline-source-map',
    devServer: {
      static: {
        directory: paths.dist(),
      },
      devMiddleware: {
        writeToDisk: true,
      },
      port: process.env.PORT || 3000,
    },
  })
