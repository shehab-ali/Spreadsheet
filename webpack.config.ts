import webpack from 'webpack'

module.exports = {

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
}