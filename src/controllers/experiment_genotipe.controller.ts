import { ExperimentGenotipeRepository } from 'src/repository/experiment_genotipe.repository';
import handleError from '../shared/utils/handleError';

export class ExperimentGenotipeController {
    private ExperimentGenotipeRepository = new ExperimentGenotipeRepository();

    async create(data: object | any) {
        try {
            // console.log(data)
            const response = await this.ExperimentGenotipeRepository.createMany(data);
            if (response) {
                return { status: 200, message: 'Tratamento experimental registrado' };
            }
            return { status: 400, message: 'Tratamento do experimento não registrado' };
        } catch (error: any) {
            handleError('Tratamento do experimento do controlador', 'Create', error.message);
            throw new Error('[Controller] - Erro ao criar esboço de tratamento do experimento');
        }
    }

}
