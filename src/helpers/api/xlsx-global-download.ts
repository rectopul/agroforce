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
import { ExperimentGenotipeController } from '../../controllers/experiment-genotipe.controller';

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
      delete newItem.id;
      return newItem;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      delete row.desc;
      delete row.status;
      delete row.name;
      delete row.id;
      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      delete row.name;
      delete row.status;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      row.Nome = row.safraName;
      row.Ano = row.year;
      row.Início_Plantio = row.plantingStartTime;
      row.Fim_Plantio = row.plantingEndTime;
      row.Status = row.status;

      delete row.safraName;
      delete row.year;
      delete row.plantingStartTime;
      delete row.plantingEndTime;
      delete row.status;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      const dataExp = new Date();
      let hours: string;
      let minutes: string;
      let seconds: string;
      if (String(dataExp.getHours()).length === 1) {
        hours = `0${String(dataExp.getHours())}`;
      } else {
        hours = String(dataExp.getHours());
      }
      if (String(dataExp.getMinutes()).length === 1) {
        minutes = `0${String(dataExp.getMinutes())}`;
      } else {
        minutes = String(dataExp.getMinutes());
      }
      if (String(dataExp.getSeconds()).length === 1) {
        seconds = `0${String(dataExp.getSeconds())}`;
      } else {
        seconds = String(dataExp.getSeconds());
      }
      row.DT = `${dataExp.toLocaleDateString(
        'pt-BR',
      )} ${hours}:${minutes}:${seconds}`;

      row.tecnologia = `${row.tecnologia.cod_tec} ${row.tecnologia.name}`;

      row.CULTURA = row.culture.name;
      row.NOME_GENÓTIPO = row.name_genotipo;
      row.NOME_PRINCIPAL = row.name_main;
      row.NOME_PÚBLICO = row.name_public;
      row.NOME_EXPERIMENTAL = row.name_experiment;
      row.NOME_ALTERNATIVO = row.name_alter;
      row.ELITE_NOME = row.elit_name;
      row.TECNOLOGIA = row.tecnologia;
      row.N_DE_LOTES = row.numberLotes;
      row.TIPO = row.type;
      row.GMR = row.gmr;
      row.BGM = row.bgm;
      row.CRUZA = row.cruza;
      row.PROGENITOR_F_DIRETO = row.progenitor_f_direto;
      row.PROGENITOR_M_DIRETO = row.progenitor_m_direto;
      row.PROGENITOR_F_ORIGEM = row.progenitor_f_origem;
      row.PROGENITOR_M_ORIGEM = row.progenitor_m_origem;
      row.PROGENITORES_ORIGEM = row.progenitores_origem;
      row.PARENTESCO_COMPLETO = row.parentesco_completo;
      row.DATA = row.DT;

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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((row: any) => {
      if (row.status === 0) {
        row.status = 'Inativos' as any;
      } else {
        row.status = 'Ativos' as any;
      }
      row.Nome = row.safraName;
      row.Ano = row.year;
      row.Início_Plantio = row.plantingStartTime;
      row.Fim_Plantio = row.plantingEndTime;
      row.Status = row.status;

      delete row.safraName;
      delete row.year;
      delete row.plantingStartTime;
      delete row.plantingEndTime;
      delete row.status;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      newRow.envelope = row.envelope.seeds;
      newRow.status = row.status === 0 ? 'Inativo' : 'Ativo';
      newRow.CULTURA = newRow.culture.name;
      newRow.NOME = newRow.name;
      newRow.NOME_PROTOCOLO = newRow.protocol_name;
      newRow.QUANT_SEMENTES = newRow.envelope;
      newRow.SAFRA = newRow.envelope
        ? newRow.envelope[0]?.safra.safraName
        : '';
      newRow.STATUS = newRow.status;

      delete newRow.name;
      delete newRow.culture;
      delete newRow.protocol_name;
      delete newRow.envelope;
      delete newRow.status;
      delete newRow.id;
      return newRow;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      delete row.name;
      delete row.group;
      delete row.status;
      delete row.id_culture;
      delete row.tableData;
      delete row.culture;
      delete row.id;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      const dataExp = new Date();
      let hours: string;
      let minutes: string;
      let seconds: string;
      if (String(dataExp.getHours()).length === 1) {
        hours = `0${String(dataExp.getHours())}`;
      } else {
        hours = String(dataExp.getHours());
      }
      if (String(dataExp.getMinutes()).length === 1) {
        minutes = `0${String(dataExp.getMinutes())}`;
      } else {
        minutes = String(dataExp.getMinutes());
      }
      if (String(dataExp.getSeconds()).length === 1) {
        seconds = `0${String(dataExp.getSeconds())}`;
      } else {
        seconds = String(dataExp.getSeconds());
      }
      row.DT = `${dataExp.toLocaleDateString(
        'pt-BR',
      )} ${hours}:${minutes}:${seconds}`;

      row.CULTURA = row.culture.desc;
      row.NOME = row.name;
      row.DESC = row.desc;
      row.COD_TEC = row.cod_tec;
      row.DT_GOM = row.DT;

      delete row.culture;
      delete row.id;
      delete row.dt_export;
      delete row.name;
      delete row.desc;
      delete row.cod_tec;
      delete row.DT;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      delete row.name;
      delete row.repeticao;
      delete row.trat_repeticao;
      delete row.status;
      delete row.culture;
      delete row.id;
      delete row.tableData;

      return row;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

      const dataExp = new Date();
      let hours: string;
      let minutes: string;
      let seconds: string;
      if (String(dataExp.getHours()).length == 1) {
        hours = `0${String(dataExp.getHours())}`;
      } else {
        hours = String(dataExp.getHours());
      }
      if (String(dataExp.getMinutes()).length == 1) {
        minutes = `0${String(dataExp.getMinutes())}`;
      } else {
        minutes = String(dataExp.getMinutes());
      }
      if (String(dataExp.getSeconds()).length == 1) {
        seconds = `0${String(dataExp.getSeconds())}`;
      } else {
        seconds = String(dataExp.getSeconds());
      }
      row.DT = `${dataExp.toLocaleDateString(
        'pt-BR',
      )} ${hours}:${minutes}:${seconds}`;

      row.NOME_LUGAR_CULTURA = row.name_local_culture;
      row.RÓTULO = row.label;
      row.MLOC = row.mloc;
      row.ENDEREÇO = row.adress;
      row.PAÍS = row.label_country;
      row.REGIÃO = row.label_region;
      row.LOCALIDADE = row.name_locality;
      row.STATUS = row.status;
      row.DT_GOM = row.DT;

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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      const dataExp = new Date();
      let hours: string;
      let minutes: string;
      let seconds: string;
      if (String(dataExp.getHours()).length === 1) {
        hours = `0${String(dataExp.getHours())}`;
      } else {
        hours = String(dataExp.getHours());
      }
      if (String(dataExp.getMinutes()).length === 1) {
        minutes = `0${String(dataExp.getMinutes())}`;
      } else {
        minutes = String(dataExp.getMinutes());
      }
      if (String(dataExp.getSeconds()).length === 1) {
        seconds = `0${String(dataExp.getSeconds())}`;
      } else {
        seconds = String(dataExp.getSeconds());
      }
      newRow.DT = `${dataExp.toLocaleDateString(
        'pt-BR',
      )} ${hours}:${minutes}:${seconds}`;

      let dtHours: string;
      let dtMinutes: string;
      let dtSeconds: string;

      newRow.dt_export = new Date(newRow.dt_export);
      newRow.dt_export = new Date(
        newRow.dt_export.toISOString().slice(0, -1),
      );

      if (String(newRow.dt_export.getHours()).length === 1) {
        dtHours = `0${String(newRow.dt_export.getHours())}`;
      } else {
        dtHours = String(newRow.dt_export.getHours());
      }
      if (String(newRow.dt_export.getMinutes()).length === 1) {
        dtMinutes = `0${String(newRow.dt_export.getMinutes())}`;
      } else {
        dtMinutes = String(newRow.dt_export.getMinutes());
      }
      if (String(newRow.dt_export.getSeconds()).length === 1) {
        dtSeconds = `0${String(newRow.dt_export.getSeconds())}`;
      } else {
        dtSeconds = String(newRow.dt_export.getSeconds());
      }

      newRow.EXPORT = `${newRow.dt_export.toLocaleDateString(
        'pt-BR',
      )} ${dtHours}:${dtMinutes}:${dtSeconds}`;

      newRow.NOME_UNIDADE_CULTURA = newRow?.name_unity_culture;
      newRow.ANO = newRow?.year;
      newRow.NOME_LUGAR_CULTURA = newRow.local?.name_local_culture;
      newRow.RÓTULO = newRow.local?.label;
      newRow.MLOC = newRow.local?.mloc;
      newRow.FAZENDA = newRow.local?.adress;
      newRow.PAÍS = newRow.local?.label_country;
      newRow.REGIÃO = newRow.local?.label_region;
      newRow.LOCALIDADE = newRow.local?.name_locality;
      newRow.DT_GOM = newRow.DT;
      newRow.DT_EXPORT = row.EXPORT;

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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      newItem.INICIO_EM = item.created_at;
      newItem.FIM_EM = item.updated_at;

      delete newItem.safra;
      delete newItem.user;
      delete newItem.table;
      delete newItem.state;
      delete newItem.created_at;
      delete newItem.updated_at;
      delete newItem.id;
      delete newItem.status;
      delete newItem.invalid_data;
      return newItem;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
      newItem.BGM_Genótipo = item.genotipo.bgm;
      newItem.GMR_GEN = item.genotipo.gmr;
      newItem.NT = item.treatments_number;
      newItem.STATUS_T = item.status;
      newItem.STATUS_ENSAIO = item.assay_list.status;
      newItem.GENOTIPO = item.genotipo.name_genotipo;
      newItem.NCA = item?.lote?.ncc;
      return newItem;
    });

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
  options.take = 1000;

  do {
    const { response, status } = await Controller.getAll(options);
    const newData = response.map((item: any) => {
      const newItem = item;
      newItem.CULTURA = item.assay_list?.safra?.culture?.name;
      newItem.SAFRA = item.assay_list?.safra?.safraName;
      newItem.FOCO = item.assay_list?.foco.name;
      newItem.TIPO_DE_ENSAIO = item.assay_list?.type_assay.name;
      newItem.TECNOLOGIA = `${item.assay_list?.tecnologia.cod_tec} ${item.assay_list?.tecnologia.name}`;
      newItem.GLI = item.assay_list?.gli;
      newItem.NOME_DO_EXPERIMENTO = item?.experimentName;
      newItem.BGM = item.assay_list?.bgm;
      newItem.STATUS_ENSAIO = item.assay_list?.status;
      newItem.PLANTIO = newItem.local?.name_local_culture;
      newItem.DELINEAMENTO = item.delineamento?.name;
      newItem.DENSIDADE = item?.density;
      newItem.REP = item.repetitionsNumber;
      newItem.ÉPOCA = item?.period;
      newItem.ORDEM_SORTEIO = item?.orderDraw;
      newItem.NLP = item?.nlp;
      newItem.CLP = item?.clp;
      newItem.OBSERVAÇÕES = item?.comments;
      newItem.COUNT_NT = newItem.countNT;
      newItem.NPE_QT = newItem.npeQT;

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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
    } else {
      workSheet = XLSX.utils.sheet_add_json(workSheet, newData, { origin: -1, skipHeader: true });
      res = response;
      options.skip += 1000;
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
      delete row.avatar;
      if (row.status === 0) {
        row.status = 'Inativo';
      } else {
        row.status = 'Ativo';
      }

      row.CULTURA = row.safra?.culture?.name;
      row.SAFRA = row.safra?.safraName;
      row.LOCAL = row.local?.name_local_culture;
      row.FOCO = row.foco?.name;
      row.TIPO_ENSAIO = row.type_assay?.name;
      row.TECNOLOGIA = `${row.tecnologia?.cod_tec} ${row.tecnologia?.name}`;
      row.ÉPOCA = row?.epoca;
      row.NPEI = row.npei;
      row.NPE_FINAL = row.npef;
      row.PROX_NPE = row.prox_npe;
      row.GRUPO = row.group.group;

      delete row.nextAvailableNPE;
      delete row.prox_npe;

      delete row.edited;
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

    if (count == 1) {
      workSheet = XLSX.utils.json_to_sheet(newData);
      res = response;
      options.skip = 1000;
      count++;
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
    if (status == 200) {
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

      if (count == 1) {
        workSheet = XLSX.utils.json_to_sheet(newData);
        res = response;
        options.skip = 1000;
        count++;
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
    if (status == 200) {
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

      if (count == 1) {
        workSheet = XLSX.utils.json_to_sheet(newData);
        res = response;
        options.skip = 1000;
        // status = status;
        count++;
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
    if (status == 200) {
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

      if (count == 1) {
        workSheet = XLSX.utils.json_to_sheet(lines);
        res = response;
        options.skip = 1000;
        // status = status;
        count++;
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

export default createXls;