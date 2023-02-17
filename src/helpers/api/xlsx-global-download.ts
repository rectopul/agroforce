/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { CulturaController } from 'src/controllers/cultura.controller';
import { UserController } from 'src/controllers/user.controller';
import { DepartamentController } from 'src/controllers/departament.controller';
import { SafraController } from 'src/controllers/safra.controller';
import { GenotipoController } from 'src/controllers/genotype/genotipo.controller';
import { LoteController } from 'src/controllers/lote.controller';
import { TypeAssayController } from 'src/controllers/tipo-ensaio.controller';
import { FocoController } from 'src/controllers/foco.controller';
import { TecnologiaController } from 'src/controllers/technology/tecnologia.controller';
import { DelineamentoController } from 'src/controllers/delimitation/delineamento.controller';
import { LocalController } from 'src/controllers/local/local.controller';
import { UnidadeCulturaController } from 'src/controllers/local/unidade-cultura.controller';
import { LayoutQuadraController } from 'src/controllers/block-layout/layout-quadra.controller';
import { LogImportController } from 'src/controllers/log-import.controller';
import { AssayListController } from 'src/controllers/assay-list/assay-list.controller';
import { GenotypeTreatmentController } from 'src/controllers/genotype-treatment/genotype-treatment.controller';
import { ExperimentController } from 'src/controllers/experiment/experiment.controller';
import { NpeController } from 'src/controllers/npe/npe.controller';
import { QuadraController } from 'src/controllers/block/quadra.controller';
import moment from 'moment';
import { ExperimentGenotipeController } from '../../controllers/experiment-genotipe.controller';

async function callExperimentGenotipeXlsxDownload(options: any) {
  const Controller = new ExperimentGenotipeController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;
  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem: any = {};
      newItem.CULTURA = item.safra.culture.name;
      newItem.SAFRA = item.safra.safraName;
      newItem.FOCO = item.foco.name;
      newItem.ENSAIO = item.type_assay.name;
      newItem.TECNOLOGIA = `${item.tecnologia.cod_tec} ${item.tecnologia.name}`;
      newItem.GLI = item.gli;
      newItem.EXPERIMENTO = item.experiment.experimentName;
      newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
      newItem.DELINEAMENTO = item.experiment.delineamento.name;
      newItem.REP = item.rep;
      newItem.NT = item.nt;
      newItem.NPE = item.npe;
      newItem.STATUS_T = item.status_t;
      newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
      newItem.NCA = item.nca;
      newItem.STATUS_EXP = item.experiment.status;
      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newItem.id;
      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgCulturaXlsxDownload(options: any) {
  const Controller = new CulturaController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAllCulture(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativo' as any;
      } else {
        row.status = 'Ativo' as any;
      }
      row.COD_REDUZIDO = row.name;
      row.NOME = row.desc;
      row.STATUS = row.status;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.desc;
      delete row.status;
      delete row.name;
      delete row.id;
      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgUsuarioXlsxDownload(options: any) {
  const Controller = new UserController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((line: any) => {
      if (line.status === 0) {
        line.status = 'Inativo';
      } else {
        line.status = 'Ativo';
      }

      line.LOGIN = line.login;
      line.NOME = line.name;
      line.TEL = line.tel;
      line.STATUS = line.status;
      line.CPF = line.cpf;
      line.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete line.avatar;
      delete line.id;
      delete line.email;
      delete line.name;
      delete line.tel;
      delete line.login;
      delete line.cpf;
      delete line.status;
      return line;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgSetorXlsxDownload(options: any) {
  const Controller = new DepartamentController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.listAllDepartments(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativo' as any;
      } else {
        row.status = 'Ativo' as any;
      }
      row.NOME = row.name;
      row.STATUS = row.status;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.name;
      delete row.status;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgSafraXlsxDownload(options: any) {
  const Controller = new SafraController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativos' as any;
      } else {
        row.status = 'Ativos' as any;
      }

      row.CULTURA = row.culture.name;
      row.NOME = row.safraName;
      row.ANO = row.year;
      row.INICIO_PLANTIO = row.plantingStartTime;
      row.FIM_PLANTIO = row.plantingEndTime;
      row.STATUS = row.status;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.safraName;
      delete row.culture;
      delete row.year;
      delete row.plantingStartTime;
      delete row.plantingEndTime;
      delete row.status;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgGenotipeXlsxDownload(options: any) {
  const Controller = new GenotipoController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      row.CULTURA = row.culture.name;
      row.NOME_GENÓTIPO = row.name_genotipo;
      row.NOME_PRINCIPAL = row.name_main;
      row.NOME_PÚBLICO = row.name_public;
      row.NOME_EXPERIMENTAL = row.name_experiment;
      row.NOME_ALTERNATIVO = row.name_alter;
      row.ELITE_NOME = row.elit_name;
      row.TECNOLOGIA = `${row.tecnologia.cod_tec} ${row.tecnologia.name}`;
      row.N_DE_LOTES = row.numberLotes;
      row.TIPO = row.type;
      row.GMR = row.gmr;
      row.BGM = row.bgm;
      row.CRUZA_DE_ORIGEM = row.cruza;
      row.PROGENITOR_F_DIRETO = row.progenitor_f_direto;
      row.PROGENITOR_M_DIRETO = row.progenitor_m_direto;
      row.PROGENITOR_F_ORIGEM = row.progenitor_f_origem;
      row.PROGENITOR_M_ORIGEM = row.progenitor_m_origem;
      row.PROGENITORES_ORIGEM = row.progenitores_origem;
      row.PARENTESCO_COMPLETO = row.parentesco_completo;
      row.ANO = String(row.lote[0]?.year);
      row.COD_LOTE = String(row.lote[0]?.cod_lote);
      row.NCC = String(row.lote[0]?.ncc);
      row.PESO = row.lote[0]?.peso ? String(row.lote[0]?.peso) : '';
      row.FASE = row.lote[0]?.fase ? String(row.lote[0]?.fase) : '';
      row.QUANT_SEMENTES = row.lote[0]?.quant_sementes ? String(row.lote[0]?.quant_sementes) : '';
      row.dt_export = moment(row.dt_export).format('DD-MM-YYYY hh:mm:ss');
      row.DT_RD = row.dt_export;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.culture;
      delete row.id_s1;
      delete row.name_main;
      delete row.id_dados;
      delete row.name_genotipo;
      delete row.name_public;
      delete row.name_experiment;
      delete row.name_alter;
      delete row.elit_name;
      delete row.tecnologia;
      delete row.numberLotes;
      delete row.type;
      delete row.gmr;
      delete row.bgm;
      delete row.cruza;
      delete row.progenitor_f_direto;
      delete row.progenitor_m_direto;
      delete row.progenitor_f_origem;
      delete row.progenitor_m_origem;
      delete row.progenitores_origem;
      delete row.parentesco_completo;
      delete row.DT;
      delete row.id;
      delete row.id_tecnologia;
      delete row.tableData;
      delete row.lote;
      delete row.dt_export;

      // row.DT = new Date();

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callTmgLoteXlsxDownload(options: any) {
  const Controller = new LoteController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem = item;

      newItem.dt_export = new Date(newItem.dt_export);
      newItem.dt_export = new Date(
        newItem.dt_export.toISOString().slice(0, -1),
      );

      newItem.dt_export = moment(newItem.dt_export).format('DD-MM-YYYY hh:mm:ss');

      newItem.CULTURA = item?.genotipo.culture.name;
      newItem.ANO = item?.year;
      newItem.SAFRA = item?.safra.safraName;
      newItem.COD_LOTE = String(item?.cod_lote);
      newItem.NCC = String(item?.ncc);
      newItem.FASE = item?.fase ? String(item?.fase) : '';
      newItem.PESO = item?.peso ? String(item?.peso) : '';
      newItem.QUANT_SEMENTES = item?.quant_sementes;
      newItem.NOME_GENOTIPO = item?.genotipo.name_genotipo;
      newItem.NOME_PRINCIPAL = String(item?.genotipo.name_main);
      newItem.GMR = item?.genotipo.gmr ? String(item?.genotipo.gmr) : '';
      newItem.BGM = item?.genotipo.bgm ? String(item?.genotipo.bgm) : '';
      newItem.TECNOLOGIA = `${item?.genotipo.tecnologia.cod_tec} ${item?.genotipo.tecnologia.name}`;
      newItem.DT_RD = newItem.dt_export;
      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newItem.quant_sementes;
      delete newItem.peso;
      delete newItem.fase;
      delete newItem.ncc;
      delete newItem.cod_lote;
      delete newItem.year;
      delete newItem.id_s2;
      delete newItem.id_dados;
      delete newItem.DT;
      delete newItem.dt_export;
      delete newItem.id;
      delete newItem.id_genotipo;
      delete newItem.genotipo;
      delete newItem.safra;

      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callEnsaioTipoDeEnsaioXlsxDownload(options: any) {
  const Controller = new TypeAssayController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      const newRow = row;
      newRow.safra = row.envelope?.safra?.safraName;
      newRow.envelope = row.envelope.seeds;
      newRow.status = row.status === 0 ? 'Inativo' : 'Ativo';
      newRow.CULTURA = newRow.culture.name;
      newRow.NOME = newRow.name;
      newRow.NOME_PROTOCOLO = newRow.protocol_name;
      newRow.QUANT_SEMENTES = newRow.envelope;
      newRow.SAFRA = row.safra;
      newRow.STATUS = newRow.status;
      newRow.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newRow.name;
      delete newRow.culture;
      delete newRow.protocol_name;
      delete newRow.envelope;
      delete newRow.safra;
      delete newRow.status;
      delete newRow.id;
      return newRow;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callEnsaioFocoXlsxDownload(options: any) {
  const Controller = new FocoController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativo' as any;
      } else {
        row.status = 'Ativo' as any;
      }

      row.CULTURA = row?.culture?.name;
      row.NOME = row?.name;
      row.GRUPO = row?.group.group;
      row.STATUS = row?.status;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.name;
      delete row.group;
      delete row.status;
      delete row.id_culture;
      delete row.tableData;
      delete row.culture;
      delete row.id;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callEnsaioTechnologiaXlsxDownload(options: any) {
  const Controller = new TecnologiaController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      row.dt_export = new Date(row.dt_export);
      row.dt_export = new Date(
        row.dt_export.toISOString().slice(0, -1),
      );
      row.CULTURA = row.culture.desc;
      row.NOME = row.name;
      row.DESC = row.desc;
      row.COD_TEC = row.cod_tec;
      row.dt_export = moment(row.dt_export).format('DD-MM-YYYY hh:mm:ss');
      row.DT_RD = row.dt_export;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.culture;
      delete row.id;
      delete row.dt_export;
      delete row.name;
      delete row.desc;
      delete row.cod_tec;
      delete row.DT;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callDelineamentoXlsxDownload(options: any) {
  const Controller = new DelineamentoController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativo' as any;
      } else {
        row.status = 'Ativo' as any;
      }

      row.CULTURA = row?.culture?.name;
      row.NOME = row?.name;
      row.REPETIÇÃO = row?.repeticao;
      row.TRAT_REPETIÇÃO = row?.trat_repeticao;
      row.STATUS = row?.status;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.name;
      delete row.repeticao;
      delete row.trat_repeticao;
      delete row.status;
      delete row.culture;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callLocalLugarCulturaXlsxDownload(options: any) {
  const Controller = new LocalController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      row.status = row.status === 0 ? 'Inativo' : 'Ativo';

      row.NOME_LUGAR_CULTURA = row.name_local_culture;
      row.RÓTULO = row.label;
      row.MLOC = row.mloc;
      row.ENDEREÇO = row.adress;
      row.PAÍS = row.label_country;
      row.REGIÃO = row.label_region;
      row.LOCALIDADE = row.name_locality;
      row.STATUS = row.status;
      row.DT_RD = moment(row.dt_export).format('DD-MM-YYYY hh:mm:ss');
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.name_local_culture;
      delete row.label;
      delete row.mloc;
      delete row.adress;
      delete row.label_country;
      delete row.label_region;
      delete row.name_locality;
      delete row.status;
      delete row.dt_export;
      delete row.DT;
      delete row.id;
      delete row.cultureUnity;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callLocalUnidadeCulturaXlsxDownload(options: any) {
  const Controller = new UnidadeCulturaController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      const newRow = row;

      newRow.dt_export = new Date(newRow.dt_export);
      newRow.dt_export = new Date(
        newRow.dt_export.toISOString().slice(0, -1),
      );

      newRow.NOME_UNIDADE_CULTURA = newRow?.name_unity_culture;
      newRow.ANO = newRow?.year;
      newRow.NOME_LUGAR_CULTURA = newRow.local?.name_local_culture;
      newRow.RÓTULO = newRow.local?.label;
      newRow.MLOC = newRow.local?.mloc;
      newRow.FAZENDA = newRow.local?.adress;
      newRow.PAÍS = newRow.local?.label_country;
      newRow.REGIÃO = newRow.local?.label_region;
      newRow.LOCALIDADE = newRow.local?.name_locality;
      row.dt_export = moment(row.dt_export).format('DD-MM-YYYY hh:mm:ss');
      row.DT_DT = row.dt_export;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newRow.year;
      delete newRow.name_unity_culture;
      delete newRow.DT;
      delete newRow.id_safra;
      delete newRow.id;
      delete newRow.EXPORT;
      delete newRow.dt_export;
      delete newRow.id_unity_culture;
      delete newRow.id_local;
      delete newRow.local;
      return newRow;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callQuadrasLayoutXlsxDownload(options: any) {
  const Controller = new LayoutQuadraController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativo' as any;
      } else {
        row.status = 'Ativo' as any;
      }

      row.ESQUEMA = row.esquema;
      row.PLANTADEIRAS = row.plantadeira;
      row.TIROS = row.tiros;
      row.DISPAROS = row.disparos;
      row.PARCELAS = row.parcelas;
      row.STATUS = row.status;

      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.esquema;
      delete row.plantadeira;
      delete row.tiros;
      delete row.disparos;
      delete row.parcelas;
      delete row.status;
      delete row.id;
      delete row.id_culture;
      delete row.tableData;

      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callRdXlsxDownload(options: any) {
  const Controller = new LogImportController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem = item;

      newItem.CULTURA = item.safra.culture.name;
      newItem.SAFRA = item.safra.safraName;
      newItem.USUÁRIO = item.user.name;
      newItem.TABELA = item.table;
      newItem.STATUS = item.state;
      newItem.INICIO = item.created_at;
      newItem.FIM = item.updated_at;
      newItem.NOME_DO_ARQUIVO = newItem.filePath;
      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newItem.safra;
      delete newItem.user;
      delete newItem.table;
      delete newItem.state;
      delete newItem.created_at;
      delete newItem.updated_at;
      delete newItem.id;
      delete newItem.filePath;
      delete newItem.status;
      delete newItem.invalid_data;
      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callEnsaioEnsaioXlsxDownload(options: any) {
  const Controller = new AssayListController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem = item;

      newItem.CULTURA = newItem.safra?.culture?.name;
      newItem.SAFRA = newItem.safra?.safraName;
      newItem.PROTOCOLO = newItem?.protocol_name;
      newItem.FOCO = newItem.foco?.name;
      newItem.TIPO_DE_ENSAIO = newItem.type_assay?.name;
      newItem.TECNOLOGIA = `${newItem.tecnologia.cod_tec} ${newItem.tecnologia.name}`;
      newItem.GLI = newItem?.gli;
      newItem.BGM = newItem?.bgm;
      newItem.STATUS = newItem?.status;
      newItem.PROJETO = newItem?.project;
      newItem.OBSERVAÇÕES = newItem?.comments;
      newItem.NÚMERO_DE_TRATAMENTOS = newItem?.countNT;

      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newItem.safra;
      delete newItem.treatmentsNumber;
      delete newItem.project;
      delete newItem.status;
      delete newItem.bgm;
      delete newItem.gli;
      delete newItem.tecnologia;
      delete newItem.foco;
      delete newItem.protocol_name;
      delete newItem.countNT;
      delete newItem.period;
      delete newItem.comments;
      delete newItem.type_assay;
      delete newItem.id;
      delete newItem.id_safra;
      delete newItem.experiment;
      delete newItem.genotype_treatment;

      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callEnsaioGenotipeXlsxDownload(options: any) {
  const Controller = new GenotypeTreatmentController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem: any = {};
      newItem.CULTURA = item.safra.culture.name;
      newItem.SAFRA = item.safra.safraName;
      newItem.FOCO = item.assay_list.foco.name;
      newItem.ENSAIO = item.assay_list.type_assay.name;
      newItem.TECNOLOGIA = `${item.assay_list.tecnologia.cod_tec} ${item.assay_list.tecnologia.name}`;
      newItem.GGEN = `${item.genotipo.tecnologia.cod_tec} ${item.genotipo.tecnologia.name}`;
      newItem.GLI = item.assay_list.gli;
      newItem.BGM = item.assay_list.bgm;
      newItem.STATUS_ENSAIO = item.assay_list.status;
      newItem.PROJETO = item.assay_list.project;
      newItem.COMENTÁRIOS = item.assay_list.status;
      newItem.FASE = item.lote.fase;
      newItem.NT = item.treatments_number;
      newItem.NOME_DO_GENOTIPO = item.genotipo.name_genotipo;
      newItem.GMR_GEN = item.genotipo.gmr;
      newItem.BGM_GENÓTIPO = item.genotipo.bgm;
      newItem.STATUS_T = item.status;
      newItem.NCA = String(item.lote.ncc);
      newItem.COD_LOTE = String(item.lote.cod_lote);
      newItem.OBS = item.comments;
      newItem.STATUS_TRAT = item.status_experiment;
      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');
      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callExperimentosExperimentoXlsxDownload(options: any) {
  const Controller = new ExperimentController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 200;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem = item;
      newItem.CULTURA = item.assay_list?.safra?.culture?.name;
      newItem.SAFRA = item.assay_list?.safra?.safraName;
      newItem.FOCO = item.assay_list?.foco.name;
      newItem.ENSAIO = item.assay_list?.type_assay.name;
      newItem.GLI = item.assay_list?.gli;
      newItem.NOME_DO_EXPERIMENTO = item?.experimentName;
      newItem.TECNOLOGIA = `${item.assay_list?.tecnologia.cod_tec} ${item.assay_list?.tecnologia.name}`;
      newItem.ÉPOCA = item?.period;
      newItem.DELINEAMENTO = item.delineamento?.name;
      newItem.REP = item.repetitionsNumber;
      newItem.STATUS_EXP = item.status;
      newItem.BGM = item.assay_list?.bgm;
      newItem.STATUS_ENSAIO = item.assay_list?.status;
      newItem.LUGAR_PLANTIO = newItem.local?.name_local_culture;
      newItem.DENSIDADE = item?.density;
      newItem.ORDEM_SORTEIO = item?.orderDraw;
      newItem.NLP = item?.nlp;
      newItem.CLP = item?.clp;
      newItem.OBSERVAÇÕES = item?.comments;
      newItem.COUNT_NT = newItem.countNT;
      newItem.NPE_QT = newItem.npeQT;
      newItem.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete newItem.id;
      delete newItem.safra;
      delete newItem.experiment_genotipe;
      delete newItem.seq_delineamento;
      delete newItem.experimentGroupId;
      delete newItem.countNT;
      delete newItem.npeQT;
      delete newItem.local;
      delete newItem.delineamento;
      delete newItem.eel;
      delete newItem.clp;
      delete newItem.nlp;
      delete newItem.orderDraw;
      delete newItem.comments;
      delete newItem.period;
      delete newItem.repetitionsNumber;
      delete newItem.density;
      delete newItem.status;
      delete newItem.experimentName;
      delete newItem.type_assay;
      delete newItem.idSafra;
      delete newItem.assay_list;
      return newItem;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 200;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 200;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callAmbienteAmbienteXlsxDownload(options: any) {
  const Controller = new NpeController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      row.CULTURA = row.safra?.culture?.name;
      row.SAFRA = row.safra?.safraName;
      row.LUGAR_DE_CULTURA = row.local?.name_local_culture;
      row.STATUS = row.status;
      row.FOCO = row.foco?.name;
      row.ENSAIO = row.type_assay?.name;
      row.TECNOLOGIA = `${row.tecnologia?.cod_tec} ${row.tecnologia?.name}`;
      row.ÉPOCA = row?.epoca;
      row.NPEI = row.npei;
      row.PROX_NPE = row.prox_npe;
      row.NPE_FINAL = row.npef;
      row.GRP = row.group.group;
      row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

      delete row.nextAvailableNPE;
      delete row.prox_npe;

      delete row.edited;
      delete row.npeRequisitada;
      delete row.local;
      delete row.safra;
      delete row.foco;
      delete row.epoca;
      delete row.tecnologia;
      delete row.type_assay;
      delete row.group;
      delete row.npei;
      delete row.npei_i;
      delete row.status;
      delete row.nextNPE;
      delete row.npeQT;
      delete row.localId;
      delete row.safraId;
      delete row.npef;
      delete row.id;
      return row;
    });

    if (count === 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count += 1;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
    }
  } while (res.length > 0);
  return workSheet;
}

async function callQuadrasExcelXlsxDownload(options: any) {
  const Controller = new QuadraController();
  let res: any = [];
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    if (status === 200) {
      const newData = response.map((row: any) => {
        if (row.status === 0) {
          row.status = 'Inativo' as any;
        } else {
          row.status = 'Ativo' as any;
        }

        row.COD_QUADRA = row.cod_quadra;
        row.LOCAL = row.local?.name_local_culture;
        row.ESQUEMA = row.esquema;
        row.LARG_Q = row.larg_q;
        row.COMP_P = row.comp_p;
        row.LINHA_P = row.linha_p;
        row.COMP_C = row.comp_c;
        row.TIRO_FIXO = row.tiro_fixo;
        row.DISPARO_FIXO = row.disparo_fixo;
        row.STATUS_ALOCADO = row.allocation;
        row.STATUS = row.status;
        row.DT_GOM = moment().format('DD-MM-YYYY hh:mm:ss');

        delete row.cod_quadra;
        delete row.local;
        delete row.esquema;
        delete row.larg_q;
        delete row.comp_p;
        delete row.linha_p;
        delete row.q;
        delete row.comp_c;
        delete row.tiro_fixo;
        delete row.disparo_fixo;
        delete row.status;
        delete row.id;
        delete row.safra;
        delete row.tableData;
        delete row.local_plantio;
        delete row.allocation;
        return row;
      });

      if (count === 1) {
        workSheet = XLSX.utils.json_to_sheet(newData);
        res = response;
        options.skip = 1000;
        count += 1;
      } else {
        workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
        res = response;
        options.skip += 1000;
      }
    } else {
      return {
        status: 400,
        sheet: workSheet,
      };
    }
  } while (res.length > 0);
  return { status: 200, sheet: workSheet };
}

async function callQuadrasExcelSinteticoXlsxDownload(options: any) {
  const Controller = new QuadraController();
  let res: any = [];
  let status : any;
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    if (status === 200) {
      const experimentArray: any = [];
      const object: any = {};
      const experimentObject: any = {
        id: '',
        safra: '',
        experimentName: '',
        npei: '',
        npef: '',
        ntparcelas: '',
        locpreparo: '',
        qm: '',
      };

      const data = response.map((tow: any) => {
        tow.cod = tow.cod_quadra;
        // tow.local = tow.name_local;
        experimentObject.locpreparo = tow.local.name_local_culture;
        object.qm = tow.cod;
        // const localMap = tow.local;

        const allocatedMap = tow.AllocatedExperiment.map((a: any) => {
          experimentObject.npei = a.npei;
          experimentObject.npef = a.npef;
          experimentObject.ntparcelas = a.parcelas;
          experimentArray.push(experimentObject);
          return a;
        });
        const experimentMap = tow.experiment.map((e: any) => {
          object.id = e.id;
          experimentObject.safra = e.safra.safraName;
          experimentObject.experimentName = e.experimentName;
          return e;
        });
        experimentArray.push(object);
        experimentArray.push(experimentObject);
        return tow;
      });
      const newData = experimentArray.map((row: any) => {
        row.ID_EXPERIMENTO = row.id;
        return row;
      });

      if (count === 1) {
        workSheet = XLSX.utils.json_to_sheet(newData);
        res = response;
        options.skip = 1000;
        // status = status;
        count += 1;
      } else {
        workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
        res = response;
        options.skip += 1000;
      }
    } else {
      return {
        status: 400,
        sheet: workSheet,
      };
    }
  } while (res.length > 0);
  return { status: 200, sheet: workSheet };
}

async function callQuadrasExcelAnalyticsXlsxDownload(options: any) {
  const Controller = new QuadraController();
  let res: any = [];
  let status : any;
  let workSheet: any;
  let count = 1;
  delete options.createFile;
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    if (status === 200) {
      const lines: any = [];
      response.forEach(async (block: any) => {
        await block.experiment?.forEach(async (experiment: any) => {
          await experiment.experiment_genotipe?.forEach(
            (parcela: any, index: number) => {
              lines.push({
                ID_EXPERIMENTO: experiment?.id,
                SAFRA: experiment?.safra?.safraName,
                EXPE: experiment?.experimentName,
                NPEI: parcela?.npe,
                NPEF: parcela?.npe,
                NTPARC: 1,
                LOCALPREP: block.local?.name_local_culture,
                QM: block.cod_quadra,
                SEQ: block.AllocatedExperiment[index]?.seq,
                FOCO: experiment?.assay_list?.foco?.name,
                ENSAIO: experiment?.assay_list?.type_assay?.name,
                GLI: experiment?.assay_list?.gli,
                CODLOCAL_EXP: experiment?.local?.name_local_culture,
                EPOCA: experiment?.period,
                TECNOLOGIA: experiment?.assay_list?.tecnologia?.name,
                BGM: experiment?.bgm,
                REP: experiment?.repetitionsNumber,
                STATUS_EXP: experiment?.status,
                CÓDIGO_GENOTIPO: parcela?.genotipo?.name_genotipo,
                STATUS_PARCELA: parcela?.status,
              });
            },
          );
        });
      });

      if (count === 1) {
        workSheet = XLSX.utils.json_to_sheet(lines);
        res = response;
        options.skip = 1000;
        // status = status;
        count += 1;
      } else {
        workSheet = XLSX.utils.sheet_add_json(workSheet, lines, { origin: -1, skipHeader: true });
        res = response;
        options.skip += 1000;
      }
    } else {
      return {
        status: 400,
        sheet: workSheet,
      };
    }
  } while (res.length > 0);
  return { status: 200, sheet: workSheet };
}

async function createXls(options: any, controller: string) {
  let workSheet: any;
  switch (controller) {
    case 'TMG-CULTURA':
      workSheet = callTmgCulturaXlsxDownload(options);
      break;
    case 'TMG-USUARIO':
      workSheet = callTmgUsuarioXlsxDownload(options);
      break;
    case 'TMG-SETOR':
      workSheet = callTmgSetorXlsxDownload(options);
      break;
    case 'TMG-SAFRA':
      workSheet = callTmgSafraXlsxDownload(options);
      break;
    case 'TMG-GENOTIPE':
      workSheet = callTmgGenotipeXlsxDownload(options);
      break;
    case 'TMG-LOTE':
      workSheet = callTmgLoteXlsxDownload(options);
      break;
    case 'ENSAIO-TIPO_DE_ENSAIO':
      workSheet = callEnsaioTipoDeEnsaioXlsxDownload(options);
      break;
    case 'ENSAIO-FOCO':
      workSheet = callEnsaioFocoXlsxDownload(options);
      break;
    case 'ENSAIO-TECHNOLOGIA':
      workSheet = callEnsaioTechnologiaXlsxDownload(options);
      break;
    case 'DELINEAMENTO':
      workSheet = callDelineamentoXlsxDownload(options);
      break;
    case 'LOCAL-LUGAR_CULTURA':
      workSheet = callLocalLugarCulturaXlsxDownload(options);
      break;
    case 'LOCAL-UNIDADE-CULTURA':
      workSheet = callLocalUnidadeCulturaXlsxDownload(options);
      break;
    case 'QUADRAS-LAYOUT':
      workSheet = callQuadrasLayoutXlsxDownload(options);
      break;
    case 'RD':
      workSheet = callRdXlsxDownload(options);
      break;
    case 'ENSAIO-ENSAIO':
      workSheet = callEnsaioEnsaioXlsxDownload(options);
      break;
    case 'ENSAIO-GENOTIPE':
      workSheet = callEnsaioGenotipeXlsxDownload(options);
      break;
    case 'EXPERIMENTOS-EXPERIMENTO':
      workSheet = callExperimentosExperimentoXlsxDownload(options);
      break;
    case 'EXPERIMENT-GENOTIPE':
      workSheet = callExperimentGenotipeXlsxDownload(options);
      break;
    case 'AMBIENTE-AMBIENTE':
      workSheet = callAmbienteAmbienteXlsxDownload(options);
      break;
    case 'QUADRAS-EXCEL':
      workSheet = callQuadrasExcelXlsxDownload(options);
      break;
    case 'QUADRAS-EXCEL_SINTETICO':
      workSheet = callQuadrasExcelSinteticoXlsxDownload(options);
      break;
    case 'QUADRAS-EXCEL_ANALYTICS':
      workSheet = callQuadrasExcelAnalyticsXlsxDownload(options);
      break;
    default:
      Swal.fire('Invalid controller name');
  }
  return workSheet;
}

export default createXls;
