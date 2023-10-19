const path = require("path");

module.exports = {
  entry: "./src/dapp.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  target: "node",
  /* externals: {
    sqlite3: "sqlite3",
  },*/
};
