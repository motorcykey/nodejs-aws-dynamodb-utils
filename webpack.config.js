var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib/index.pack.js'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [ 'style-loader', MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: './styles/styles.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};