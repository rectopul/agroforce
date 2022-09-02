export default interface IDepartment {
  id: number;
  name?: string;
};

export default interface IAllDepartments {
  departments: IDepartment[];
};
