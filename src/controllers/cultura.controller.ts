import {CulturaService} from '../services/cultura.service';
import {CulturaModule} from '../model/cultura.module';
import { Controller } from '@nestjs/common';

@Controller()
export class CulturaController {
    async getCulture(id: number) {
        const culturaService = new CulturaService;
        if (id === 0) {
            return await culturaService.findAll();
        } else {
            const response = await culturaService.findOne(id); 
            if (!response) {
               return 'Essa cultura não existe';
            } 
        }
    }

    async postCulture(data: object) {
        console.log('data:' + data.name);
        const culturaService = new CulturaService;
        let culturaModel = new CulturaModule;
        if (data != null && data != undefined) {
            culturaModel = data.name;
            return await culturaService.create(culturaModel);
        }
    }
}
