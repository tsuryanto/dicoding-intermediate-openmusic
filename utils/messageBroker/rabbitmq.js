const amqp = require('amqplib');
const config = require('../constant/Config');

const Publish = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    try {
      await channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      throw new Error('failed send to queue');
    }

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = Publish;
