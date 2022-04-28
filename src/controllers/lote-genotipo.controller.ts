import { LoteGenotipoRepository } from "src/repository/lote-genotipo.repository";
import { number, object, SchemaOf, string } from "yup";

interface ILoteGenotipoDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  status: number;
  created_by: number;
};

type ICreateLoteGenotipo = Omit<ILoteGenotipoDTO, "id" | "status">;

export class LoteGenotipoController {
  loteGenotipoRepository = new LoteGenotipoRepository();

  public readonly required = 'Campo obrigatório';

  async create(data: ICreateLoteGenotipo) {
    try {
      const schema: SchemaOf<ICreateLoteGenotipo> = object({
        id_genotipo:number().integer().required(this.required),
        name: string().required(this.required),
        volume: number().integer().required(this.required),
        created_by: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);
      
      if (!valid) return {status: 400, message: "Dados inválidos"};
      
      const loteGenotipo = await this.loteGenotipoRepository.findByNameRelated(
        data.name,
        data.id_genotipo
      );

      if (loteGenotipo) {
        return { status: 400, message: "Lote já está cadastro. favor consultar os inativos" };
      }

      await this.loteGenotipoRepository.create(data);
  
      return {status: 201, message: "Lote cadastrado com sucesso!"}
    } catch (e) {
      return { status: 400, response: [] };
    }
  }

  async list(id_portfolio: number, id_culture: number) {
    try {
      const response = await this.loteGenotipoRepository.findAll()

      if (!response) {
        return { status: 400, response: [] }
      }

      return {status: 200 , response};
    } catch (e) {
      return { status: 400, response: [] };
    }
  }
}
