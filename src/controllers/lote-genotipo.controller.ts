import { prisma } from "src/pages/api/db/db";
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
type IUpdateLoteGenotipo = Omit<ILoteGenotipoDTO, "created_by" | "status" | "id_genotipo">;
type IfindOneLoteGenotipo = Omit<ILoteGenotipoDTO, "id_genotipo" | "name" | "volume" | "status" | "created_by">;

export class LoteGenotipoController {
  loteGenotipoRepository = new LoteGenotipoRepository();

  public readonly required = 'Campo obrigatório';

  async findOne({ id }: IfindOneLoteGenotipo) {
    try {
      const loteGenotipo = await this.loteGenotipoRepository.findById(id);

      if(!loteGenotipo) {
        return { status: 400, message: "Item não encontrado!" };
      }

      return { status: 200, loteGenotipo };
    } catch {
      return { status: 400, message: "Item não encontrado!" };
    }
  }

  async update(data: IUpdateLoteGenotipo) {
    try {
      const schema: SchemaOf<IUpdateLoteGenotipo> = object({
        id: number().integer().required(this.required),
        name: string().required(this.required),
        volume: number().integer().required(this.required),
      });

      const valid = schema.isValidSync(data);
      
      if (!valid) return {status: 400, message: "Dados inválidos"};

      const loteGenotipo = await this.loteGenotipoRepository.findById(data.id);

      if (!loteGenotipo) {
        return { status: 400, message: "Lote não encontrado!" };
      }
      
      const loteGenotipoExists = await this.loteGenotipoRepository.findByName(
        data.name
      );

      if (loteGenotipoExists && loteGenotipoExists.id !== loteGenotipo.id) {
        return { status: 400, message: "Nome da cultura já existente. favor consultar os inativos" };
      }

      await this.loteGenotipoRepository.update({
        id: data.id,
        name: data.name,
        volume: data.volume,
      });
  
      return {status: 200, message: "Lote atualizado com sucesso!"};
    } catch (e) {
      return { status: 400, message: "Erro ao atualizar lote!" };
    }
  }

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

  async list(id_genotipo: number) {
    try {
      const responseGet = await prisma.lote.findMany({
        where: {
          id_portfolio: Number(id_genotipo),
        },
        include: {
          portfolio: {
            select: {
              id: true,
              genealogy: true,
              id_culture: true,
            }
          }
        }
      });
    
      const data = responseGet.map(item => {
        return {
          id: item.id,
          id_culture: item.portfolio.id_culture,
          id_genotipo: item.portfolio.id,
          genealogy: item.portfolio.genealogy,
          name: item.name,
          volume: item.volume,
          status: item.status,
        }
      });

      return {status: 200 , data};
    } catch (e) {
      return { status: 400, response: [] };
    }
  }
}
