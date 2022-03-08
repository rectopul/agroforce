import { ReactNode, useEffect, useState } from "react";
import { userService } from "src/services";

interface IUsers {
  id: number,
  name: string,
  tel: string,
  email: string,
  avatar: string | ReactNode,
  status: boolean,
  created_at: Date,
  created_by: Number,
  cpf: string
}

export function useGetUsers () {
  const [items, setItems] = useState<IUsers[]>([]);
  const [take, setTake] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const total = 200;

  // Arrendondar para 1 acima (ex: 11.1 vai ser 12 pages)
  const pages = Math.ceil(total / take);
  const skip = currentPage * take;

  // const currentItens = items.slice(startIndex, endIndex);
  // const endIndex = startIndex + itensPerPage;

 
  useEffect(() => {
     const fetchData = async () => {
      const queryParameters = `status=1&take=1&skip=1`;
      await userService.getAll(queryParameters).then((response: IUsers[]) => {
        setItems(response);
      });
    }
    fetchData();
  }), [];


  return {
    items,
    pages,
    // currentItens,
    take,
    setCurrentPage,
    setTake,
    setItems
  }
}
