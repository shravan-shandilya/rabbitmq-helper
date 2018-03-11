rabbitmq-helper
=========

An easy to use module for rabbitmq worker queues. Create consumer and producers for rabbitmq worker queue

## Installation

  `npm install rabbitmq-helper@latest`

## Usage

**Producer**
```
const RabbitMqProducer = require('..').RabbitMqProducer;

var options = {
    ip: '172.17.0.2',
    queue: 'qwerty'
};

var producer = new RabbitMqProducer(options);

let id = 0;
function send(){
    console.log(producer.send({data:'qwerty',id:id++,time:new Date()}));
    setTimeout(send,100);
}
setTimeout(send,1000);
```

**Consumer**
```
const RabbitMqConsumer = require('..').RabbitMqConsumer;

var options = {
    ip: '172.17.0.2',
    queue: 'qwerty'
};

var consumer = new RabbitMqConsumer(options);

consumer.on('data',console.log);

consumer.start();

//consumer.stop();
```


## Tests

  `:( not yet`

## Contributing

This was a very quick hack. PRs are welcome!