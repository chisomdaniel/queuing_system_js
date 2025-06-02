import { createClient } from "redis";

const client = createClient();
client.on('error', (err) => console.log('error connecting to redis:', err));
client.on('ready', () => console.log('Redis ready'));

const subscriber = client.duplicate();
subscriber.on('error', (err) => console.log('Error in subscriber', err));

(async () => {
    await client.connect();
    await subscriber.connect();

    await subscriber.subscribe('ALXchannel', (message, channel) => {
        console.log(`Message from ${channel}: ${message}`);
        if (message === 'KILL_SERVER') {
            subscriber.unsubscribe('ALXchannel');
            subscriber.quit();
        }
    });

    await client.publish('ALXchannel', 'Hello World');

    await client.publish('ALXchannel', 'Second message');

    await client.publish('ALXchannel', 'KILL_SERVER');

    await client.publish('ALXchannel', 'NOt delivered');

})();
