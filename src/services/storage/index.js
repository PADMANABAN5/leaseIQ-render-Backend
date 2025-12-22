const provider = process.env.STORAGE_PROVIDER;

if (provider === "gcp") {
  module.exports = require("./gcp.storage");
} else {
  module.exports = require("./do.storage");
}
