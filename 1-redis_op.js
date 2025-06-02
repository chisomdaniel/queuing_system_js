import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
    console.log('Redis client not connected to the server:', err)
});

(async () => {
    await client.connect();
    console.log('Redis client connected to the server');
})();

async function setNewSchool(schoolName, value) {
    const result = await client.set(schoolName, value);
    console.log('SET result:', result);
}

async function displaySchoolValue(schoolName) {
    const result = await client.get(schoolName);
    console.log('GET result:', result);
}

displaySchoolValue('ALX');
setNewSchool('ALXSanFrancisco', '100');
displaySchoolValue('ALXSanFrancisco');
