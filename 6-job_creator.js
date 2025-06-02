import kue from 'kue';

const queue = kue.createQueue();

const obj = {
    phoneNumber: '23412345',
    message: 'Hello Jobs! Guess whatt??? He is ALIVE!',
}

const job = queue.create('push_notification_code', obj).save((err) => {
    if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => console.log('Notification job completed'));
job.on('failed attempt', () => console.log('Notification job failed'));
job.on('failed', () => console.log('Notification job failed'));


