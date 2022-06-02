import { BsCheckLgCircle } from "react-icons/bs";

const tabs = [
  { title: 'TMG', value: <BsCheckLgCircle />, status: true },
  { title: 'ENSAIO', value: <BsCheckLgCircle />, status: false },
  { title: 'LOCAL', value: <BsCheckLgCircle />, status: false },
  { title: 'DELINEAMENTO', value: <BsCheckLgCircle />, status: false },
  { title: 'NPE', value: <BsCheckLgCircle />, status: false },
  { title: 'QUADRAS', value: <BsCheckLgCircle />, status: false },
  { title: 'CONFIG. PLANILHAS', value: <BsCheckLgCircle />, status: false },
];

const dropDowns = [
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
  { labelDropDown: 'TMG', hrefDropDown: '#', iconDropDown: <p>teste1</p> },
];

const teste = [
  { labelDropDown: 'teste', hrefDropDown: '#' },
  { labelDropDown: 'teste', hrefDropDown: '#' },
  { labelDropDown: 'teste', hrefDropDown: '#' },
];

const nada = [
  { labelDropDown: 'nada', hrefDropDown: '#' },
  { labelDropDown: 'nada', hrefDropDown: '#' },
  { labelDropDown: 'nada', hrefDropDown: '#' },
];

export { tabs, dropDowns, teste, nada };
