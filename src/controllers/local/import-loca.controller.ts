import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';

export class LocalImportController {
  static async validate({
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate): Promise<IReturnObject> {
    return { status: 200, message: 'OK' };
  }
}
