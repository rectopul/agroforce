import { useState } from "react";

interface IUsersProps {
  id: number;
  avatar: string;
  name: string;
  login: string;
  email: string;
  telefone: string;
  status: boolean;
}

// interface Testes {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// }

export function useUsers(pageLimit:  number) {
  const [ users, setUsers ] = useState<IUsersProps[]>([]);
  // const [ testes, setTeste ] = useState<Testes[]>([]);

  function fetchUsers(page: number) {
    const virtualPage = ((page - 1) * pageLimit) <= 0
      ? 0
      : ((page - 1) * pageLimit);

    fetch(
      // Link da API(URL)  TESTE
      `http://jsonplaceholder.typicode.com/photos?_start=${virtualPage}&_limit=${String(pageLimit)}`
      
      // `/usuarios/listagem?${virtualPage}&_limit=${pageLimit}`,
    )
    .then(res => res.json())
    .then(setUsers)
    .catch(window.alert);
  }

  return {
    fetchUsers,
    users
  }
}
