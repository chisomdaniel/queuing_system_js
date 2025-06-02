import { createClient } from "redis";

const subscriber = createClient();

// export default client;

subscriber.on('error', (err) => console.log('Redis client not connected to the server:', err));
subscriber.on('connect', () => console.log('Redis client connected to the server'));

(async () => {
    await subscriber.connect();

    await subscriber.subscribe('ALXchannel', async (message, channel) => {
        console.log(message);
        if (message === 'KILL_SERVER') {
            await subscriber.unsubscribe('ALXchannel');
            await subscriber.quit();
        }
    });
})()
