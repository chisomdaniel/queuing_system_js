import { createClient } from "redis";
import express from 'express';
import kue from 'kue';
import e from "express";

// redis client
const client = createClient();
client.on('error', (err) => console.log('Error connecting to redis', err));
client.on('connect', () => console.log('Connected to Redis'));

// kue queue
const queue = kue.createQueue();

// express server
const app = express()
const port = 1245;

// utils
async function reserveSeat(number) {
    await client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
    // return the number of available seats
    return await client.get('available_seats');
}

// start redis
(async () => {
    await client.connect();
    await reserveSeat(50);
})()
let reservationEnabled = true;


// express route
app.get('/available_seats', async (req, res) => {
    res.send(JSON.stringify({
        'numberOfAvailableSeats': String(await getCurrentAvailableSeats()),
    }))
})

app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        res.send(JSON.stringify({'status': 'Reservation are blocked'}));
        return;
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (!err) res.send(JSON.stringify({'status': 'Reservation in process'}))
        else res.send(JSON.stringify({'status': 'Reservation failed'}));
    })
    job.on('complete', () => console.log(`Seat reservation job ${job.id} completed`))
    job.on('failed attempt', (err) => console.log(`Seat reservation job ${job.id} failed: ${err}`))
    job.on('failed', (err) => console.log(`Seat reservation job ${job.id} failed: ${err}`));
})

app.get('/process', (req, res) => {

    queue.process('reserve_seat', async (job, done) => {
        let available = await getCurrentAvailableSeats();
        available -= 1;
        if (available <= 0 ) {
            reservationEnabled = false;
        }
        if (available >= 0) {
            reserveSeat(available)
            done();
        } else {
            done(new Error('Not enough seat available'));
        }
    })
    res.send(JSON.stringify({'status': 'Queue processing'}));
})

app.listen(port, () => console.log('Listerning...'));

