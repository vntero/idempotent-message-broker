// ------ import amqp ------ 
import amqp from 'amqplib/callback_api';

// ------ variables declaration ------
const exchange = 'aeler'
const isDurable = {durable: true}
const msg = process.argv.slice(2).join(' ') || "Hello World!"

// ------ 1st step -> connect to the server ------
amqp.connect('amqp://localhost', function(error1, connection) {
    if (error1) {throw error1}
    // ------ 2nd step -> create the channel ------
    connection.createChannel(function(error2, channel) {
        if (error2) {throw error2}
        // ------ 3rd step -> assert exchange ------
        channel.assertExchange(exchange, 'direct', isDurable)
        // ------ 4th step -> send/publish the message ------
        channel.publish(exchange, '', Buffer.from(msg))
        console.log('[x] Sent %s', msg)
    })

    setTimeout(function() {
        connection.close()
        process.exit(0)
    }, 500)
})



