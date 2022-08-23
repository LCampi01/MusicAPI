const redis = require("redis");

const client = redis.createClient({
  legacyMode: true,
  host: "127.0.0.1",
  port: 6379,
});

module.exports = client;
