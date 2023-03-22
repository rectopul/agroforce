import Bull from 'bull';
import handleError from '../../shared/utils/handleError';
import { ImportExperimentController } from './import-experiment.controller';

export const experimentQueue = new Bull(
  'assayList_queue',
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

experimentQueue
  .isReady()
  .then(() => {
    console.log(`Experiment queue is connected to redis at ${process.env.REDIS_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });

experimentQueue.process(async (job, done) => {
  try {
    await ImportExperimentController.validate(job.data.logId, true, job.data.instance);
    done();
  } catch (error: any) {
    handleError('Experiment controller', 'Queue', error.message);
  }
});
