const RabbitMqProducer = require("..").RabbitMqProducer;

var options = {
  user: "temp",
  password: "temporary",
  ip: "172.17.0.2",
  queue: "qwerty"
};

var producer = new RabbitMqProducer(options);

let id = 0;
function send() {
  console.log(producer.send({ data: "qwerty", id: id++, time: new Date() }));
  setTimeout(send, 100);
}
setTimeout(send, 1000);
