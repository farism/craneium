const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { NormalModuleReplacementPlugin } = require('webpack')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: '/node_modules/',
      },
      // {
      //   test: require.resolve('Phaser'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: {
      //       globalName: 'Phaser',
      //       override: true,
      //     },
      //   },
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'src/assets' },
        { from: 'favicon.ico', to: 'favicon.ico' },
      ],
    }),
    new NormalModuleReplacementPlugin(
      /phaser\/dist\/phaser\.js/,
      path.join(__dirname, '/phaser/phaser.js')
    ),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    host: 'localhost',
    port: 8080,
    open: false,
  },
}
