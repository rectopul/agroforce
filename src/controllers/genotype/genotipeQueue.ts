import Bull from 'bull';
import handleError from 'src/shared/utils/handleError';
import { GenotipoController } from './genotipo.controller';
import { ImportGenotypeController } from './import-genotype.controller';

const genotipoController = new GenotipoController();

export const genotipeQueue = new Bull(
  'genotipo_queue',
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

genotipeQueue
  .isReady()
  .then(() => {
    console.log(`genotipe queue is connected to redis at ${process.env.REDIS_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });

genotipeQueue.process(async (job, done) => {
  try {
    // const { aux } = job.data;
    // if (job.data.request_type == 'update') {
    //   await genotipoController.update(job.data.instance);
    // } else {
    //   const genotipo: any = await genotipoController.create(job.data.instance);
    //   aux.id_genotipo = genotipo.response.id;
    // }

    // if (aux.id_genotipo && aux.ncc) {
    //   if (aux.id_lote) {
    //     const lote_obj = {
    //       id: Number(aux.id_lote),
    //       id_genotipo: Number(aux.id_genotipo),
    //       id_safra: Number(aux.id_safra),
    //       cod_lote: String(aux.cod_lote),
    //       id_s2: Number(aux.id_s2),
    //       id_dados: Number(aux.id_dados_lote),
    //       year: Number(aux.year),
    //       ncc: Number(aux.ncc),
    //       fase: aux.fase,
    //       peso: aux.peso,
    //       quant_sementes: aux.quant_sementes,
    //       dt_export: aux.dt_export,
    //       created_by: aux.created_by,
    //     };
    //     loteQueue.add({
    //       instance: lote_obj,
    //       request_type: 'update',
    //     });
    //     delete aux.id_lote;
    //     delete aux.id_genotipo;
    //   } else {
    //     const lote_obj = {
    //       id_genotipo: Number(aux.id_genotipo),
    //       id_safra: Number(aux.id_safra),
    //       cod_lote: String(aux.cod_lote),
    //       id_s2: Number(aux.id_s2),
    //       id_dados: Number(aux.id_dados_lote),
    //       year: Number(aux.year),
    //       ncc: Number(aux.ncc),
    //       fase: aux.fase,
    //       peso: aux.peso,
    //       quant_sementes: aux.quant_sementes,
    //       dt_export: aux.dt_export,
    //       created_by: aux.created_by,
    //     };
    //     loteQueue.add({
    //       instance: lote_obj,
    //       request_type: 'create',
    //     });
    //   }
    // }
    await ImportGenotypeController.validate(job.data.logId, true, job.data.instance);
    done();
  } catch (error: any) {
    handleError('Genótipo controller', 'Save Import', error.message);
  }
});
