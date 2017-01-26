module.exports = {
  context: __dirname,
  entry: './src/js/index.js',
  output: {
    path: './dist/js',
    publicPath: '/dist/js/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
};
