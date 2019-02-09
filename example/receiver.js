const RabbitMqConsumer = require("..").RabbitMqConsumer;

var options = {
  user: "keyportUser",
  password: "61af24627043f4a26d08",
  ip: "165.227.172.116",
  queue: "indexing"
};

var consumer = new RabbitMqConsumer(options);

consumer.on("data", console.log);
