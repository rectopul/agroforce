import { useEffect, useState } from "react";

interface IUsers {
  id: number,
  name: string,
  login: string,
  tel: string,
  email: string,
  avatar: string,
  status: boolean,
  created_at: Date,
  created_by: Number,
  cpf: string
}

export function useGetUsers () {
  const [items, setItems] = useState<IUsers[]>([]);
  const [itensPerPage, setItensPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);

  // Arrendondar para 1 acima (ex: 11.1 vai ser 12 pages)
  const pages = Math.ceil(items.length / itensPerPage);
  const startIndex = currentPage * itensPerPage;
  const endIndex = startIndex + itensPerPage;
  const currentItens = items.slice(startIndex, endIndex);

<<<<<<< HEAD
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:3000/api/testes/users`)
      .then(response => response.json())
      .then(data => data) as IUsers[];

      setItems(result);
    }

    fetchData();
  }, []);

=======
 
  useEffect(() => {
     const fetchData = async () => {
       /*
        Exemplo de informaçãoes para paginação 
        take: Quantidade de itens por pagina, 
        skip: Quantidade de itens a serem pulados, inicia com zero 
        e depois é o valor da pagina atual x o valor de itens por pagina.
        const skip = pageClicada - 1 * take;
      */
      const queryParameters = "status=1&take=1&skip=1";
      const result =  userService.getAll(queryParameters).then((response) => {
        setItems(response);
      })
    }
    fetchData();
  }), [false];

>>>>>>> 2abaebad8d7190991d13ffc57cdd6a6197da76fc
  useEffect(() => {
    setCurrentPage(0);
  }, [itensPerPage]);

<<<<<<< HEAD
=======

>>>>>>> 2abaebad8d7190991d13ffc57cdd6a6197da76fc
  return {
    items,
    pages,
    currentItens,
    itensPerPage,
    setCurrentPage,
    setItensPerPage,
    setItems
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 2abaebad8d7190991d13ffc57cdd6a6197da76fc
