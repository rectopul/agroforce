import { useEffect, useState } from "react";

interface IUsers {
  id: number,
  name: string,
  login: string,
  telefone: string,
  email: string,
  avatar: string,
  status: boolean,
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:3000/api/testes/users`)
      .then(response => response.json())
      .then(data => data) as IUsers[];

      setItems(result);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [itensPerPage]);

  return {
    items,
    pages,
    currentItens,
    itensPerPage,
    setCurrentPage,
    setItensPerPage,
    setItems
  }
}