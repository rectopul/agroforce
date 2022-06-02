import { BsCheckLgCircle } from "react-icons/bs";

const tabs = [
  { title: 'TMG', value: <BsCheckLgCircle />, status: false },
  { title: 'ENSAIO', value: <BsCheckLgCircle />, status: false },
  { title: 'LOCAL', value: <BsCheckLgCircle />, status: false },
  { title: 'DELINEAMENTO', value: <BsCheckLgCircle />, status: false },
  { title: 'NPE', value: <BsCheckLgCircle />, status: false },
  { title: 'QUADRAS', value: <BsCheckLgCircle />, status: false },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLgCircle />, status: false },
];

const tmgDropDown = [
  { labelDropDown: 'Usuário', hrefDropDown: '/config/tmg/usuarios' },
  { labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra' },
  { labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio' },
  { labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura' },
];

const ensaiosDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const localsDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const DelineamentosDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const npeDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const quadrasDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const configPlanilhasDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

export default {
  tabs,
  tmgDropDown,
  ensaiosDropDown,
  localsDropDown,
  DelineamentosDropDown,
  npeDropDown,
  quadrasDropDown,
  configPlanilhasDropDown,
};
