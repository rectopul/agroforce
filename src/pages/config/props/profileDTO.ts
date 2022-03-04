export interface IProfile {
  id: number;
  name?: string;
}

export const profileUser: IProfile[] = [
  { id: 1, name: "Master " },
  { id: 2, name: "Admin" },
  { id: 3, name: "Dados" },
  { id: 4, name: "Coordenador" },
  { id: 5, name: "Pesquisador" },
  { id: 6, name: "Técnico" },
  { id: 7, name: "Visualizador" },
];
