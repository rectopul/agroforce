import { BsCheckLg } from "react-icons/bs";

const tabs = [
  { title: 'TMG', value: <BsCheckLg />, status: false },
  { title: 'ENSAIO', value: <BsCheckLg />, status: false  },
  { title: 'LOCAL', value: <BsCheckLg />, status: false  },
  { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false  },
  { title: 'NPE', value: <BsCheckLg />, status: false  },
  { title: 'QUADRAS', value: <BsCheckLg />, status: false  },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false },
];

const tmgDropDown =  [
  {labelDropDown: 'Usuário', hrefDropDown: 'http://localhost:3000/config/tmg/usuarios'},
  {labelDropDown: 'Safra', hrefDropDown: 'http://localhost:3000/config/tmg/safra'},
  {labelDropDown: 'Portfólio', hrefDropDown: 'http://localhost:3000/config/tmg/portfolio'},
  {labelDropDown: 'Cultura', hrefDropDown: 'http://localhost:3000/config/tmg/cultura'},
];

const ensaiosDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

const localsDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

const DelineamentosDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

const npeDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

const quadrasDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

const configPlanilhasDropDown =  [
  {labelDropDown: 'Não definido', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
  {labelDropDown: 'Teste', hrefDropDown: '#'},
];

export { 
  tabs, 
  tmgDropDown,
  ensaiosDropDown,
  localsDropDown,
  DelineamentosDropDown,
  npeDropDown,
  quadrasDropDown,
  configPlanilhasDropDown,
};
