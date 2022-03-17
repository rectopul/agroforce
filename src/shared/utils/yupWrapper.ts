import type { SchemaOf } from 'yup';

const yupWrapper =
  <T>(schema: SchemaOf<T>) =>
  (values: T): T => {
    try {
      return schema.validateSync(values, { stripUnknown: true }) as T;
    } catch (err) {
      throw new Error('Erro de validação!');
    }
  };

export { yupWrapper };
