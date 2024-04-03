const webpack = require('webpack');
const { paths } = require('./webpack-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackWidgetLoaderPlugin = require('./widget-loader/webpack-widget-loader-plugin');
const dotenv = require('dotenv');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    mode: options.mode,
    target: 'web',
    entry: [paths.src('react/index.tsx')],
    output: {
      filename: '[name]-[hash].js',
      path: paths.dist(),
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'javascript/auto',
          loader: 'base64-inline-loader',
          options: {
            name: '[path][name].[ext]',
            context: paths.src(),
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'javascript/auto',
          exclude: /images/,
          loader: 'base64-inline-loader',
          options: {
            name: '[path][name].[ext]',
            context: paths.src(),
            esModule: false,
          },
        },
        {
          test: /\.svg$/,
          issuer: /\.ts$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                encoding: 'base64',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      roots: [paths.src()],
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': paths.src(),
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          ...dotenv.config().parsed,
          NODE_ENV: isProduction
            ? JSON.stringify('production')
            : JSON.stringify('development'),
        }),
      }),
      new WebpackWidgetLoaderPlugin({
        env: isProduction ? 'production' : 'development',
      }),
      new HtmlWebpackPlugin({
        template: paths.webpack('index.html'),
        inject: true,
        minify: true,
      }),
    ],
  };
};
