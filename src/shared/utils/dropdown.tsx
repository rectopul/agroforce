import { AiOutlineFileSearch } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { RiPlantLine, RiSeedlingLine } from "react-icons/ri";

const tabs = [
  { title: 'TMG', value: <BsCheckLg />, status: true, href: '/config/tmg/usuarios' },
  { title: 'ENSAIO', value: <BsCheckLg />, status: false , href: '/config/ensaio/foco' },
  { title: 'LOCAL', value: <BsCheckLg />, status: false , href: '/config/local' },
  { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false , href: '/config/delineamento' },
  { title: 'NPE', value: <BsCheckLg />, status: false , href: '/config/npe' },
  { title: 'QUADRAS', value: <BsCheckLg />, status: false , href: '/config/quadras' },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false, href: '/config/conf-planilhas' },
];

const tmgDropDown =  [
  {labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine/> },
  {labelDropDown: 'Usuário', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser/> },
  {labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange/> },
  {labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio', iconDropDown: <RiPlantLine/> },
  {labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding/> },
];

const ensaiosDropDown =  [
  {labelDropDown: 'Foco', hrefDropDown: '/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch/> },
  {labelDropDown: 'OGM', hrefDropDown: '/config/ensaio/ogm', iconDropDown: <BiUser/> },
  {labelDropDown: 'Tipo de ensaio', hrefDropDown: '/config/ensaio/tipo-ensaio', iconDropDown: <MdDateRange/> },
];

const localsDropDown =  [
  {labelDropDown: 'Local', hrefDropDown: '/config/local', iconDropDown: <AiOutlineFileSearch/> },
];

const layoutQuadrasDropDown =  [
  {labelDropDown: 'Layout quadra', hrefDropDown: '/config/layout-quadra', iconDropDown: <AiOutlineFileSearch/> },
];

const delineamentosDropDown =  [
  {labelDropDown: 'Delineamento', hrefDropDown: '/config/delineamento', iconDropDown: <AiOutlineFileSearch/> },
];

const npeDropDown =  [
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
  delineamentosDropDown,
  npeDropDown,
  layoutQuadrasDropDown,
  configPlanilhasDropDown,
};
