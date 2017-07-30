const path = require('path')

const webpack = require('webpack')

module.exports = {
  entry: {
    bundle: './lib/index.js',
    about: './lib/pages/about.js'
  },
  output: {
    path: path.join(__dirname, 'app', 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  target: 'electron'
}
