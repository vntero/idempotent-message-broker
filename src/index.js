// ------ import amqp ------ 
var amqp = require('amqplib/callback_api');
// ------ variables declaration ------
var exchange = 'aeler';
var isDurable = { durable: true };
var msg = process.argv.slice(2).join(' ') || "Hello World!";
// ------ 1st step -> connect to the server ------
amqp.connect('amqp://localhost', function (error1, connection) {
    if (error1) {
        throw error1;
    }
    // ------ 2nd step -> create the channel ------
    connection.createChannel(function (error2, channel) {
        if (error2) {
            throw error2;
        }
        // ------ 3rd step -> assert exchange ------
        channel.assertExchange(exchange, 'direct', isDurable);
        // ------ 4th step -> send/publish the message ------
        channel.publish(exchange, '', Buffer.from(msg));
        console.log('[x] Sent %s', msg);
    });
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});
