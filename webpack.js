const CleanWebpackPlugin = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const common = {
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, "node_modules")],
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  target: "node"
};

module.exports = merge(common, {
  devtool: "source-map",
  entry: [path.join(__dirname, "src/app.ts")],
  externals: [nodeExternals({})],
  mode: "production",
  plugins: [new CleanWebpackPlugin()]
});
