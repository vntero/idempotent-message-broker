// ------ require amqplib ------
const amqp = require('amqplib/callback_api')

// ------ variables declaration ------
const exchange = 'aeler'
const queue = 'vip'
const key = 'test'
const isDurable = {durable: true}
const isExclusive = {exclusive: true}
const notExclusive = {exclusive: false}
const msg = process.argv.slice(2).join(' ') || "Hello World!"
let args = process.argv.slice(2)
if (args.length == 0) {
    console.log("No messages to be retrieved... I will go back to sleep now.")
    process.exit(1)
}

// ------ 1st step -> connect to the server ------
amqp.connect('amqp://localhost', function(error1, connection) {
    if (error1) throw {error1}
    // ------ 2nd step -> create channel ------
    connection.createChannel(function(error2, channel) {
        if (error2) throw {error2}
        // 3rd step -> assert exchange ------
        channel.assertExchange(exchange, 'direct', isDurable)
        channel.assertQueue(queue, notExclusive, function(error3, q) {
            if (error3) throw {error3}
            console.log('Waiting for messages to come in. To exit press CTRL+C')
            args.forEach(function(key) {
                channel.bindQueue(q.queue, exchange, key)
            })
        channel.consume(q.queue, function(incomingMsg) {
            console.log(" [x] %s: '%s' ", incomingMsg.fields.routingKey, incomingMsg.content.toString())
            channel.ack(incomingMsg)
            })
        })
    })
})