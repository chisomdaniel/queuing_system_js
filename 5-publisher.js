import { createClient } from "redis";

const client = createClient();
client.on('error', (err) => console.log('Redis client not connected to the server:', err));
client.on('connect', () => console.log('Redis client connected to the server'));

async function publishMessage(message, time) {

    setTimeout(async () => {
        console.log('About to send', message);
        await client.publish('ALXchannel', message);
    }, time);
}

(async () => {
    await client.connect();
    publishMessage("ALX Student #1 starts course", 100);
    publishMessage("ALX Student #2 starts course", 200);
    publishMessage("KILL_SERVER", 300);
    publishMessage("ALX Student #3 starts course", 400);
})()
