import { ReactNode, useState,  } from 'react';
import MaterialTable from 'material-table';

interface IData {
  avatar?: string | ReactNode;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
}


export const tablePagination = () => {
  const avatar = "/teste.jpg";

  const [tableData, setTableData] = useState<IData[]>([
    { name: "Jonatas", email: "jonatas@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Fernanda", email: "fernanda@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Bruno", email: "bruno@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Felipe", email: "felipe@gmail.com", phone: '(12)  99705-8973', age: 19, gender: '02/22', city: "São José dos Campos"},
    { name: "Leticia", email: "leticia@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Caroline", email: "caroline@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Camila", email: "camila@gmail.com", phone: '(12)  99705-8973', age: 15, gender: '02/22', city: "São José dos Campos"},
    { name: "João", email: "joão@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "Daniel", email: "daniel@gmail.com", phone: '(12)  99705-8973', age: 22, gender: '02/22', city: "São José dos Campos"},
    { name: "José", email: "josé@gmail.com", phone: '(12)  99705-8973', age: 30, gender: '02/22', city: "São José dos Campos"},
    { name: "Miguel", email: "miguel@gmail.com", phone: '(12)  99705-8973', age: 20, gender: '02/22', city: "São José dos Campos"},
  ]);

  const columns = [
    { 
      title: "Avatar", 
      field: "avatar", 
      filtering: false, 
      exports: false, //export
      emptyValue:() => (
        !avatar ? (
        <img src={avatar} alt="teste" style={{ width: 50, height: 50, borderRadius: 99999 }} />
      ) : (
        <img src={avatar} alt="teste" style={{ width: 50, height: 50, borderRadius: 99999 }} />
      ))
    },
    { title: "Name", field: "name", filterPlaceholder: "Filter by name", exports: false },
    { title: "E-mail", field: "email", filterPlaceholder: "Filter by email" },
    { title: "Phone", field: "phone", filterPlaceholder: "Filter by phone" },
    { title: "Age", field: "age", searchable: false, filterPlaceholder: "Filter by age" },
    { title: "Gender", field: "gender", filterPlaceholder: "Filter by gender" },
    { title: "City", field: "city", filterPlaceholder: "Filter by city" },
  ];
  
  return (
    <MaterialTable 
      columns={columns} 
      data={tableData}
      options={{
        searchFieldAlignment: "left", searchAutoFocus: true, filtering: true, paging: true, 
        pageSizeOptions:[5,10, 20, 25, 50, 100], pageSize: 5, paginationType: "stepped",
        exportButton: true, exportFileName: "List Users"
      }}
      title="Student Information"
    />
  )
}
