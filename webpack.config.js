const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'

console.log('Production:', isProd)

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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      },
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: !isProd,
      mangle: isProd,
      sourceMap: !isProd,
      compress: {
        warnings: false,
        drop_console: isProd
      }
    })
  ],
  target: 'electron'
}
