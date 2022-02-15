import {CulturaService} from '../services/cultura.service';
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
}
