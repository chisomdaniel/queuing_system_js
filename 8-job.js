export default function createPushNotificationsJobs(jobs, queue) {
    if (jobs instanceof Array === false) {
        throw new Error('Jobs is not an array');
    }

    for (let each of jobs) {
        const job = queue.create('push_notification_code_3', each).save((err) => {
            if (!err) console.log(`Notification job created: ${job.id}`);
        })
        job.on('complete', () => console.log(`Notification job ${job.id} completed`));
        job.on('failed attempt', (errorMessage) => console.log(`Notification job ${job.id} failed"`, errorMessage));
        job.on('failed', (errorMessage) => console.log(`Notification job ${job.id} failed`, errorMessage));
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`)
        })
    }
}
