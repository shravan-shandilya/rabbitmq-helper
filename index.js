"use strict";
const amqp = require("amqplib");
const EventEmitter = require("events").EventEmitter;
const util = require("util");

class RabbitMqProducer {
  constructor(options) {
    if (
      options == undefined ||
      !options.ip ||
      !options.queue ||
      !option.user ||
      !option.password
    ) {
      throw new Error("incorrect options to initialize RabbitMqProducer");
    }
    this.queue = options.queue;
    this.ip = options.ip;
    amqp
      .connect(
        "amqp://" + options.user + ":" + options.password + "@" + options.ip
      )
      .then(conn => {
        return conn.createChannel();
      })
      .then(ch => {
        this.channel = ch;
        return ch.assertQueue(options.queue, {
          durable: true
        });
      })
      .then(assertResult => {
        if (assertResult.queue === options.queue) {
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
      new Buffer(JSON.stringify(content)),
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
    this.status = false;
    amqp
      .connect("amqp://" + options.ip)
      .then(conn => {
        return conn.createChannel();
      })
      .then(ch => {
        this.channel = ch;
        return ch.assertQueue(options.queue, {
          durable: true
        });
      })
      .then(assertResult => {
        if (assertResult.queue === options.queue) {
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

  start() {
    this.status = true;
  }

  stop() {
    this.status = false;
  }
}

module.exports = {
  RabbitMqConsumer: RabbitMqConsumer,
  RabbitMqProducer: RabbitMqProducer
};
