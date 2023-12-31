import { ReactNode } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { MdDateRange } from 'react-icons/md';
import { RiPlantLine, RiSeedlingLine } from 'react-icons/ri';

import { perm_can_do } from './perm_can_do';

interface IDropDown {
  labelDropDown: string;
  hrefDropDown: string;
  iconDropDown: ReactNode;
}
interface IContentProps {
  titleTab: string;
  hrefTab: string;
  valueTab: ReactNode;
  statusTab: boolean;
  // handleStatusTabs?: (title: string, status: boolean) => void;

  data: IDropDown[];
}

export function TabsDropDowns(typeAside: any = 'config') {
  const tabsConfig: IContentProps[] = typeAside === 'config'
    ? [
      {
        titleTab: 'TMG',
        valueTab: <BsCheckLg />,
        statusTab: true,
        // hrefTab: "/config/tmg/usuarios",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Cultura',
            hrefDropDown: '/config/tmg/cultura',
            iconDropDown: <RiSeedlingLine />,
          },
          {
            labelDropDown: 'Usuário',
            hrefDropDown: '/config/tmg/usuarios',
            iconDropDown: <BiUser />,
          },
          {
            labelDropDown: 'Setor',
            hrefDropDown: '/config/tmg/setor',
            iconDropDown: <HiOutlineOfficeBuilding />,
          },
          {
            labelDropDown: 'Safra',
            hrefDropDown: '/config/tmg/safra',
            iconDropDown: <MdDateRange />,
          },
          {
            labelDropDown: 'Genótipo',
            hrefDropDown: '/config/tmg/genotipo',
            iconDropDown: <RiPlantLine />,
          },
          {
            labelDropDown: 'Lote',
            hrefDropDown: '/config/tmg/lote',
            iconDropDown: <RiPlantLine />,
          },
        ],
      },
      {
        titleTab: 'ENSAIO',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/config/ensaio/tipo-ensaio",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Tipo de ensaio',
            hrefDropDown: '/config/ensaio/tipo-ensaio',
            iconDropDown: <MdDateRange />,
          },
          {
            labelDropDown: 'Foco',
            hrefDropDown: '/config/ensaio/foco',
            iconDropDown: <AiOutlineFileSearch />,
          },
          {
            labelDropDown: 'Tecnologia',
            hrefDropDown: '/config/ensaio/tecnologia',
            iconDropDown: <BiUser />,
          },
        ],
      },
      // {
      //   titleTab: 'AMBIENTE',
      //   valueTab: <BsCheckLg />,
      //   statusTab: false,
      //   hrefTab: '/config/ambiente',
      //   data: [
      //     {
      //       labelDropDown: 'Ambiente',
      //       hrefDropDown: '/config/ambiente',
      //       iconDropDown: <FiMapPin />,
      //     },
      //   ],
      // },
      {
        titleTab: 'DELINEAMENTO',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: '/config/delineamento',
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Delineamento',
            hrefDropDown: '/config/delineamento',
            iconDropDown: <AiOutlineFileSearch />,
          },
        ],
      },
      {
        titleTab: 'LOCAL',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/config/local/local",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Lugar cultura',
            hrefDropDown: '/config/local/local',
            iconDropDown: <FiMapPin />,
          },
          {
            labelDropDown: 'Un. cultura',
            hrefDropDown: '/config/local/unidade-cultura',
            iconDropDown: <FiMapPin />,
          },
        ],
      },
      {
        titleTab: 'QUADRAS',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/config/quadra",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Layout',
            hrefDropDown: '/config/quadra/layout-quadra',
            iconDropDown: <FiMapPin />,
          },
          {
            labelDropDown: 'Quadra',
            hrefDropDown: '/config/quadra',
            iconDropDown: <FiMapPin />,
          },
        ],
      },
    ]
    : [
      {
        titleTab: 'RD',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/listas/rd",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'RD',
            hrefDropDown: '/listas/rd',
            iconDropDown: <AiOutlineFileSearch />,
          },
        ],
      },
      {
        titleTab: 'ENSAIO',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/listas/ensaios/ensaio",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Ensaio',
            hrefDropDown: '/listas/ensaios/ensaio',
            iconDropDown: <MdDateRange />,
          },
          {
            labelDropDown: 'Genótipos do Ensaio',
            hrefDropDown: '/listas/ensaios/genotipos-ensaio',
            iconDropDown: <MdDateRange />,
          },
        ],
      },
      {
        titleTab: 'EXPERIMENTOS',
        valueTab: <BsCheckLg />,
        statusTab: false,
        // hrefTab: "/listas/experimentos/experimento",
        hrefTab: '#',
        data: [
          {
            labelDropDown: 'Experimento',
            hrefDropDown: '/listas/experimentos/experimento',
            iconDropDown: <AiOutlineFileSearch />,
          },
          {
            labelDropDown: 'Parcelas do experimento',
            hrefDropDown: '/listas/experimentos/parcelas-experimento',
            iconDropDown: <MdDateRange />,
          },
        ],
      },
    ];

  return tabsConfig;
}

const tabsConfig = [
  {
    title: 'TESTE',
    value: <BsCheckLg />,
    status: true,
    href: '/config/tmg/usuarios',
  },
  {
    title: 'ENSAIO',
    value: <BsCheckLg />,
    status: false,
    href: '/config/ensaio/foco',
  },
  {
    title: 'LOCAL',
    value: <BsCheckLg />,
    status: false,
    href: '/config/local',
  },
  {
    title: 'DELINEAMENTO',
    value: <BsCheckLg />,
    status: false,
    href: '/config/delineamento',
  },
  {
    title: 'AMBIENTE',
    value: <BsCheckLg />,
    status: false,
    href: '/config/npe',
  },
  {
    title: 'QUADRAS',
    value: <BsCheckLg />,
    status: false,
    href: '/config/tmg/quadra',
  },
];

const tabsListas = [
  {
    title: 'RD',
    value: <BsCheckLg />,
    status: true,
    href: '/listas/rd',
  },
  {
    title: 'Experimentos',
    value: <BsCheckLg />,
    status: true,
    href: '/listas/experimentos/experimento',
  },
];

const tmgDropDown = [
  {
    labelDropDown: 'Cultura',
    hrefDropDown: '/config/tmg/cultura',
    iconDropDown: <RiSeedlingLine />,
  },
  {
    labelDropDown: 'Usuário',
    hrefDropDown: '/config/tmg/usuarios',
    iconDropDown: <BiUser />,
  },
  {
    labelDropDown: 'Safra',
    hrefDropDown: '/config/tmg/safra',
    iconDropDown: <MdDateRange />,
  },
  {
    labelDropDown: 'Portfólio',
    hrefDropDown: '/config/tmg/portfolio',
    iconDropDown: <RiPlantLine />,
  },
  {
    labelDropDown: 'Setor',
    hrefDropDown: '/config/tmg/setor',
    iconDropDown: <HiOutlineOfficeBuilding />,
  },
];

const ensaiosDropDown = [
  {
    labelDropDown: 'Tipo de ensaio',
    hrefDropDown: '/config/ensaio/tipo-ensaio',
    iconDropDown: <MdDateRange />,
  },
  {
    labelDropDown: 'Foco',
    hrefDropDown: '/config/ensaio/foco',
    iconDropDown: <AiOutlineFileSearch />,
  },
  {
    labelDropDown: 'OGM',
    hrefDropDown: '/config/ensaio/ogm',
    iconDropDown: <BiUser />,
  },
];

const localsDropDown = [
  {
    labelDropDown: 'Local',
    hrefDropDown: '/config/local',
    iconDropDown: <AiOutlineFileSearch />,
  },
];

const layoutQuadrasDropDown = [
  {
    labelDropDown: 'Layout quadra',
    hrefDropDown: '/config/layout-quadra',
    iconDropDown: <AiOutlineFileSearch />,
  },
];

const delineamentosDropDown = [
  {
    labelDropDown: 'Delineamento',
    hrefDropDown: '/config/delineamento',
    iconDropDown: <AiOutlineFileSearch />,
  },
];

const npeDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const configPlanilhasDropDown = [
  { labelDropDown: 'Não definido', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
  { labelDropDown: 'Teste', hrefDropDown: '#' },
];

const tabsOperation = [
  {
    titleTab: 'AMBIENTE',
    valueTab: <BsCheckLg />,
    statusTab: false,
    hrefTab: '/operacao/ambiente',
    data: [
      {
        labelDropDown: 'Ambiente',
        hrefDropDown: '/operacao/ambiente',
        iconDropDown: <AiOutlineFileSearch />,
      },
    ],
  },
  {
    titleTab: 'ETIQUETAGEM',
    valueTab: <BsCheckLg />,
    statusTab: false,
    hrefTab: '/operacao/etiquetagem',
    data: [
      {
        labelDropDown: 'Etiquetagem',
        hrefDropDown: '/operacao/etiquetagem',
        iconDropDown: <AiOutlineFileSearch />,
      },
    ],
  },
];

const tabsReport = [
  {
    titleTab: 'Logs',
    valueTab: <BsCheckLg />,
    statusTab: false,
    hrefTab: '/logs',
    data: [
      {
        labelDropDown: 'Logs',
        hrefDropDown: '/logs',
        iconDropDown: <AiOutlineFileSearch />,
      },
    ],
  },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  TabsDropDowns,
  tabsConfig,
  tabsListas,
  tabsOperation,
  tabsReport,
  tmgDropDown,
  ensaiosDropDown,
  localsDropDown,
  delineamentosDropDown,
  npeDropDown,
  layoutQuadrasDropDown,
  configPlanilhasDropDown,
};
