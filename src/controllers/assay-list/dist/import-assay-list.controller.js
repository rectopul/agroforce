"use strict";
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
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
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ImportAssayListController = void 0;
var handleError_1 = require("../../shared/utils/handleError");
var responseErrorFactory_1 = require("../../shared/utils/responseErrorFactory");
var cultura_controller_1 = require("../cultura.controller");
var foco_controller_1 = require("../foco.controller");
var genotype_treatment_controller_1 = require("../genotype-treatment/genotype-treatment.controller");
var genotipo_controller_1 = require("../genotype/genotipo.controller");
var log_import_controller_1 = require("../log-import.controller");
var lote_controller_1 = require("../lote.controller");
var safra_controller_1 = require("../safra.controller");
var tecnologia_controller_1 = require("../technology/tecnologia.controller");
var tipo_ensaio_controller_1 = require("../tipo-ensaio.controller");
var assay_list_controller_1 = require("./assay-list.controller");
var ImportAssayListController = /** @class */ (function () {
    function ImportAssayListController() {
    }
    ImportAssayListController.validate = function (idLog, _a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var spreadSheet = _a.spreadSheet, idSafra = _a.idSafra, idCulture = _a.idCulture, createdBy = _a.created_by;
        return __awaiter(this, void 0, Promise, function () {
            var focoController, loteController, safraController, culturaController, genotipoController, logImportController, assayListController, typeAssayController, tecnologiaController, genotypeTreatmentController, responseIfError, _u, _v, _i, row, _w, _x, _y, column, response, response, response, response, response, response, response, genotype, response, productivity, advance, register, verifyToDelete, _z, _0, _1, row, typeAssay, foco, technology, genotype, lote, assayList, savedAssayList, error_1, responseStringError, error_2;
            return __generator(this, function (_2) {
                switch (_2.label) {
                    case 0:
                        focoController = new foco_controller_1.FocoController();
                        loteController = new lote_controller_1.LoteController();
                        safraController = new safra_controller_1.SafraController();
                        culturaController = new cultura_controller_1.CulturaController();
                        genotipoController = new genotipo_controller_1.GenotipoController();
                        logImportController = new log_import_controller_1.LogImportController();
                        assayListController = new assay_list_controller_1.AssayListController();
                        typeAssayController = new tipo_ensaio_controller_1.TypeAssayController();
                        tecnologiaController = new tecnologia_controller_1.TecnologiaController();
                        genotypeTreatmentController = new genotype_treatment_controller_1.GenotypeTreatmentController();
                        responseIfError = [];
                        _2.label = 1;
                    case 1:
                        _2.trys.push([1, 46, , 48]);
                        _u = [];
                        for (_v in spreadSheet)
                            _u.push(_v);
                        _i = 0;
                        _2.label = 2;
                    case 2:
                        if (!(_i < _u.length)) return [3 /*break*/, 22];
                        row = _u[_i];
                        if (!(row !== '0')) return [3 /*break*/, 21];
                        _w = [];
                        for (_x in spreadSheet[row])
                            _w.push(_x);
                        _y = 0;
                        _2.label = 3;
                    case 3:
                        if (!(_y < _w.length)) return [3 /*break*/, 21];
                        column = _w[_y];
                        if (!(column === '0')) return [3 /*break*/, 5];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, culturaController.getOneCulture(Number(idCulture))];
                    case 4:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.name) !== spreadSheet[row][column]) {
                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'a cultura e diferente da selecionada');
                        }
                        _2.label = 5;
                    case 5:
                        if (!(column === '1')) return [3 /*break*/, 7];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, safraController.getOne(idSafra)];
                    case 6:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.safraName) !== String(spreadSheet[row][column])) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'a safra informada e diferente da selecionada');
                        }
                        _2.label = 7;
                    case 7:
                        if (!(column === '2')) return [3 /*break*/, 9];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, focoController.getAll({
                                name: spreadSheet[row][column],
                                id_culture: idCulture
                            })];
                    case 8:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o foco informado não existe no sistema');
                        }
                        _2.label = 9;
                    case 9:
                        if (!(column === '3')) return [3 /*break*/, 11];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, typeAssayController.getAll({
                                filterName: spreadSheet[row][column],
                                id_culture: idCulture
                            })];
                    case 10:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o tipo de ensaio informado não existe no sistema');
                        }
                        _2.label = 11;
                    case 11:
                        if (!(column === '4')) return [3 /*break*/, 13];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, assayListController.getAll({
                                filterGli: spreadSheet[row][4],
                                id_safra: idSafra
                            })];
                    case 12:
                        response = (_2.sent()).response;
                        if (((_b = response[0]) === null || _b === void 0 ? void 0 : _b.status) === 'UTILIZADO') {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o ensaio já foi utilizado, não e possível alterar');
                        }
                        _2.label = 13;
                    case 13:
                        if (!(column === '5')) return [3 /*break*/, 15];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        if ((typeof (spreadSheet[row][column])) === 'number' && spreadSheet[row][column].toString().length < 2) {
                            // eslint-disable-next-line no-param-reassign
                            spreadSheet[row][column] = "0" + spreadSheet[row][column].toString();
                        }
                        return [4 /*yield*/, tecnologiaController.getAll({
                                cod_tec: String(spreadSheet[row][column]),
                                id_culture: idCulture
                            })];
                    case 14:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'a tecnologia informado não existe no sistema');
                        }
                        _2.label = 15;
                    case 15:
                        // Validação do campo BGM
                        if (column === '6') {
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                        }
                        // Validação do campo PRJ
                        if (column === '7') {
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                        }
                        // Validação do campo número de tratamento
                        if (column === '8') {
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                            if (row === '1') {
                                if (Number(spreadSheet[row][column]) !== 1) {
                                    responseIfError[Number(column)]
                                        += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o numero de tratamentos precisa começar em 1');
                                }
                            }
                            else if ((Number(spreadSheet[row][column] - 1) !== spreadSheet[Number(row) - 1][column]
                                && spreadSheet[Number(row) - 1][4] === spreadSheet[row][4])) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o número de tratamento não está sequencial');
                            }
                            else if (spreadSheet[Number(row) - 1][4] !== spreadSheet[row][4]
                                && Number(spreadSheet[row][column]) !== 1) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'cada ensaio deve ter tratamentos sequenciais começados em 1');
                            }
                        }
                        // Validação do campo status
                        if (column === '9') {
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                            if ((spreadSheet[row][column] !== 'T' && spreadSheet[row][column] !== 'L')) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o valor de status deve ser igual a T ou L');
                            }
                        }
                        if (!(column === '10')) return [3 /*break*/, 17];
                        if (spreadSheet[row][column] === null) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        return [4 /*yield*/, genotipoController.getAll({
                                filterGenotipo: spreadSheet[row][column],
                                id_culture: idCulture
                            })];
                    case 16:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o genótipo informado não existe no sistema');
                        }
                        _2.label = 17;
                    case 17:
                        if (!(column === '11')) return [3 /*break*/, 20];
                        if (!(spreadSheet[row][column] !== null)) return [3 /*break*/, 20];
                        return [4 /*yield*/, genotipoController.getAll({
                                filterGenotipo: spreadSheet[row][10],
                                id_culture: idCulture
                            })];
                    case 18:
                        genotype = (_2.sent()).response;
                        return [4 /*yield*/, loteController.getAll({
                                filterNcc: spreadSheet[row][column],
                                id_genotipo: (_c = genotype[0]) === null || _c === void 0 ? void 0 : _c.id
                            })];
                    case 19:
                        response = (_2.sent()).response;
                        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'o valor de NCA não foi encontrado no cadastro de lotes relacionado ao genótipo');
                        }
                        _2.label = 20;
                    case 20:
                        _y++;
                        return [3 /*break*/, 3];
                    case 21:
                        _i++;
                        return [3 /*break*/, 2];
                    case 22:
                        if (!(responseIfError.length === 0)) return [3 /*break*/, 44];
                        productivity = 0;
                        advance = 0;
                        register = 0;
                        verifyToDelete = false;
                        _2.label = 23;
                    case 23:
                        _2.trys.push([23, 42, , 44]);
                        _z = [];
                        for (_0 in spreadSheet)
                            _z.push(_0);
                        _1 = 0;
                        _2.label = 24;
                    case 24:
                        if (!(_1 < _z.length)) return [3 /*break*/, 40];
                        row = _z[_1];
                        if (!(row !== '0')) return [3 /*break*/, 39];
                        return [4 /*yield*/, typeAssayController.getAll({
                                filterName: spreadSheet[row][3]
                            })];
                    case 25:
                        typeAssay = (_2.sent()).response;
                        return [4 /*yield*/, focoController.getAll({ name: spreadSheet[row][2], id_culture: idCulture })];
                    case 26:
                        foco = (_2.sent()).response;
                        return [4 /*yield*/, tecnologiaController.getAll({
                                cod_tec: String(spreadSheet[row][5]),
                                id_culture: idCulture
                            })];
                    case 27:
                        technology = (_2.sent()).response;
                        return [4 /*yield*/, genotipoController.getAll({
                                filterGenotipo: spreadSheet[row][10],
                                id_culture: idCulture
                            })];
                    case 28:
                        genotype = (_2.sent()).response;
                        console.log("spreadSheet[row][11]  ", spreadSheet[row][11]);
                        console.log("technology  ", technology);
                        console.log("idCulture  ", idCulture);
                        console.log("genotype  ", (_d = genotype[0]) === null || _d === void 0 ? void 0 : _d.id);
                        return [4 /*yield*/, loteController.getAll({
                                filterNcc: spreadSheet[row][11] || '0'
                            })];
                    case 29:
                        lote = (_2.sent()).response;
                        return [4 /*yield*/, assayListController.getAll({
                                filterGli: spreadSheet[row][4],
                                id_safra: idSafra
                            })];
                    case 30:
                        assayList = (_2.sent()).response;
                        savedAssayList = void 0;
                        if (!(assayList.length === 0)) return [3 /*break*/, 33];
                        return [4 /*yield*/, assayListController.create({
                                id_safra: idSafra,
                                id_foco: (_e = foco[0]) === null || _e === void 0 ? void 0 : _e.id,
                                id_type_assay: (_f = typeAssay[0]) === null || _f === void 0 ? void 0 : _f.id,
                                id_tecnologia: (_g = technology[0]) === null || _g === void 0 ? void 0 : _g.id,
                                gli: spreadSheet[row][4],
                                bgm: String(spreadSheet[row][6]),
                                project: String(spreadSheet[row][7]),
                                created_by: createdBy
                            })];
                    case 31:
                        savedAssayList = _2.sent();
                        return [4 /*yield*/, genotypeTreatmentController.create({
                                id_safra: idSafra,
                                id_assay_list: (_h = savedAssayList.response) === null || _h === void 0 ? void 0 : _h.id,
                                id_genotipo: (_j = genotype[0]) === null || _j === void 0 ? void 0 : _j.id,
                                id_lote: (_k = lote[0]) === null || _k === void 0 ? void 0 : _k.id,
                                treatments_number: spreadSheet[row][8],
                                status: spreadSheet[row][9],
                                comments: spreadSheet[row][14] || '',
                                created_by: createdBy
                            })];
                    case 32:
                        _2.sent();
                        return [3 /*break*/, 38];
                    case 33:
                        if (Number(spreadSheet[row][8]) === 1) {
                            verifyToDelete = true;
                        }
                        return [4 /*yield*/, assayListController.update({
                                id: (_l = assayList[0]) === null || _l === void 0 ? void 0 : _l.id,
                                id_safra: idSafra,
                                id_foco: (_m = foco[0]) === null || _m === void 0 ? void 0 : _m.id,
                                id_type_assay: (_o = typeAssay[0]) === null || _o === void 0 ? void 0 : _o.id,
                                id_tecnologia: (_p = technology[0]) === null || _p === void 0 ? void 0 : _p.id,
                                gli: spreadSheet[row][4],
                                bgm: String(spreadSheet[row][6]),
                                project: String(spreadSheet[row][7]),
                                created_by: createdBy
                            })];
                    case 34:
                        savedAssayList = _2.sent();
                        if (!verifyToDelete) return [3 /*break*/, 36];
                        return [4 /*yield*/, genotypeTreatmentController.deleteAll(Number((_q = savedAssayList.response) === null || _q === void 0 ? void 0 : _q.id))];
                    case 35:
                        _2.sent();
                        verifyToDelete = false;
                        _2.label = 36;
                    case 36: return [4 /*yield*/, genotypeTreatmentController.create({
                            id_safra: idSafra,
                            id_assay_list: (_r = savedAssayList.response) === null || _r === void 0 ? void 0 : _r.id,
                            id_genotipo: (_s = genotype[0]) === null || _s === void 0 ? void 0 : _s.id,
                            id_lote: (_t = lote[0]) === null || _t === void 0 ? void 0 : _t.id,
                            treatments_number: spreadSheet[row][8],
                            comments: spreadSheet[row][14] || '',
                            status: spreadSheet[row][9],
                            created_by: createdBy
                        })];
                    case 37:
                        _2.sent();
                        _2.label = 38;
                    case 38:
                        if (savedAssayList.status === 200) {
                            if (spreadSheet[row][4] !== spreadSheet[Number(row) - 1][4]) {
                                if (spreadSheet[row][0] === 'PRODUTIVIDADE') {
                                    productivity += 1;
                                }
                                if (spreadSheet[row][0] === 'AVANÇO') {
                                    advance += 1;
                                }
                                register += 1;
                            }
                        }
                        _2.label = 39;
                    case 39:
                        _1++;
                        return [3 /*break*/, 24];
                    case 40: return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' })];
                    case 41:
                        _2.sent();
                        return [2 /*return*/, { status: 200, message: "Ensaios importados (" + String(register) + "). Produtividade x Avan\u00E7o (" + String(productivity) + " x " + String(advance) + ") " }];
                    case 42:
                        error_1 = _2.sent();
                        return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
                    case 43:
                        _2.sent();
                        handleError_1["default"]('Lista de ensaio controller', 'Save Import', error_1.message);
                        return [2 /*return*/, { status: 500, message: 'Erro ao salvar planilha de Lista de ensaio' }];
                    case 44: return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' })];
                    case 45:
                        _2.sent();
                        responseStringError = responseIfError.join('').replace(/undefined/g, '');
                        return [2 /*return*/, { status: 400, message: responseStringError }];
                    case 46:
                        error_2 = _2.sent();
                        return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
                    case 47:
                        _2.sent();
                        handleError_1["default"]('Lista de ensaio controller', 'Validate Import', error_2.message);
                        return [2 /*return*/, { status: 500, message: 'Erro ao validar planilha de Lista de ensaio' }];
                    case 48: return [2 /*return*/];
                }
            });
        });
    };
    return ImportAssayListController;
}());
exports.ImportAssayListController = ImportAssayListController;
