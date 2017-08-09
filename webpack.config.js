const path = require('path')

module.exports = {
  entry: {
    bundle: './lib/index.js',
    about: './lib/pages/about.js',
    preload: './lib/utils/webview-preload.js'
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
