const { createClient } = require('redis');

const client = createClient(); // default localhost:6379

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function run() {
  await client.connect();

  // Set a value
  await client.set('key', 'value');

  // Get the value
  const value = await client.get('key');
  console.log('Value from Redis:', value);

  await client.quit();
}

run();


// (async () => {
//     const client = await createClient()
//         .on('error', (err) => console.log('Redis client not connected to the server:', err))
//         .connect();
//     console.log('Redis client connected to the server')

//     await client.set("key", "hello");
//     const value = await client.get('key');
//     console.log('this is it', value);

//     client.destroy();
// })()

