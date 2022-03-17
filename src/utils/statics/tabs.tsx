import { BsCheckLg } from "react-icons/bs";

const tabs = [
  { title: 'TMG', value: <BsCheckLg />, status: true },
  { title: 'ENSAIO', value: <BsCheckLg />, status: false  },
  { title: 'LOCAL', value: <BsCheckLg />, status: false  },
  { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false  },
  { title: 'NPE', value: <BsCheckLg />, status: false  },
  { title: 'QUADRAS', value: <BsCheckLg />, status: false  },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false },
];

const dropDowns = [
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
  {labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p>},
];

const teste = [
  {labelDropDown: 'teste', hrefDropDown: '#'},
  {labelDropDown: 'teste', hrefDropDown: '#'},
  {labelDropDown: 'teste', hrefDropDown: '#'},
];

const nada = [
  {labelDropDown: 'nada', hrefDropDown: '#'},
  {labelDropDown: 'nada', hrefDropDown: '#'},
  {labelDropDown: 'nada', hrefDropDown: '#'},
];

export { tabs, dropDowns, teste, nada };
