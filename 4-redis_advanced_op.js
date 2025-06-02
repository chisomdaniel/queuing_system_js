import { createClient } from "redis";

const client = createClient();
client.on('error', (err) => console.log('error connecting to redis:', err));
client.on('connect', () => console.log('Connecting to Redis'));
client.on('ready', () => console.log('Redis is ready'));

(async () => {
    await client.connect();
    await client.hSet('ALX', {
        Portland: 50,
        Seattle: 80,
        'New York': 20,
        Bogota: 20,
        Cali: 40,
        Paris: 2
    })

    const value = await client.hGetAll('ALX');
    console.log(value);
})();
