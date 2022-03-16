import IProfile from './profileDTO';

export default interface IUsers {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  tel: string;
  password: string;
  avatar?: string;
  registration: number;
  departmentId: number;
  jivochat: number;
  app_login: number;
  status?: number;
  created_by: number | any;
  confirmPassword: string;
  profiles: IProfile[];
}
