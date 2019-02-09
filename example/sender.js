const RabbitMqProducer = require("..").RabbitMqProducer;

var options = {
  user: "keyportUser",
  password: "61af24627043f4a26d08",
  ip: "165.227.172.116",
  queue: "indexing"
};

var producer = new RabbitMqProducer(options);

let id = 0;
function send() {
  console.log(producer.send({ data: "qwerty", id: id++, time: new Date() }));
  // setTimeout(send, 100);
}
setTimeout(send, 1000);
