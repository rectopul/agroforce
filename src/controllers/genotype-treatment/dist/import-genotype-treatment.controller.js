const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = {
    label: 0, sent() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [],
  }; let f; let y; let t; let
    g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
exports.__esModule = true;
exports.ImportGenotypeTreatmentController = void 0;
const handleError_1 = require('../../shared/utils/handleError');
const responseErrorFactory_1 = require('../../shared/utils/responseErrorFactory');
const experiment_controller_1 = require('../experiment/experiment.controller');
const experiment_genotipe_controller_1 = require('../experiment_genotipe.controller');
const genotipo_controller_1 = require('../genotype/genotipo.controller');
const log_import_controller_1 = require('../log-import.controller');
const lote_controller_1 = require('../lote.controller');
const genotype_treatment_controller_1 = require('./genotype-treatment.controller');
const history_genotype_treatment_controller_1 = require('./history-genotype-treatment.controller');

const ImportGenotypeTreatmentController = /** @class */ (function () {
  function ImportGenotypeTreatmentController() {
  }
  ImportGenotypeTreatmentController.validate = function (idLog, _a) {
    let _b; let _c; let _d; let _e; let _f; let _g; let _h; let _j; let _k; let _l; let _m; let _o; let _p; let
      _q;
    const { spreadSheet } = _a; const
      createdBy = _a.created_by;
    return __awaiter(this, void 0, Promise, function () {
      let loteController; let genotipoController; let logImportController; let genotypeTreatmentController; let historyGenotypeTreatmentController; let experimentController; let experimentGenotipeController; let responseIfError; let _r; let _s; let _i; var row; let genetic_Data; let genetic_ncc_connected; let nccInTreatments; let treatments; let _t; let _u; let _v; let column; let experiments; var status; var status; var status; var status; let _w; let _x; let _y; var row; let treatment; let genotipo; let lote; let error_1; let responseStringError; let
        error_2;
      return __generator(this, (_z) => {
        switch (_z.label) {
          case 0:
            loteController = new lote_controller_1.LoteController();
            genotipoController = new genotipo_controller_1.GenotipoController();
            logImportController = new log_import_controller_1.LogImportController();
            genotypeTreatmentController = new genotype_treatment_controller_1.GenotypeTreatmentController();
            historyGenotypeTreatmentController = new history_genotype_treatment_controller_1.HistoryGenotypeTreatmentController();
            experimentController = new experiment_controller_1.ExperimentController();
            experimentGenotipeController = new experiment_genotipe_controller_1.ExperimentGenotipeController();
            responseIfError = [];
            _z.label = 1;
          case 1:
            _z.trys.push([1, 37, , 39]);
            _r = [];
            for (_s in spreadSheet) { _r.push(_s); }
            _i = 0;
            _z.label = 2;
          case 2:
            if (!(_i < _r.length)) return [3 /* break */, 24];
            row = _r[_i];
            if (!(row !== '0')) return [3 /* break */, 23];
            return [4 /* yield */, genotipoController.getOneByName(spreadSheet[row][12])];
          case 3:
            genetic_Data = _z.sent();
            if (!(genetic_Data.response.length > 0)) return [3 /* break */, 7];
            return [4 /* yield */, genotipoController.getAll({
              name_genotipo: spreadSheet[row][12],
              nca: spreadSheet[row][13],
            })];
          case 4:
            genetic_ncc_connected = _z.sent();
            if (!(genetic_ncc_connected.response.length > 0)) return [3 /* break */, 7];
            return [4 /* yield */, genotypeTreatmentController.getAll({
              name_genotipo: spreadSheet[row][12],
              nca: spreadSheet[row][13],
            })];
          case 5:
            nccInTreatments = _z.sent();
            if (!(nccInTreatments.response.length > 0)) return [3 /* break */, 7];
            return [4 /* yield */, genotypeTreatmentController.getAll({
              gli: spreadSheet[row][4],
              experiment: spreadSheet[row][5],
              treatments_number: spreadSheet[row][9],
              name_genotipo: spreadSheet[row][12],
              nca: spreadSheet[row][13],
            })];
          case 6:
            treatments = _z.sent();
            if (treatments.status === 400) {
              responseIfError[0]
                                += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, o tratamento de gen\u00F3tipo n\u00E3o encontrado </li> <br>`;
            }
            if (((_b = treatments.response[0]) === null || _b === void 0 ? void 0 : _b.assay_list.foco.name) !== spreadSheet[row][1]) {
              responseIfError[0]
                                += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, o foco e diferente do cadastrado no experiment. </li> <br>`;
            }
            if (((_c = treatments.response[0]) === null || _c === void 0 ? void 0 : _c.assay_list.type_assay.name) !== spreadSheet[row][2]) {
              responseIfError[0]
                                += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, o tipo de ensaio e diferente do cadastrado no experiment. </li> <br>`;
            }
            if (((_d = treatments.response[0]) === null || _d === void 0 ? void 0 : _d.assay_list.tecnologia.cod_tec) != spreadSheet[row][3]) {
              responseIfError[0]
                                += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, a tecnologia e diferente da cadastrada no ensaio. </li> <br>`;
            }
            _z.label = 7;
          case 7:
            _t = [];
            for (_u in spreadSheet[row]) { _t.push(_u); }
            _v = 0;
            _z.label = 8;
          case 8:
            if (!(_v < _t.length)) return [3 /* break */, 23];
            column = _t[_v];
            if (column === '0') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '1') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '2') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '3') { // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '4') { // GLI
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (!(spreadSheet[row][5] != null)) return [3 /* break */, 10];
            return [4 /* yield */, experimentController.getFromExpName(spreadSheet[row][5])];
          case 9:
            experiments = _z.sent();
            if (experiments.status == 200 || experiments.response.length == 0) {
              if (experiments.response.length == 0) {
                responseIfError[0]
                                    += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, a experimento e diferente da cadastrada no ensaio. </li> <br>`;
              } else {
                if (((_e = experiments.response[0]) === null || _e === void 0 ? void 0 : _e.local.name_local_culture) != spreadSheet[row][6]) {
                  responseIfError[0]
                                        += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, a Lugar de plantio e diferente da cadastrada no experiment. </li> <br>`;
                }
                if (((_f = experiments.response[0]) === null || _f === void 0 ? void 0 : _f.assay_list.gli) != spreadSheet[row][4]) {
                  responseIfError[0]
                                        += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, a GLI e diferente da cadastrada no experiment. </li> <br>`;
                }
                if (((_g = experiments.response[0]) === null || _g === void 0 ? void 0 : _g.delineamento.name) != spreadSheet[row][7]) {
                  responseIfError[0]
                                        += `<li style="text-align:left"> A ${row}\u00AA linha esta incorreta, a Delineamento e diferente da cadastrada no experiment. </li> <br>`;
                }
              }
              // if (experiments.response[0]?.assay_list.foco.name != spreadSheet[row][1]) {
              //   responseIfError[0]
              //     += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a Foco e diferente da cadastrada no experiment. </li> <br>`;
              // }
              // return false;
            }
            return [3 /* break */, 11];
          case 10:
            responseIfError[0]
                            += `<li style="text-align:left"> A ${row}\u00AA linha est\u00E1 vazia para para o experimento </li> <br>`;
            _z.label = 11;
          case 11:
            /// -------c
            // if (column === '5') { // BGM
            //   if (spreadSheet[row][column] === null) {
            //     responseIfError[Number(column)]
            //       += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            //   }
            // }
            /// Some values missing   ---------------------------------------------
            if (column === '6') { // Lugar de plantio
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '7') { // Delineamento
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '8') { // REP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '9') { // NT
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '10') { // NPE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '11') { // STATUS_T
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '11') { // STATUS T
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
              }
            }
            if (!(column === '12')) return [3 /* break */, 14];
            if (!(spreadSheet[row][column] === null)) return [3 /* break */, 12];
            responseIfError[Number(column)]
                            += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            return [3 /* break */, 14];
          case 12: return [4 /* yield */, genotypeTreatmentController.getAll({
            name_genotipo: spreadSheet[row][column],
          })];
          case 13:
            status = (_z.sent()).status;
            if (status === 400) {
              responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
            }
            _z.label = 14;
          case 14:
            if (!(column === '13')) return [3 /* break */, 16];
            if (!(spreadSheet[row][column] != null)) return [3 /* break */, 16];
            return [4 /* yield */, genotypeTreatmentController.getAll({
              nca: String(spreadSheet[row][column]),
            })];
          case 15:
            status = (_z.sent()).status;
            if (status === 400) {
              responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
            }
            _z.label = 16;
          case 16:
            if (column === '14') { // new STATUS T
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
              }
            }
            if (!(column === '15')) return [3 /* break */, 19];
            if (!(spreadSheet[row][column] === null)) return [3 /* break */, 17];
            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'o campo é obrigatório, caso queira substituir apenas nca apenas replique os genotipos');
            return [3 /* break */, 19];
          case 17: return [4 /* yield */, genotipoController.getAll({
            name_genotipo: spreadSheet[row][column],
          })];
          case 18:
            status = (_z.sent()).status;
            if (status === 400) {
              responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
            }
            _z.label = 19;
          case 19:
            if (!(column === '16')) return [3 /* break */, 22];
            if (!(spreadSheet[row][column] === null)) return [3 /* break */, 20];
            responseIfError[Number(column)]
                            += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            return [3 /* break */, 22];
          case 20: return [4 /* yield */, loteController.getAll({
            ncc: Number(spreadSheet[row][column]),
          })];
          case 21:
            status = (_z.sent()).status;
            if (status === 400) {
              responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
            }
            _z.label = 22;
          case 22:
            _v++;
            return [3 /* break */, 8];
          case 23:
            _i++;
            return [3 /* break */, 2];
          case 24:
            if (!(responseIfError.length === 0)) return [3 /* break */, 35];
            _z.label = 25;
          case 25:
            _z.trys.push([25, 33, , 35]);
            _w = [];
            for (_x in spreadSheet) { _w.push(_x); }
            _y = 0;
            _z.label = 26;
          case 26:
            if (!(_y < _w.length)) return [3 /* break */, 31];
            row = _w[_y];
            if (!(row !== '0')) return [3 /* break */, 30];
            return [4 /* yield */, genotypeTreatmentController.getAll({
              gli: spreadSheet[row][4],
              treatments_number: spreadSheet[row][8],
              name_genotipo: spreadSheet[row][12],
              nca: spreadSheet[row][13],
            })];
          case 27:
            treatment = (_z.sent()).response;
            return [4 /* yield */, genotipoController.getAll({
              name_genotipo: spreadSheet[row][15],
            })];
          case 28:
            genotipo = (_z.sent()).response;
            return [4 /* yield */, loteController.getAll({
              ncc: spreadSheet[row][16],
            })];
          case 29:
            lote = (_z.sent()).response;
            // await genotypeTreatmentController.update(
            //   {
            //     id: treatment[0]?.id,
            //     id_genotipo: genotipo[0]?.id,
            //     id_lote: lote[0]?.id,
            //     status: spreadSheet[row][11],
            //   },
            // );
            console.log('treatment  ', treatment);
            console.log('treatment  ', (_h = treatment[0]) === null || _h === void 0 ? void 0 : _h.assay_list.experiment);
            console.log('dgfd gdfg ', {
              idSafra: (_j = treatment[0]) === null || _j === void 0 ? void 0 : _j.safra.id,
              idFoco: (_k = treatment[0]) === null || _k === void 0 ? void 0 : _k.assay_list.foco.id,
              idTypeAssay: (_l = treatment[0]) === null || _l === void 0 ? void 0 : _l.assay_list.type_assay.id,
              idTecnologia: (_m = treatment[0]) === null || _m === void 0 ? void 0 : _m.assay_list.tecnologia.id,
              nt: spreadSheet[row][8],
              gli: spreadSheet[row][4],
              npe: spreadSheet[row][10],
              idExperiment: (_o = treatment[0]) === null || _o === void 0 ? void 0 : _o.assay_list.experiment.id,
              idGenotipo: (_p = treatment[0]) === null || _p === void 0 ? void 0 : _p.genotipo.id,
              idLote: (_q = treatment[0]) === null || _q === void 0 ? void 0 : _q.id_lote,
            });
            return [2 /* return */, false];
          case 30:
            _y++;
            return [3 /* break */, 26];
          case 31:
            // console.log("idLog ",idLog);
            return [4 /* yield */, logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' })];
          case 32:
            // console.log("idLog ",idLog);
            _z.sent();
            return [2 /* return */, { status: 200, message: 'Tratamento de genótipo importado com sucesso' }];
          case 33:
            error_1 = _z.sent();
            return [4 /* yield */, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
          case 34:
            _z.sent();
            handleError_1.default('Tratamento de genótipo controller', 'Save Import', error_1.message);
            return [2 /* return */, { status: 500, message: 'Erro ao salvar planilha de tratamento de genótipo' }];
          case 35: return [4 /* yield */, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
          case 36:
            _z.sent();
            responseStringError = responseIfError.join('').replace(/undefined/g, '');
            return [2 /* return */, { status: 400, message: responseStringError }];
          case 37:
            error_2 = _z.sent();
            return [4 /* yield */, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
          case 38:
            _z.sent();
            handleError_1.default('Tratamento de genótipo controller', 'Validate Import', error_2.message);
            return [2 /* return */, { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' }];
          case 39: return [2];
        }
      });
    });
  };
  return ImportGenotypeTreatmentController;
}());
exports.ImportGenotypeTreatmentController = ImportGenotypeTreatmentController;
