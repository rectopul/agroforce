import Bull from 'bull';
import handleError from '../../shared/utils/handleError';
import { ImportDelimitationController } from './delimitation-import.controller';

export const delimitationQueue = new Bull(
  'delimitation_queue',
  process.env.REDIS_URL as string,
  {
    defaultJobOptions: {
      delay: 5000,
      removeOnComplete: true,
    },
    limiter: {
      max: 1000,
      duration: 5000,
    },
  },
);

delimitationQueue
  .isReady()
  .then(() => {
    console.log(`Delimitation queue is connected to redis at ${process.env.REDIS_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });

delimitationQueue.process(async (job, done) => {
  try {
    await ImportDelimitationController.validate(job.data.logId, true, job.data.instance);
    done();
  } catch (error: any) {
    handleError('Delimitation controller', 'Queue', error.message);
  }
});
