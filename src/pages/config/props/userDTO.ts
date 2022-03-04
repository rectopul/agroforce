import { IProfile } from './index';

export interface IUsers {
  name: string;
  email: string;
  cpf: string;
  tel: string;
  password: string;
  registration: number;
  jivochat: number;
  status?: number;
  created_by: any;
  departmentId: number;
  confirmPassword: string;
  app_login: number;
  profiles: IProfile[];
  // profiles: [{ profileId: number, created_by: number }];
}
