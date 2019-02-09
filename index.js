"use strict";
const amqp = require("amqplib");
const EventEmitter = require("events").EventEmitter;

class RabbitMqProducer {
  constructor(options) {
    if (
      options == undefined ||
      !options.ip ||
      !options.queue ||
      !options.user ||
      !options.password
    ) {
      throw new Error("incorrect options to initialize RabbitMqProducer");
    }
    this.queue = options.queue;
    amqp
      .connect(
        "amqp://" + options.user + ":" + options.password + "@" + options.ip
      )
      .then(conn => {
        return conn.createChannel();
      })
      .then(ch => {
        this.channel = ch;
        return ch.assertQueue(this.queue, {
          durable: true
        });
      })
      .then(assertResult => {
        if (assertResult.queue === this.queue) {
          return this;
        }
        throw new Error("requested and created queue names do not match");
      })
      .catch(err => {
        throw err;
      });
  }

  send(content) {
    if (this.channel === undefined) {
      throw new Error(
        "rabbitmqproducer not initialized, channel doesnot exist!"
      );
    }
    let channelStatus = this.channel.sendToQueue(
      this.queue,
      new Buffer.from(JSON.stringify(content)),
      {
        persistent: true
      }
    );
    return channelStatus;
  }
}

class RabbitMqConsumer extends EventEmitter {
  constructor(options) {
    super();
    if (
      options == undefined ||
      !options.ip ||
      !options.queue ||
      !options.user ||
      !options.password
    ) {
      throw new Error("incorrect options to initialize RabbitMqConsumer");
    }
    this.queue = options.queue;
    amqp
      .connect(
        "amqp://" + options.user + ":" + options.password + "@" + options.ip
      )
      .then(conn => {
        return conn.createChannel();
      })
      .then(ch => {
        this.channel = ch;
        return ch.assertQueue(this.queue, {
          durable: true
        });
      })
      .then(assertResult => {
        if (assertResult.queue === this.queue) {
          this.channel.consume(
            this.queue,
            msg => {
              this.emit("data", JSON.parse(msg.content.toString()));
              this.channel.ack(msg);
            },
            { noAck: false }
          );
          return this;
        }
        throw new Error("requested and created queue names do not match");
      });
  }
}

module.exports = {
  RabbitMqConsumer: RabbitMqConsumer,
  RabbitMqProducer: RabbitMqProducer
};
