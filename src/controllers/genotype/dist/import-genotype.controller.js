"use strict";
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
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
exports.ImportGenotypeController = void 0;
var handleError_1 = require("../../shared/utils/handleError");
var numberValidate_1 = require("../../shared/utils/numberValidate");
var responseErrorFactory_1 = require("../../shared/utils/responseErrorFactory");
var cultura_controller_1 = require("../cultura.controller");
var import_controller_1 = require("../import.controller");
var log_import_controller_1 = require("../log-import.controller");
var lote_controller_1 = require("../lote.controller");
var safra_controller_1 = require("../safra.controller");
var tecnologia_controller_1 = require("../technology/tecnologia.controller");
var genotipo_controller_1 = require("./genotipo.controller");
/* eslint-disable no-restricted-syntax */
var ImportGenotypeController = /** @class */ (function () {
    function ImportGenotypeController() {
    }
    ImportGenotypeController.validate = function (idLog, _a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32;
        var spreadSheet = _a.spreadSheet, idSafra = _a.idSafra, idCulture = _a.idCulture, createdBy = _a.created_by;
        return __awaiter(this, void 0, Promise, function () {
            var loteController, safraController, importController, culturaController, genotipoController, logImportController, tecnologiaController, responseIfError, configModule, _loop_1, this_1, _33, _34, _i, row, _35, _36, _37, row, _38, _39, _40, column, geno, tec, lote, genotipo, error_1, responseStringError, error_2;
            return __generator(this, function (_41) {
                switch (_41.label) {
                    case 0:
                        console.log("herere -----------------");
                        loteController = new lote_controller_1.LoteController();
                        safraController = new safra_controller_1.SafraController();
                        importController = new import_controller_1.ImportController();
                        culturaController = new cultura_controller_1.CulturaController();
                        genotipoController = new genotipo_controller_1.GenotipoController();
                        logImportController = new log_import_controller_1.LogImportController();
                        tecnologiaController = new tecnologia_controller_1.TecnologiaController();
                        responseIfError = [];
                        _41.label = 1;
                    case 1:
                        _41.trys.push([1, 31, , 33]);
                        return [4 /*yield*/, importController.getAll(10)];
                    case 2:
                        configModule = _41.sent();
                        if (((_b = spreadSheet[0]) === null || _b === void 0 ? void 0 : _b.length) < 30) {
                            return [2 /*return*/, {
                                    status: 400,
                                    message: 'O numero de colunas e menor do que o esperado'
                                }];
                        }
                        if (((_c = spreadSheet[0]) === null || _c === void 0 ? void 0 : _c.length) > 30) {
                            return [2 /*return*/, {
                                    status: 400,
                                    message: 'O numero de colunas e maior do que o esperado'
                                }];
                        }
                        _loop_1 = function (row) {
                            var _loop_2, _a, _b, _i, column;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _loop_2 = function (column) {
                                            var genotipo, cultura, tec, status, _a, status, response, lote, nccDados_1, _b, status, response, dateNow, lastDtImport;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        if (row === '0') {
                                                            if (!spreadSheet[row][column]
                                                                .toUpperCase()
                                                                .includes((_e = (_d = configModule.response[0]) === null || _d === void 0 ? void 0 : _d.fields[column]) === null || _e === void 0 ? void 0 : _e.toUpperCase())) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'a sequencia de colunas da planilha esta incorreta');
                                                            }
                                                        }
                                                        if (!(row !== '0')) return [3 /*break*/, 18];
                                                        // campos genotipo
                                                        if (((_f = configModule.response[0]) === null || _f === void 0 ? void 0 : _f.fields[column]) === 'id_s1') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                        }
                                                        if (!(((_g = configModule.response[0]) === null || _g === void 0 ? void 0 : _g.fields[column]) === 'S1_DATA_ID')) return [3 /*break*/, 3];
                                                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 1];
                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        return [3 /*break*/, 3];
                                                    case 1: return [4 /*yield*/, genotipoController.getAll({
                                                            id_dados_geno: spreadSheet[row][column]
                                                        })];
                                                    case 2:
                                                        genotipo = _c.sent();
                                                        if (genotipo.total > 0) {
                                                            this_1.aux.id_dados_geno = (_h = genotipo.response[0]) === null || _h === void 0 ? void 0 : _h.id_dados;
                                                        }
                                                        _c.label = 3;
                                                    case 3:
                                                        if (!(((_j = configModule.response[0]) === null || _j === void 0 ? void 0 : _j.fields[column]) === 'Cultura')) return [3 /*break*/, 6];
                                                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 4];
                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        return [3 /*break*/, 6];
                                                    case 4: return [4 /*yield*/, culturaController.getAllCulture({
                                                            name: spreadSheet[row][column]
                                                        })];
                                                    case 5:
                                                        cultura = _c.sent();
                                                        if (cultura.total > 0) {
                                                            if (idCulture !== ((_k = cultura.response[0]) === null || _k === void 0 ? void 0 : _k.id)) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'o campo cultura tem que ser igual a cultura selecionada');
                                                            }
                                                        }
                                                        else {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'cultura não existe');
                                                        }
                                                        _c.label = 6;
                                                    case 6:
                                                        if (((_l = configModule.response[0]) === null || _l === void 0 ? void 0 : _l.fields[column]) === 'Nome do genótipo') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                        }
                                                        if (!(((_m = configModule.response[0]) === null || _m === void 0 ? void 0 : _m.fields[column]) === 'Código da tecnologia')) return [3 /*break*/, 9];
                                                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 7];
                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        return [3 /*break*/, 9];
                                                    case 7:
                                                        if (spreadSheet[row][column] < 10) {
                                                            // eslint-disable-next-line no-param-reassign
                                                            spreadSheet[row][column] = "0" + spreadSheet[row][column];
                                                        }
                                                        return [4 /*yield*/, tecnologiaController.getAll({
                                                                id_culture: idCulture,
                                                                cod_tec: String(spreadSheet[row][column])
                                                            })];
                                                    case 8:
                                                        tec = _c.sent();
                                                        if (tec.total === 0) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'a tecnologia informado não existe no sistema');
                                                        }
                                                        _c.label = 9;
                                                    case 9:
                                                        if (((_o = configModule.response[0]) === null || _o === void 0 ? void 0 : _o.fields[column]) === 'GMR') {
                                                            if (spreadSheet[row][column] !== null) {
                                                                if (!numberValidate_1.validateInteger(spreadSheet[row][column])) {
                                                                    responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'precisa ser um numero inteiro e positivo');
                                                                }
                                                            }
                                                        }
                                                        if (((_p = configModule.response[0]) === null || _p === void 0 ? void 0 : _p.fields[column]) === 'BGM') {
                                                            if (spreadSheet[row][column] !== null) {
                                                                if (!numberValidate_1.validateInteger(spreadSheet[row][column])) {
                                                                    responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'precisa ser um numero inteiro e positivo');
                                                                }
                                                            }
                                                        }
                                                        if (!(spreadSheet[row][25] !== null)) return [3 /*break*/, 15];
                                                        // Campos lote
                                                        if (((_q = configModule.response[0]) === null || _q === void 0 ? void 0 : _q.fields[column]) === 'DATA_ID') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                        }
                                                        if (!(((_r = configModule.response[0]) === null || _r === void 0 ? void 0 : _r.fields[column]) === 'Ano do lote')) return [3 /*break*/, 11];
                                                        if (spreadSheet[row][column] === null) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        }
                                                        return [4 /*yield*/, safraController.getAll({
                                                                id_culture: idCulture,
                                                                safraName: String(spreadSheet[row][Number(column) + 1])
                                                            })];
                                                    case 10:
                                                        status = (_c.sent()).status;
                                                        if (status === 400) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'ano não é igual ao ano da safra');
                                                        }
                                                        _c.label = 11;
                                                    case 11:
                                                        if (!(((_s = configModule.response[0]) === null || _s === void 0 ? void 0 : _s.fields[column]) === 'Safra')) return [3 /*break*/, 14];
                                                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 12];
                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        return [3 /*break*/, 14];
                                                    case 12: return [4 /*yield*/, safraController.getAll({
                                                            id_culture: idCulture,
                                                            safraName: String(spreadSheet[row][column])
                                                        })];
                                                    case 13:
                                                        _a = _c.sent(), status = _a.status, response = _a.response;
                                                        if (status === 400) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'safra não cadastrada');
                                                        }
                                                        else if (((_t = response[0]) === null || _t === void 0 ? void 0 : _t.id) !== Number(idSafra)) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'safra informada diferente da safra selecionada');
                                                        }
                                                        _c.label = 14;
                                                    case 14:
                                                        if (((_u = configModule.response[0]) === null || _u === void 0 ? void 0 : _u.fields[column]) === 'Código do lote') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                            else {
                                                                lote = loteController.getAll({
                                                                    cod_lote: String(spreadSheet[row][column])
                                                                });
                                                                if (lote.total > 0) {
                                                                    responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'código do lote deve ser um campo único no GOM');
                                                                }
                                                            }
                                                        }
                                                        if (((_v = configModule.response[0]) === null || _v === void 0 ? void 0 : _v.fields[column]) === 'Cruzamento de origem') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                        }
                                                        if (((_w = configModule.response[0]) === null || _w === void 0 ? void 0 : _w.fields[column]) === 'id_s2') {
                                                            if (spreadSheet[row][column] === null) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                            }
                                                        }
                                                        if (((_x = configModule.response[0]) === null || _x === void 0 ? void 0 : _x.fields[column]) === 'NCC') {
                                                            nccDados_1 = [];
                                                            // eslint-disable-next-line array-callback-return
                                                            spreadSheet.map(function (val, index) {
                                                                if (index === column) {
                                                                    if (nccDados_1.includes(val)) {
                                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'o campo ncc não pode ser repetido');
                                                                    }
                                                                    else {
                                                                        nccDados_1.push(val);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        _c.label = 15;
                                                    case 15:
                                                        if (!(((_y = configModule.response[0]) === null || _y === void 0 ? void 0 : _y.fields[column]) === 'DT_IMPORT')) return [3 /*break*/, 18];
                                                        if (!(spreadSheet[row][column] === null)) return [3 /*break*/, 16];
                                                        responseIfError[Number(column)] += responseErrorFactory_1.responseNullFactory(Number(column) + 1, row, spreadSheet[0][column]);
                                                        return [3 /*break*/, 18];
                                                    case 16:
                                                        // eslint-disable-next-line no-param-reassign
                                                        spreadSheet[row][column] = new Date(spreadSheet[row][column]);
                                                        return [4 /*yield*/, genotipoController.getAll({
                                                                id_dados: spreadSheet[row][1],
                                                                id_culture: idCulture
                                                            })];
                                                    case 17:
                                                        _b = _c.sent(), status = _b.status, response = _b.response;
                                                        dateNow = new Date();
                                                        if (dateNow.getTime() < spreadSheet[row][column].getTime()) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'a data e maior que a data atual');
                                                        }
                                                        if (spreadSheet[row][column].getTime() < 100000) {
                                                            responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'o campo DT precisa ser no formato data');
                                                        }
                                                        if (status === 200) {
                                                            lastDtImport = (_0 = (_z = response[0]) === null || _z === void 0 ? void 0 : _z.dt_import) === null || _0 === void 0 ? void 0 : _0.getTime();
                                                            if (lastDtImport
                                                                > spreadSheet[row][column].getTime()) {
                                                                responseIfError[Number(column)] += responseErrorFactory_1.responseGenericFactory(Number(column) + 1, row, spreadSheet[0][column], 'essa informação é mais antiga do que a informação do software');
                                                            }
                                                        }
                                                        _c.label = 18;
                                                    case 18: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _a = [];
                                        for (_b in spreadSheet[row])
                                            _a.push(_b);
                                        _i = 0;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        column = _a[_i];
                                        return [5 /*yield**/, _loop_2(column)];
                                    case 2:
                                        _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _33 = [];
                        for (_34 in spreadSheet)
                            _33.push(_34);
                        _i = 0;
                        _41.label = 3;
                    case 3:
                        if (!(_i < _33.length)) return [3 /*break*/, 6];
                        row = _33[_i];
                        return [5 /*yield**/, _loop_1(row)];
                    case 4:
                        _41.sent();
                        _41.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(responseIfError.length === 0)) return [3 /*break*/, 29];
                        this.aux.created_by = Number(createdBy);
                        this.aux.id_culture = Number(idCulture);
                        _41.label = 7;
                    case 7:
                        _41.trys.push([7, 27, , 29]);
                        _35 = [];
                        for (_36 in spreadSheet)
                            _35.push(_36);
                        _37 = 0;
                        _41.label = 8;
                    case 8:
                        if (!(_37 < _35.length)) return [3 /*break*/, 25];
                        row = _35[_37];
                        if (!(row !== '0')) return [3 /*break*/, 24];
                        _38 = [];
                        for (_39 in spreadSheet[row])
                            _38.push(_39);
                        _40 = 0;
                        _41.label = 9;
                    case 9:
                        if (!(_40 < _38.length)) return [3 /*break*/, 24];
                        column = _38[_40];
                        this.aux.genealogy = '';
                        // campos genotipo
                        if (((_1 = configModule.response[0]) === null || _1 === void 0 ? void 0 : _1.fields[column]) === 'id_s1') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.id_s1 = spreadSheet[row][column];
                            }
                        }
                        if (!(((_2 = configModule.response[0]) === null || _2 === void 0 ? void 0 : _2.fields[column]) === 'S1_DATA_ID')) return [3 /*break*/, 11];
                        if (!(spreadSheet[row][column] !== null)) return [3 /*break*/, 11];
                        return [4 /*yield*/, genotipoController.getAll({
                                id_culture: idCulture,
                                id_dados: spreadSheet[row][column]
                            })];
                    case 10:
                        geno = _41.sent();
                        if (geno.total > 0) {
                            this.aux.id_genotipo = (_3 = geno.response[0]) === null || _3 === void 0 ? void 0 : _3.id;
                        }
                        else {
                            this.aux.id_genotipo = null;
                        }
                        this.aux.id_dados_geno = spreadSheet[row][column];
                        _41.label = 11;
                    case 11:
                        if (((_4 = configModule.response[0]) === null || _4 === void 0 ? void 0 : _4.fields[column]) === 'Nome do genótipo') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.name_genotipo = spreadSheet[row][column];
                            }
                        }
                        if (((_5 = configModule.response[0]) === null || _5 === void 0 ? void 0 : _5.fields[column]) === 'Nome principal') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.name_main = spreadSheet[row][column];
                            }
                        }
                        if (((_6 = configModule.response[0]) === null || _6 === void 0 ? void 0 : _6.fields[column]) === 'Nome público') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.name_public = spreadSheet[row][column];
                            }
                        }
                        if (((_7 = configModule.response[0]) === null || _7 === void 0 ? void 0 : _7.fields[column]) === 'Nome experimental') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.name_experiment = spreadSheet[row][column];
                            }
                        }
                        if (((_8 = configModule.response[0]) === null || _8 === void 0 ? void 0 : _8.fields[column]) === 'Nome alternativo') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.name_alter = spreadSheet[row][column];
                            }
                        }
                        if (((_9 = configModule.response[0]) === null || _9 === void 0 ? void 0 : _9.fields[column]) === 'Elite_Nome') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.elite_name = spreadSheet[row][column];
                            }
                        }
                        if (!(((_10 = configModule.response[0]) === null || _10 === void 0 ? void 0 : _10.fields[column]) === 'Código da tecnologia')) return [3 /*break*/, 13];
                        if (!(spreadSheet[row][column] !== null)) return [3 /*break*/, 13];
                        if (typeof spreadSheet[row][column] === 'number'
                            && spreadSheet[row][column].toString().length < 2) {
                            // eslint-disable-next-line no-param-reassign
                            spreadSheet[row][column] = "0" + spreadSheet[row][column].toString();
                        }
                        return [4 /*yield*/, tecnologiaController.getAll({
                                id_culture: idCulture,
                                cod_tec: String(spreadSheet[row][column])
                            })];
                    case 12:
                        tec = _41.sent();
                        if (tec.total > 0) {
                            this.aux.id_tecnologia = (_11 = tec.response[0]) === null || _11 === void 0 ? void 0 : _11.id;
                        }
                        _41.label = 13;
                    case 13:
                        if (((_12 = configModule.response[0]) === null || _12 === void 0 ? void 0 : _12.fields[column]) === 'Tipo') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.type = spreadSheet[row][column];
                            }
                        }
                        if (((_13 = configModule.response[0]) === null || _13 === void 0 ? void 0 : _13.fields[column]) === 'gmr') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.gmr = spreadSheet[row][column];
                            }
                        }
                        if (((_14 = configModule.response[0]) === null || _14 === void 0 ? void 0 : _14.fields[column]) === 'bgm') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.bgm = spreadSheet[row][column];
                            }
                        }
                        if (((_15 = configModule.response[0]) === null || _15 === void 0 ? void 0 : _15.fields[column]) === 'Cruzamento de origem') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.cruza = spreadSheet[row][column];
                            }
                        }
                        if (((_16 = configModule.response[0]) === null || _16 === void 0 ? void 0 : _16.fields[column]) === 'Progenitor F direto') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.progenitor_f_direto = spreadSheet[row][column];
                            }
                        }
                        if (((_17 = configModule.response[0]) === null || _17 === void 0 ? void 0 : _17.fields[column]) === 'Progenitor M direto') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.progenitor_m_direto = spreadSheet[row][column];
                            }
                        }
                        if (((_18 = configModule.response[0]) === null || _18 === void 0 ? void 0 : _18.fields[column]) === 'Progenitor F de origem') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.progenitor_f_origem = spreadSheet[row][column];
                            }
                        }
                        if (((_19 = configModule.response[0]) === null || _19 === void 0 ? void 0 : _19.fields[column]) === 'Progenitor M de origem') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.progenitor_m_origem = spreadSheet[row][column];
                            }
                        }
                        if (((_20 = configModule.response[0]) === null || _20 === void 0 ? void 0 : _20.fields[column]) === 'Progenitores de origem') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.progenitores_origem = spreadSheet[row][column];
                            }
                        }
                        if (((_21 = configModule.response[0]) === null || _21 === void 0 ? void 0 : _21.fields[column]) === 'Parentesco Completo') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.parentesco_completo = spreadSheet[row][column];
                            }
                        }
                        // Campos lote
                        if (((_22 = configModule.response[0]) === null || _22 === void 0 ? void 0 : _22.fields[column]) === 'id_s2') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.id_s2 = spreadSheet[row][column];
                            }
                        }
                        if (!(((_23 = configModule.response[0]) === null || _23 === void 0 ? void 0 : _23.fields[column]) === 'DATA_ID')) return [3 /*break*/, 15];
                        if (!(spreadSheet[row][column] !== null)) return [3 /*break*/, 15];
                        return [4 /*yield*/, loteController.getAll({
                                id_dados: spreadSheet[row][column]
                            })];
                    case 14:
                        lote = _41.sent();
                        if (lote.total > 0) {
                            this.aux.id_lote = (_24 = lote.response[0]) === null || _24 === void 0 ? void 0 : _24.id;
                        }
                        this.aux.id_dados_lote = spreadSheet[row][column];
                        _41.label = 15;
                    case 15:
                        if (((_25 = configModule.response[0]) === null || _25 === void 0 ? void 0 : _25.fields[column]) === 'Ano do lote') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.year = spreadSheet[row][column];
                            }
                        }
                        if (((_26 = configModule.response[0]) === null || _26 === void 0 ? void 0 : _26.fields[column]) === 'NCC') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.ncc = spreadSheet[row][column];
                            }
                            else {
                                this.aux.ncc = null;
                            }
                        }
                        if (((_27 = configModule.response[0]) === null || _27 === void 0 ? void 0 : _27.fields[column]) === 'Safra') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.id_safra = idSafra;
                            }
                        }
                        if (((_28 = configModule.response[0]) === null || _28 === void 0 ? void 0 : _28.fields[column]) === 'Código do lote') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.cod_lote = spreadSheet[row][column];
                            }
                        }
                        if (((_29 = configModule.response[0]) === null || _29 === void 0 ? void 0 : _29.fields[column]) === 'Fase') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.fase = spreadSheet[row][column];
                            }
                        }
                        if (((_30 = configModule.response[0]) === null || _30 === void 0 ? void 0 : _30.fields[column]) === 'Peso') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.peso = spreadSheet[row][column];
                            }
                        }
                        if (((_31 = configModule.response[0]) === null || _31 === void 0 ? void 0 : _31.fields[column]) === 'SEMENTES') {
                            if (spreadSheet[row][column] !== null) {
                                this.aux.quant_sementes = spreadSheet[row][column];
                            }
                        }
                        if (((_32 = configModule.response[0]) === null || _32 === void 0 ? void 0 : _32.fields[column]) === 'DT_IMPORT') {
                            console.log('spreadSheet[row][column]');
                            console.log(spreadSheet[row][column]);
                            if (spreadSheet[row][column] !== null) {
                                this.aux.dt_import = spreadSheet[row][column];
                            }
                        }
                        if (!(spreadSheet[row].length === Number(column) + 1
                            && this.aux !== [])) return [3 /*break*/, 23];
                        if (!this.aux.id_genotipo) return [3 /*break*/, 17];
                        return [4 /*yield*/, genotipoController.update({
                                id: this.aux.id_genotipo,
                                id_tecnologia: Number(this.aux.id_tecnologia),
                                id_s1: this.aux.id_s1,
                                id_dados: String(this.aux.id_dados_geno),
                                name_genotipo: this.aux.name_genotipo,
                                name_main: this.aux.name_main,
                                name_public: this.aux.name_public,
                                name_experiment: this.aux.name_experiment,
                                name_alter: this.aux.name_alter,
                                elit_name: this.aux.elit_name,
                                type: this.aux.type,
                                gmr: this.aux.gmr,
                                bgm: this.aux.bgm,
                                cruza: this.aux.cruza,
                                progenitor_f_direto: this.aux.progenitor_f_direto,
                                progenitor_m_direto: this.aux.progenitor_m_direto,
                                progenitor_f_origem: this.aux.progenitor_f_origem,
                                progenitor_m_origem: this.aux.progenitor_m_origem,
                                progenitores_origem: this.aux.progenitores_origem,
                                parentesco_completo: this.aux.parentesco_completo,
                                dt_import: this.aux.dt_import,
                                created_by: this.aux.created_by
                            })];
                    case 16:
                        _41.sent();
                        return [3 /*break*/, 19];
                    case 17:
                        delete this.aux.id_genotipo;
                        return [4 /*yield*/, genotipoController.create({
                                id_culture: this.aux.id_culture,
                                id_tecnologia: this.aux.id_tecnologia,
                                id_s1: this.aux.id_s1,
                                id_dados: String(this.aux.id_dados_geno),
                                name_genotipo: this.aux.name_genotipo,
                                name_main: this.aux.name_main,
                                name_public: this.aux.name_public,
                                name_experiment: this.aux.name_experiment,
                                name_alter: this.aux.name_alter,
                                elit_name: this.aux.elit_name,
                                type: this.aux.type,
                                gmr: this.aux.gmr,
                                bgm: this.aux.bgm,
                                cruza: this.aux.cruza,
                                progenitor_f_direto: this.aux.progenitor_f_direto,
                                progenitor_m_direto: this.aux.progenitor_m_direto,
                                progenitor_f_origem: this.aux.progenitor_f_origem,
                                progenitor_m_origem: this.aux.progenitor_m_origem,
                                progenitores_origem: this.aux.progenitores_origem,
                                parentesco_completo: this.aux.parentesco_completo,
                                dt_import: this.aux.dt_import,
                                created_by: this.aux.created_by
                            })];
                    case 18:
                        genotipo = _41.sent();
                        this.aux.id_genotipo = genotipo.response.id;
                        _41.label = 19;
                    case 19:
                        if (!(this.aux.id_genotipo && this.aux.ncc)) return [3 /*break*/, 23];
                        if (!this.aux.id_lote) return [3 /*break*/, 21];
                        return [4 /*yield*/, loteController.update({
                                id: Number(this.aux.id_lote),
                                id_genotipo: Number(this.aux.id_genotipo),
                                id_safra: Number(this.aux.id_safra),
                                cod_lote: String(this.aux.cod_lote),
                                id_s2: Number(this.aux.id_s2),
                                id_dados: Number(this.aux.id_dados_lote),
                                year: Number(this.aux.year),
                                ncc: Number(this.aux.ncc),
                                fase: this.aux.fase,
                                peso: this.aux.peso,
                                quant_sementes: this.aux.quant_sementes,
                                created_by: this.aux.created_by
                            })];
                    case 20:
                        _41.sent();
                        delete this.aux.id_lote;
                        delete this.aux.id_genotipo;
                        return [3 /*break*/, 23];
                    case 21: 
                    //console.log("created--- ", Number(this.aux.ncc),)
                    return [4 /*yield*/, loteController.create({
                            id_genotipo: Number(this.aux.id_genotipo),
                            id_safra: Number(this.aux.id_safra),
                            cod_lote: String(this.aux.cod_lote),
                            id_s2: Number(this.aux.id_s2),
                            id_dados: Number(this.aux.id_dados_lote),
                            year: Number(this.aux.year),
                            ncc: Number(this.aux.ncc),
                            fase: this.aux.fase,
                            peso: this.aux.peso,
                            quant_sementes: this.aux.quant_sementes,
                            created_by: this.aux.created_by
                        })];
                    case 22:
                        //console.log("created--- ", Number(this.aux.ncc),)
                        _41.sent();
                        delete this.aux.id_genotipo;
                        _41.label = 23;
                    case 23:
                        _40++;
                        return [3 /*break*/, 9];
                    case 24:
                        _37++;
                        return [3 /*break*/, 8];
                    case 25: return [4 /*yield*/, logImportController.update({
                            id: idLog,
                            status: 1,
                            state: 'SUCESSO'
                        })];
                    case 26:
                        _41.sent();
                        return [2 /*return*/, { status: 200, message: 'Genótipo importado com sucesso' }];
                    case 27:
                        error_1 = _41.sent();
                        return [4 /*yield*/, logImportController.update({
                                id: idLog,
                                status: 1,
                                state: 'FALHA'
                            })];
                    case 28:
                        _41.sent();
                        handleError_1["default"]('Genótipo controller', 'Save Import', error_1.message);
                        return [2 /*return*/, {
                                status: 500,
                                message: 'Erro ao salvar planilha de Genótipo'
                            }];
                    case 29: return [4 /*yield*/, logImportController.update({
                            id: idLog,
                            status: 1,
                            state: 'INVALIDA'
                        })];
                    case 30:
                        _41.sent();
                        responseStringError = responseIfError
                            .join('')
                            .replace(/undefined/g, '');
                        return [2 /*return*/, { status: 400, message: responseStringError }];
                    case 31:
                        error_2 = _41.sent();
                        return [4 /*yield*/, logImportController.update({
                                id: idLog,
                                status: 1,
                                state: 'FALHA'
                            })];
                    case 32:
                        _41.sent();
                        handleError_1["default"]('Genótipo controller', 'Validate Import', error_2.message);
                        return [2 /*return*/, { status: 500, message: 'Erro ao validar planilha de Genótipo' }];
                    case 33: return [2 /*return*/];
                }
            });
        });
    };
    ImportGenotypeController.aux = {};
    return ImportGenotypeController;
}());
exports.ImportGenotypeController = ImportGenotypeController;
