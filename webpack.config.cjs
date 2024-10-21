const path = require('path');

/** @type {import("webpack").Configuration} */
module.exports = {
  entry: path.resolve(__dirname, "src/main.ts"),
  mode: "production",
  target: ["es2020"],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    minimize: true,
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'BP/scripts'),
  },
  experiments: {
    outputModule: true
  },
  externalsType: "module",
  externals: {
    "@minecraft/server": "@minecraft/server",
    "@minecraft/server-ui": "@minecraft/server-ui",
    "@minecraft/server-admin": "@minecraft/server-admin",
    // "@minecraft/server-gametest": "@minecraft/server-gametest",
    "@minecraft/server-net": "@minecraft/server-net",
    "@minecraft/server-common": "@minecraft/server-common",
    "@minecraft/debug-utilities": "@minecraft/debug-utilities",
  },
};
