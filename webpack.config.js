const path = require("path");
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "./dist/"
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: ["babel-loader", "ts-loader"] }
    ]
  }
}