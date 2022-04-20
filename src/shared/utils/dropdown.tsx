import { ReactNode } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BiArea, BiUser } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { RiPlantLine, RiSeedlingLine } from "react-icons/ri";

interface IDropDown {
  labelDropDown: string;
  hrefDropDown: string;
  iconDropDown: ReactNode;
}
interface IContentProps {
  titleTab: string;
  valueTab: ReactNode;
  statusTab: boolean;
  // handleStatusTabs?: (title: string, status: boolean) => void;

  data: IDropDown[];
};

export function TabsDropDowns () {
  const tabsConfig: IContentProps[] = [
    { 
      titleTab: 'TMG', valueTab: <BsCheckLg />, statusTab: true,
      data: [
        {labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine/>},
        {labelDropDown: 'Usuários', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser/> },
        {labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding/> },
        {labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange/> },
        {labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio', iconDropDown: <RiPlantLine/> },
      ],
    },
    { 
      titleTab: 'ENSAIO', valueTab: <BsCheckLg />, statusTab: false,
      data: [
        { labelDropDown: 'Tipo de ensaio', hrefDropDown: '/config/ensaio/tipo-ensaio', iconDropDown: <MdDateRange/> },
        { labelDropDown: 'Foco', hrefDropDown: '/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch/> },
        { labelDropDown: 'OGM', hrefDropDown: '/config/ensaio/ogm', iconDropDown: <BiUser/> },
      ],
    },
    { 
      titleTab: 'DELINEAMENTO', valueTab: <BsCheckLg />, statusTab: false,
      data: [
        { labelDropDown: 'Delineamento', hrefDropDown: '/config/delineamento', iconDropDown: <AiOutlineFileSearch/> },
      ],
    },
    { 
      titleTab: 'LOCAL', valueTab: <BsCheckLg />, statusTab: false , 
      data: [
        { labelDropDown: 'Local', hrefDropDown: '/config/local', iconDropDown: <FiMapPin/> },
      ],
    },
    // {
    //   titleTab: 'QUADRAS', valueTab: <BsCheckLg />, statusTab: false,
    //   data: [
    //     { labelDropDown: 'Layout quadra', hrefDropDown: '/config/layout-quadra', iconDropDown: <BiArea/> },
    //   ],
    // },
  ];

  return tabsConfig;
}


const tabs = [
  { title: 'TMG', value: <BsCheckLg />, status: true, href: '/config/tmg/usuarios' },
  { title: 'ENSAIO', value: <BsCheckLg />, status: false , href: '/config/ensaio/foco' },
  { title: 'LOCAL', value: <BsCheckLg />, status: false , href: '/config/local' },
  { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false , href: '/config/delineamento' },
  // { title: 'NPE', value: <BsCheckLg />, status: false , href: '/config/npe' },
  // { title: 'QUADRAS', value: <BsCheckLg />, status: false , href: '/config/layout-quadra' },
  // { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false, href: '/config/conf-planilhas' },
];

const tmgDropDown =  [
  {labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine/> },
  {labelDropDown: 'Usuário', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser/> },
  {labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange/> },
  {labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio', iconDropDown: <RiPlantLine/> },
  {labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding/> },
];

const ensaiosDropDown =  [
  {labelDropDown: 'Tipo de ensaio', hrefDropDown: '/config/ensaio/tipo-ensaio', iconDropDown: <MdDateRange/> },
  {labelDropDown: 'Foco', hrefDropDown: '/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch/> },
  {labelDropDown: 'OGM', hrefDropDown: '/config/ensaio/ogm', iconDropDown: <BiUser/> },
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
  TabsDropDowns,
  tabs,
  tmgDropDown,
  ensaiosDropDown,
  localsDropDown,
  delineamentosDropDown,
  npeDropDown,
  layoutQuadrasDropDown,
  configPlanilhasDropDown,
};
