const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: "./admin.js",
  plugins: [
    new HtmlWebpackPlugin({ 
      title: 'admin script',
      template: './admin-template.html',
      filename: '../../admin.html',
      inject: 'head',
      hash: false,
      scriptLoading: 'defer'
    })
  ],
  output: {
    filename: "./[name].admin-[chunkhash].js",
  }
};
