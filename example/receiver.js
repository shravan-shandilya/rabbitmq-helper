const RabbitMqConsumer = require('..').RabbitMqConsumer;

var options = {
    ip: '172.17.0.2',
    queue: 'qwerty'
};

var consumer = new RabbitMqConsumer(options);

consumer.on('data',console.log);

consumer.start();

//consumer.stop();