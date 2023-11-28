import { AMQPClient } from '@cloudamqp/amqp-client'

async function run() {
  try {
    const amqp = new AMQPClient("amqps://admin:DarwinAdmin2023@b-b9cdce92-9b83-4af8-a1f5-77c39d056137.mq.ap-south-1.amazonaws.com:5671")
    const conn = await amqp.connect()
    const ch = await conn.channel()
    const q = await ch.queue()
    const consumer = await q.subscribe({noAck: true}, async (msg) => {
      console.log(msg.bodyToString())
      await consumer.cancel()
    })
    await q.publish("Hello World", {deliveryMode: 2})
      console.log(consumer)
    await consumer.wait() // will block until consumer is canceled or throw an error if server closed channel/connection
    // await conn.close()
  } catch (e) {
    console.error("ERROR", e)
    e.connection.close()
    setTimeout(run, 1000) // will try to reconnect in 1s
  }
}

run()
