import { AiOutlineFileSearch } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { RiPlantLine, RiSeedlingLine } from "react-icons/ri";

const tabs = [
  { title: 'TMG', value: <BsCheckLg />, status: true, href: 'http://localhost:3000/config/tmg/usuarios' },
  { title: 'ENSAIO', value: <BsCheckLg />, status: false , href: 'http://localhost:3000/config/ensaio/foco' },
  { title: 'LOCAL', value: <BsCheckLg />, status: false , href: 'http://localhost:3000/config/local' },
  { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false , href: 'http://localhost:3000/config/delineamento' },
  { title: 'NPE', value: <BsCheckLg />, status: false , href: 'http://localhost:3000/config/npe' },
  { title: 'QUADRAS', value: <BsCheckLg />, status: false , href: 'http://localhost:3000/config/quadras' },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false, href: 'http://localhost:3000/config/conf-planilhas' },
];

const tmgDropDown =  [
  {labelDropDown: 'Cultura', hrefDropDown: 'http://localhost:3000/config/tmg/cultura', iconDropDown: <RiSeedlingLine/> },
  {labelDropDown: 'Usuário', hrefDropDown: 'http://localhost:3000/config/tmg/usuarios', iconDropDown: <BiUser/> },
  {labelDropDown: 'Safra', hrefDropDown: 'http://localhost:3000/config/tmg/safra', iconDropDown: <MdDateRange/> },
  {labelDropDown: 'Portfólio', hrefDropDown: 'http://localhost:3000/config/tmg/portfolio', iconDropDown: <RiPlantLine/> },
];

const ensaiosDropDown =  [
  {labelDropDown: 'Foco', hrefDropDown: 'http://localhost:3000/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch/> },
  {labelDropDown: 'OGM', hrefDropDown: 'http://localhost:3000/config/ensaio/ogm', iconDropDown: <BiUser/> },
  {labelDropDown: 'Tipo de ensaio', hrefDropDown: 'http://localhost:3000/config/ensaio/tipo-de-ensaio', iconDropDown: <MdDateRange/> },
];

const localsDropDown =  [
  {labelDropDown: 'Local', hrefDropDown: 'http://localhost:3000/config/local', iconDropDown: <AiOutlineFileSearch/> },
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

// eslint-disable-next-line import/no-anonymous-default-export
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
