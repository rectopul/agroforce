import Bull from 'bull';
import handleError from '../../shared/utils/handleError';
import { ImportAssayListController } from './import-assay-list.controller';

export const assayListQueue = new Bull(
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

assayListQueue
  .isReady()
  .then(() => {
    console.log(`Assay list queue is connected to redis at ${process.env.REDIS_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });

assayListQueue.process(async (job, done) => {
  try {
    await ImportAssayListController.validate(job.data.logId, true, job.data.instance);
    done();
  } catch (error: any) {
    handleError('Assay List controller', 'Queue', error.message);
  }
});
