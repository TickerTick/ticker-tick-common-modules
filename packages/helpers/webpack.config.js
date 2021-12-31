const path = require("path");

module.exports = {
  mode: "production",
  entry: ["regenerator-runtime/runtime.js", "./lib/index.js"],
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
