import { ReactNode } from 'react';
import { AiOutlineFileSearch, AiOutlineMenu } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { MdDateRange, MdUpdate } from 'react-icons/md';
import { RiPlantLine, RiSeedlingLine } from 'react-icons/ri';

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
	const tabsConfig: IContentProps[] = typeAside === 'config' ? [
		{
			titleTab: 'TMG',
			valueTab: <BsCheckLg />,
			statusTab: true,
			hrefTab: '/config/tmg/usuarios',
			data: [
				{ labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine /> },
				{ labelDropDown: 'Usuários', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser /> },
				{ labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding /> },
				{ labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange /> },
				{ labelDropDown: 'Genótipo', hrefDropDown: '/config/tmg/genotipo', iconDropDown: <RiPlantLine /> },
				{ labelDropDown: 'Lotes', hrefDropDown: '/config/tmg/lote', iconDropDown: <RiPlantLine /> },
			],
		},
		{
			titleTab: 'ENSAIO',
			valueTab: <BsCheckLg />,
			statusTab: false,
			hrefTab: '/config/ensaio/tipo-ensaio',
			data: [
				{ labelDropDown: 'Tipo de ensaio', hrefDropDown: '/config/ensaio/tipo-ensaio', iconDropDown: <MdDateRange /> },
				{ labelDropDown: 'Foco', hrefDropDown: '/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch /> },
				{ labelDropDown: 'Tecnologia', hrefDropDown: '/config/ensaio/tecnologia', iconDropDown: <BiUser /> },
			],
		},
		{
			titleTab: 'NPE',
			valueTab: <BsCheckLg />,
			statusTab: false,
			hrefTab: '/config/npe',
			data: [
				{ labelDropDown: 'NPE', hrefDropDown: '/config/npe', iconDropDown: <FiMapPin /> },
			],
		},
		{
			titleTab: 'DELINEAMENTO',
			valueTab: <BsCheckLg />,
			statusTab: false,
			hrefTab: '/config/delineamento',
			data: [
				{ labelDropDown: 'Delineamento', hrefDropDown: '/config/delineamento', iconDropDown: <AiOutlineFileSearch /> },
			],
		},
		{
			titleTab: 'LOCAL',
			valueTab: <BsCheckLg />,
			statusTab: false,
			hrefTab: '/config/local',
			data: [
				{ labelDropDown: 'Lugar cultura', hrefDropDown: '/config/local', iconDropDown: <FiMapPin /> },
				{ labelDropDown: 'Un. cultura', hrefDropDown: '/config/local/unidade-cultura', iconDropDown: <FiMapPin /> },
			],
		},
		{
			titleTab: 'QUADRAS',
			valueTab: <BsCheckLg />,
			statusTab: false,
			hrefTab: '/config/quadra',
			data: [
				{ labelDropDown: 'Layout', hrefDropDown: '/config/quadra/layout-quadra', iconDropDown: <FiMapPin /> },
				{ labelDropDown: 'Quadra', hrefDropDown: '/config/quadra', iconDropDown: <FiMapPin /> },
			],
		},

	]
		: [
			{
				titleTab: 'RD',
				valueTab: <BsCheckLg />,
				statusTab: false,
				hrefTab: '/listas/rd',
				data: [
					{ labelDropDown: 'RD', hrefDropDown: '/listas/rd', iconDropDown: <AiOutlineFileSearch /> },
				],
			},
			{
				titleTab: 'EXPERIMENTOS',
				valueTab: <BsCheckLg />,
				statusTab: false,
				hrefTab: '/config/delineamento',
				data: [
					{ labelDropDown: 'Experimento', hrefDropDown: '/listas/experimentos/experimento', iconDropDown: <AiOutlineFileSearch /> },
					{ labelDropDown: 'Parcelas', hrefDropDown: '/listas/experimentos/parcelas', iconDropDown: <AiOutlineFileSearch /> },
				],
			},

		];

	return tabsConfig;
}

const tabsConfig = [
	{
		title: 'TESTE', value: <BsCheckLg />, status: true, href: '/config/tmg/usuarios',
	},
	{
		title: 'ENSAIO', value: <BsCheckLg />, status: false, href: '/config/ensaio/foco',
	},
	{
		title: 'LOCAL', value: <BsCheckLg />, status: false, href: '/config/local',
	},
	{
		title: 'DELINEAMENTO', value: <BsCheckLg />, status: false, href: '/config/delineamento',
	},
	{
		title: 'NPE', value: <BsCheckLg />, status: false, href: '/config/npe',
	},
	{
		title: 'QUADRAS', value: <BsCheckLg />, status: false, href: '/config/tmg/quadra',
	},
];

const tabsListas = [
	{
		title: 'RD', value: <BsCheckLg />, status: true, href: '/listas/rd',
	},
	{
		title: 'Experimentos', value: <BsCheckLg />, status: true, href: '/listas/experimentos/experimento',
	},
];

const tmgDropDown = [
	{ labelDropDown: 'Cultura', hrefDropDown: '/config/tmg/cultura', iconDropDown: <RiSeedlingLine /> },
	{ labelDropDown: 'Usuário', hrefDropDown: '/config/tmg/usuarios', iconDropDown: <BiUser /> },
	{ labelDropDown: 'Safra', hrefDropDown: '/config/tmg/safra', iconDropDown: <MdDateRange /> },
	{ labelDropDown: 'Portfólio', hrefDropDown: '/config/tmg/portfolio', iconDropDown: <RiPlantLine /> },
	{ labelDropDown: 'Setor', hrefDropDown: '/config/tmg/setor', iconDropDown: <HiOutlineOfficeBuilding /> },
];

const ensaiosDropDown = [
	{ labelDropDown: 'Tipo de ensaio', hrefDropDown: '/config/ensaio/tipo-ensaio', iconDropDown: <MdDateRange /> },
	{ labelDropDown: 'Foco', hrefDropDown: '/config/ensaio/foco', iconDropDown: <AiOutlineFileSearch /> },
	{ labelDropDown: 'OGM', hrefDropDown: '/config/ensaio/ogm', iconDropDown: <BiUser /> },
];

const localsDropDown = [
	{ labelDropDown: 'Local', hrefDropDown: '/config/local', iconDropDown: <AiOutlineFileSearch /> },
];

const layoutQuadrasDropDown = [
	{ labelDropDown: 'Layout quadra', hrefDropDown: '/config/layout-quadra', iconDropDown: <AiOutlineFileSearch /> },
];

const delineamentosDropDown = [
	{ labelDropDown: 'Delineamento', hrefDropDown: '/config/delineamento', iconDropDown: <AiOutlineFileSearch /> },
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	TabsDropDowns,
	tabsConfig,
	tabsListas,
	tmgDropDown,
	ensaiosDropDown,
	localsDropDown,
	delineamentosDropDown,
	npeDropDown,
	layoutQuadrasDropDown,
	configPlanilhasDropDown,
};
