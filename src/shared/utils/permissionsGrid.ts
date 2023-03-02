const permissions = [
  {
    route: '/perfil/perfis',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/perfil/perfis/permissoes',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/tmg/cultura',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/genotipo',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/tmg/lote',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/tmg/safra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/setor',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/tmg/usuarios',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/foco',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/tecnologia',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
    ],
  },
  {
    route: '/config/ensaio/tipo-ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/delineamento/delineamento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/delineamento/delineamento/sequencia-delineamento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/local/lugar-local',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
    ],
  },
  {
    route: '/config/local/unidade-cultura',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/config/quadra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/quadra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/config/quadra/layout-quadra',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'disable', title: 'Inativar', checked: false },
    ],
  },
  {
    route: '/listas/rd',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: '/listas/ensaios/ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/listas/ensaios/genotipos-ensaio',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'change', title: 'Substituir', checked: false },
    ],
  },
  {
    route: '/listas/experimento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'import', title: 'Importar', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/listas/parcelas-experimento',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'change', title: 'Substituir', checked: false },
    ],
  },
  {
    route: '/operacao/ambiente',
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
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
      { value: 'create', title: 'Criar', checked: false },
      { value: 'edit', title: 'Editar', checked: false },
      { value: 'print', title: 'Imprimir', checked: false },
      { value: 'delete', title: 'Excluir', checked: false },
    ],
  },
  {
    route: '/relatorios/logs',
    permissions: [
      { value: 'view', title: 'Ver', checked: false },
    ],
  },
  {
    route: 'config/tmg/quadra/alocacao',
    permissions: [
      { value: 'import', title: 'Importar', checked: false },
    ],
  },
];

export default permissions;
