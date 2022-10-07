"use strict";
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
exports.ImportGenotypeTreatmentController = void 0;
var handleError_1 = require("../../shared/utils/handleError");
var numberValidate_1 = require("../../shared/utils/numberValidate");
var responseErrorFactory_1 = require("../../shared/utils/responseErrorFactory");
var genotipo_controller_1 = require("../genotype/genotipo.controller");
var log_import_controller_1 = require("../log-import.controller");
var lote_controller_1 = require("../lote.controller");
var genotype_treatment_controller_1 = require("./genotype-treatment.controller");
var history_genotype_treatment_controller_1 = require("./history-genotype-treatment.controller");
var ImportGenotypeTreatmentController = /** @class */ (function () {
    function ImportGenotypeTreatmentController() {
    }
    ImportGenotypeTreatmentController.validate = function (idLog, _a) {
        var _b, _c, _d, _e, _f, _g, _h;
        var spreadSheet = _a.spreadSheet, createdBy = _a.created_by;
        return __awaiter(this, void 0, Promise, function () {
            var loteController, genotipoController, logImportController, genotypeTreatmentController, historyGenotypeTreatmentController, responseIfError, _j, _k, _i, row, _l, treatmentsStatus, treatments, _m, _o, _p, column, status, status, status, status, _q, _r, _s, row, treatment, genotipo, lote, error_1, responseStringError, error_2;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        loteController = new lote_controller_1.LoteController();
                        genotipoController = new genotipo_controller_1.GenotipoController();
                        logImportController = new log_import_controller_1.LogImportController();
                        genotypeTreatmentController = new genotype_treatment_controller_1.GenotypeTreatmentController();
                        historyGenotypeTreatmentController = new history_genotype_treatment_controller_1.HistoryGenotypeTreatmentController();
                        responseIfError = [];
                        _t.label = 1;
                    case 1:
                        _t.trys.push([1, 33, , 35]);
                        _j = [];
                        for (_k in spreadSheet)
                            _j.push(_k);
                        _i = 0;
                        _t.label = 2;
                    case 2:
                        if (!(_i < _j.length)) return [3 /*break*/, 18];
                        row = _j[_i];
                        if (!(row !== '0')) return [3 /*break*/, 17];
                        return [4 /*yield*/, genotypeTreatmentController.getAll({
                                gli: spreadSheet[row][4],
                                treatments_number: spreadSheet[row][6],
                                name_genotipo: spreadSheet[row][8],
                                nca: spreadSheet[row][9]
                            })];
                    case 3:
                        _l = _t.sent(), treatmentsStatus = _l.status, treatments = _l.response;
                        if (treatmentsStatus === 400) {
                            responseIfError[0]
                                += "<li style=\"text-align:left\"> A " + row + "\u00AA linha esta incorreta, o tratamento de gen\u00F3tipo n\u00E3o encontrado </li> <br>";
                        }
                        if (((_b = treatments[0]) === null || _b === void 0 ? void 0 : _b.status_experiment) === 'SORTEADO') {
                            responseIfError[0]
                                += "<li style=\"text-align:left\"> A " + row + "\u00AA linha esta incorreta, o tratamento j\u00E1 foi sorteado e n\u00E3o pode ser substitu\u00EDdo. </li> <br>";
                        }
                        if (((_c = treatments[0]) === null || _c === void 0 ? void 0 : _c.assay_list.foco.name) !== spreadSheet[row][1]) {
                            responseIfError[0]
                                += "<li style=\"text-align:left\"> A " + row + "\u00AA linha esta incorreta, o foco e diferente do cadastrado no ensaio. </li> <br>";
                        }
                        if (((_d = treatments[0]) === null || _d === void 0 ? void 0 : _d.assay_list.type_assay.name) !== spreadSheet[row][2]) {
                            responseIfError[0]
                                += "<li style=\"text-align:left\"> A " + row + "\u00AA linha esta incorreta, o tipo de ensaio e diferente do cadastrado no ensaio. </li> <br>";
                        }
                        if (spreadSheet[row][3].toString().length < 2) {
                            // eslint-disable-next-line no-param-reassign
                            spreadSheet[row][3] = "0" + spreadSheet[row][3];
                        }
                        if (((_e = treatments[0]) === null || _e === void 0 ? void 0 : _e.assay_list.tecnologia.cod_tec) !== spreadSheet[row][3]) {
                            responseIfError[0]
                                += "<li style=\"text-align:left\"> A " + row + "\u00AA linha esta incorreta, a tecnologia e diferente da cadastrada no ensaio. </li> <br>";
                        }
                        _m = [];
                        for (_o in spreadSheet[row])
                            _m.push(_o);
                        _p = 0;
                        _t.label = 4;
                    case 4:
                        if (!(_p < _m.length)) return [3 /*break*/, 17];
                        column = _m[_p];
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
                        if (column === '5') { // BGM
                            if (spreadSheet[row][column] !== null) {
                                if (!numberValidate_1.validateInteger(spreadSheet[row][column])) {
                                    responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'precisa ser um numero inteiro e positivo');
                                }
                            }
                        }
                        if (column === '6') { // NT
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                        }
                        if (column === '7') { // STATUS_T
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                        }
                        if (!(column === '8')) return [3 /*break*/, 7];
                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 5];
                        responseIfError[Number(column)]
                            += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, genotypeTreatmentController.getAll({
                            name_genotipo: spreadSheet[row][column]
                        })];
                    case 6:
                        status = (_t.sent()).status;
                        if (status === 400) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        _t.label = 7;
                    case 7:
                        if (!(column === '9')) return [3 /*break*/, 10];
                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 8];
                        responseIfError[Number(column)]
                            += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, genotypeTreatmentController.getAll({
                            nca: String(spreadSheet[row][column])
                        })];
                    case 9:
                        status = (_t.sent()).status;
                        if (status === 400) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        _t.label = 10;
                    case 10:
                        if (!(column === '10')) return [3 /*break*/, 13];
                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 11];
                        responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'o campo é obrigatório, caso queira substituir apenas nca apenas replique os genotipos');
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, genotipoController.getAll({
                            name_genotipo: spreadSheet[row][column]
                        })];
                    case 12:
                        status = (_t.sent()).status;
                        if (status === 400) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        _t.label = 13;
                    case 13:
                        if (column === '11') { // STATUS T NOVO
                            if (spreadSheet[row][column] === null) {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                            }
                            else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                                responseIfError[Number(column)]
                                    += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
                            }
                        }
                        if (!(column === '12')) return [3 /*break*/, 16];
                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 14];
                        responseIfError[Number(column)]
                            += responseErrorFactory_1.responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, loteController.getAll({
                            ncc: Number(spreadSheet[row][column])
                        })];
                    case 15:
                        status = (_t.sent()).status;
                        if (status === 400) {
                            responseIfError[Number(column)]
                                += responseErrorFactory_1.responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                        }
                        _t.label = 16;
                    case 16:
                        _p++;
                        return [3 /*break*/, 4];
                    case 17:
                        _i++;
                        return [3 /*break*/, 2];
                    case 18:
                        if (!(responseIfError.length === 0)) return [3 /*break*/, 31];
                        _t.label = 19;
                    case 19:
                        _t.trys.push([19, 29, , 31]);
                        _q = [];
                        for (_r in spreadSheet)
                            _q.push(_r);
                        _s = 0;
                        _t.label = 20;
                    case 20:
                        if (!(_s < _q.length)) return [3 /*break*/, 27];
                        row = _q[_s];
                        if (!(row !== '0')) return [3 /*break*/, 26];
                        return [4 /*yield*/, genotypeTreatmentController.getAll({
                                gli: spreadSheet[row][4],
                                treatments_number: spreadSheet[row][6],
                                name_genotipo: spreadSheet[row][8],
                                nca: spreadSheet[row][9]
                            })];
                    case 21:
                        treatment = (_t.sent()).response;
                        return [4 /*yield*/, genotipoController.getAll({
                                name_genotipo: spreadSheet[row][10]
                            })];
                    case 22:
                        genotipo = (_t.sent()).response;
                        return [4 /*yield*/, loteController.getAll({
                                ncc: spreadSheet[row][12]
                            })];
                    case 23:
                        lote = (_t.sent()).response;
                        return [4 /*yield*/, genotypeTreatmentController.update({
                                id: (_f = treatment[0]) === null || _f === void 0 ? void 0 : _f.id,
                                id_genotipo: (_g = genotipo[0]) === null || _g === void 0 ? void 0 : _g.id,
                                id_lote: (_h = lote[0]) === null || _h === void 0 ? void 0 : _h.id,
                                status: spreadSheet[row][11]
                            })];
                    case 24:
                        _t.sent();
                        return [4 /*yield*/, historyGenotypeTreatmentController.create({
                                gli: spreadSheet[row][4],
                                safra: spreadSheet[row][0],
                                foco: spreadSheet[row][1],
                                ensaio: spreadSheet[row][2],
                                tecnologia: spreadSheet[row][3],
                                bgm: Number(spreadSheet[row][5]),
                                nt: Number(spreadSheet[row][6]),
                                status: spreadSheet[row][7],
                                genotipo: spreadSheet[row][8],
                                nca: Number(spreadSheet[row][9]),
                                created_by: createdBy
                            })];
                    case 25:
                        _t.sent();
                        _t.label = 26;
                    case 26:
                        _s++;
                        return [3 /*break*/, 20];
                    case 27: return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' })];
                    case 28:
                        _t.sent();
                        return [2 /*return*/, { status: 200, message: 'Tratamento de genótipo importado com sucesso' }];
                    case 29:
                        error_1 = _t.sent();
                        return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
                    case 30:
                        _t.sent();
                        handleError_1["default"]('Tratamento de genótipo controller', 'Save Import', error_1.message);
                        return [2 /*return*/, { status: 500, message: 'Erro ao salvar planilha de tratamento de genótipo' }];
                    case 31: return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
                    case 32:
                        _t.sent();
                        responseStringError = responseIfError.join('').replace(/undefined/g, '');
                        return [2 /*return*/, { status: 400, message: responseStringError }];
                    case 33:
                        error_2 = _t.sent();
                        return [4 /*yield*/, logImportController.update({ id: idLog, status: 1, state: 'FALHA' })];
                    case 34:
                        _t.sent();
                        handleError_1["default"]('Tratamento de genótipo controller', 'Validate Import', error_2.message);
                        return [2 /*return*/, { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' }];
                    case 35: return [2 /*return*/];
                }
            });
        });
    };
    return ImportGenotypeTreatmentController;
}());
exports.ImportGenotypeTreatmentController = ImportGenotypeTreatmentController;
