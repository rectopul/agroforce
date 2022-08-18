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
  status?: number;
  created_by: number | any;
  confirmPassword: string;
  cultures: object | any;
};
