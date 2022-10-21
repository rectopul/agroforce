import Bull from 'bull';
import { LoteController } from '../lote.controller';

const loteController = new LoteController();
export const loteQueue = new Bull(
    'lote_queue',
    process.env.REDIS_URL as string,
    {
        defaultJobOptions: {
            delay: 5000,
            removeOnComplete: true
        },
        limiter: {
            max: 1000,
            duration: 5000
        }
    }
);

loteQueue
    .isReady()
    .then(() => {
        console.log(`lote queue is connected to redis at ${process.env.REDIS_URL}`);
    })
    .catch((error) => {
        console.log(error);
    })

loteQueue.process(async (job, done) => {
    if (job.data.request_type == 'update') {
        await loteController.update(job.data.instance);
    } else {
        await loteController.create(job.data.instance);
    }
    done();
});