import { prisma } from '../pages/api/db/db';
import handleError from "../shared/utils/handleError";
import {instanceOf} from "prop-types";
import {Prisma} from "@prisma/client";
import {BaseRepository} from "./base-repository";

export class ReporteRepository extends BaseRepository {
  async findOne(id: number) {
    const result = await prisma.reportes.findUnique({
      where: { id },

    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.reportes.count({ where });

    const result: object | any = await prisma.reportes.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async create(data: any) {
    try {
      const reporte = await this.getPrisma().reportes.create({data});
      return reporte;
    } catch (e:any) {
      e.data = data;
      handleError('[Histórico de impressão Repository][report] Create error', 'create', e.message, e);
      throw e;
    }
  }

  async update(id: number, data: any) {
    const result = await prisma.reportes.update({
      where: { id },
      data,
    });
    return result;
  }
}
