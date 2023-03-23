const permissions = [
  {
    route: '/perfil/perfis',
    name: 'Perfil',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/perfil/perfis/permissoes',
    name: 'Permissões',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/tmg/cultura',
    name: 'Cultura',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/genotipo',
    name: 'Genótipo',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      // { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/tmg/lote',
    name: 'Lote',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/tmg/safra',
    name: 'Safra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/setor',
    name: 'Setor',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/usuarios',
    name: 'Usuários',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/foco',
    name: 'Foco',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/tecnologia',
    name: 'Tecnologia',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      // { value: 'import', title: 'Importar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/tipo-ensaio',
    name: 'Tipo de ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/delineamento',
    name: 'Delineamento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/delineamento/sequencia-delineamento',
    name: 'Sequencia de delineamento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/local/local',
    name: 'Local',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      // { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/local/unidade-cultura',
    name: 'Unidade de cultura',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/quadra',
    name: 'Quadra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/quadra/layout-quadra',
    name: 'Layout de quadra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/listas/rd',
    name: 'RD',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
    ],
  },
  {
    route: '/listas/ensaios/ensaio',
    name: 'Ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/listas/ensaios/genotipos-ensaio',
    name: 'Genótipos do ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'change', title: 'Substituir', checked: false },
    ],
  },
  {
    route: '/listas/experimentos/experimento',
    name: 'Experimento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/listas/experimentos/parcelas-experimento',
    name: 'Parcelas do experimento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'change', title: 'Substituir', checked: false },
    ],
  },
  {
    route: '/operacao/ambiente',
    name: 'Ambiente',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
      { value: 'sort', title: 'Sortear', checked: false },
    ],
  },
  {
    route: '/operacao/etiquetagem',
    name: 'Etiquetagem',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'print', title: 'Imprimir', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/logs',
    name: 'Logs',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: 'config/tmg/quadra/alocacao',
    name: 'Alocação',
    permissions: [
      { value: 'import', title: 'Importar', checked: false },
    ],
  },
];

export default permissions;
