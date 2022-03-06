export interface IDepartment {
  id: number;
  name?: string;
}

export interface IAllDepartments {
  departments: IDepartment[];
}
