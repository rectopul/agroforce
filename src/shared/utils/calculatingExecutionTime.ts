import { LogImportController } from '../../controllers/log-import.controller';
import { IReturnObject } from '../../interfaces/shared/Import.interface';

function millisecondsToMinutesAndSeconds(milliseconds: number) {
  if (milliseconds < 1000) {
    return '0:01';
  }
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default async function calculatingExecutionTime(id: number) {
  const logImportController = new LogImportController();
  const { response }: IReturnObject = await logImportController.getOne(id);
  const executeTime = millisecondsToMinutesAndSeconds((Date.now() - response.created_at.getTime()));
  return executeTime;
}
