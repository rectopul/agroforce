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

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:3000/api/testes/users`)
      .then(response => response.json())
      .then(data => data) as IUsers[];

      setItems(result);
    }

    fetchData();
  }, []);

  return { items }
}
