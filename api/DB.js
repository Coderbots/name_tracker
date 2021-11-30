const enviorment = require("./env/environments"),
  PropertiesReader = require("properties-reader"),
  properties = new PropertiesReader(enviorment);

module.exports = {
  DB: properties.get("database.mongodb.url"),
};
