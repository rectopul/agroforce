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
exports.ExperimentController = void 0;
var handleError_1 = require("../../shared/utils/handleError");
var experiment_repository_1 = require("../../repository/experiment.repository");
var reporte_repository_1 = require("../../repository/reporte.repository");
var handleOrderForeign_1 = require("../../shared/utils/handleOrderForeign");
var assay_list_controller_1 = require("../assay-list/assay-list.controller");
var functionsUtils_1 = require("../../shared/utils/functionsUtils");
var experiment_group_controller_1 = require("../experiment-group/experiment-group.controller");
var experiment_genotipe_controller_1 = require("../experiment-genotipe.controller");
var ExperimentController = /** @class */ (function () {
    function ExperimentController() {
        this.experimentRepository = new experiment_repository_1.ExperimentRepository();
        this.assayListController = new assay_list_controller_1.AssayListController();
        this.reporteRepository = new reporte_repository_1.ReporteRepository();
    }
    ExperimentController.prototype.getAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, orderBy, statusParams, select, take, skip, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {};
                        parameters.AND = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('options');
                        console.log(options);
                        if (options.filterRepetitionFrom || options.filterRepetitionTo) {
                            if (options.filterRepetitionFrom && options.filterRepetitionTo) {
                                parameters.repetitionsNumber = JSON.parse("{\"gte\": " + Number(options.filterRepetitionFrom) + ", \"lte\": " + Number(options.filterRepetitionTo) + " }");
                            }
                            else if (options.filterRepetitionFrom) {
                                parameters.repetitionsNumber = JSON.parse("{\"gte\": " + Number(options.filterRepetitionFrom) + " }");
                            }
                            else if (options.filterRepetitionTo) {
                                parameters.repetitionsNumber = JSON.parse("{\"lte\": " + Number(options.filterRepetitionTo) + " }");
                            }
                        }
                        // if (options.filterRepetition) {
                        //   parameters.repetitionsNumber = Number(options.filterRepetition);
                        // }
                        if (options.filterStatus) {
                            parameters.OR = [];
                            statusParams = options.filterStatus.split(',');
                            parameters.OR.push(JSON.parse("{\"status\": {\"equals\": \"" + statusParams[0] + "\" } }"));
                            parameters.OR.push(JSON.parse("{\"status\": {\"equals\": \"" + statusParams[1] + "\" } }"));
                        }
                        if (options.filterExperimentName) {
                            parameters.experimentName = JSON.parse("{ \"contains\":\"" + options.filterExperimentName + "\" }");
                        }
                        if (options.filterCod) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"tecnologia\": { \"cod_tec\":  {\"contains\": \"" + options.filterCod + "\" } } } }"));
                        }
                        if (options.filterPeriod) {
                            parameters.period = Number(options.filterPeriod);
                        }
                        if (options.filterFoco) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"foco\": {\"name\": {\"contains\": \"" + options.filterFoco + "\" } } } }"));
                        }
                        if (options.filterTypeAssay) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"type_assay\": {\"name\": {\"contains\": \"" + options.filterTypeAssay + "\" } } } }"));
                        }
                        if (options.filterGli) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"gli\": {\"contains\": \"" + options.filterGli + "\" } } }"));
                        }
                        if (options.filterTecnologia) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"tecnologia\": { \"name\":  {\"contains\": \"" + options.filterTecnologia + "\" } } } }"));
                        }
                        if (options.filterDelineamento) {
                            parameters.delineamento = JSON.parse("{ \"name\": {\"contains\": \"" + options.filterDelineamento + "\" } }");
                        }
                        if (options.experimentGroupId) {
                            parameters.experimentGroupId = Number(options.experimentGroupId);
                        }
                        select = {
                            id: true,
                            idSafra: true,
                            density: true,
                            safra: true,
                            repetitionsNumber: true,
                            experimentGroupId: true,
                            period: true,
                            nlp: true,
                            clp: true,
                            experimentName: true,
                            comments: true,
                            orderDraw: true,
                            status: true,
                            bgm: true,
                            assay_list: {
                                select: {
                                    gli: true,
                                    bgm: true,
                                    status: true,
                                    genotype_treatment: { include: { genotipo: true } },
                                    tecnologia: {
                                        select: {
                                            name: true,
                                            id: true,
                                            cod_tec: true
                                        }
                                    },
                                    foco: {
                                        select: {
                                            name: true,
                                            id: true
                                        }
                                    },
                                    type_assay: {
                                        select: {
                                            name: true,
                                            id: true
                                        }
                                    },
                                    safra: {
                                        select: {
                                            safraName: true
                                        }
                                    }
                                }
                            },
                            local: {
                                select: {
                                    name_local_culture: true,
                                    cultureUnity: true
                                }
                            },
                            delineamento: {
                                select: {
                                    name: true,
                                    repeticao: true,
                                    id: true
                                }
                            },
                            experiment_genotipe: true
                        };
                        if (options.idSafra) {
                            parameters.idSafra = Number(options.idSafra);
                        }
                        if (options.id_safra) {
                            parameters.idSafra = Number(options.id_safra);
                        }
                        if (options.id) {
                            parameters.id = Number(options.id);
                        }
                        if (options.id_assay_list) {
                            parameters.idAssayList = Number(options.id_assay_list);
                        }
                        if (options.experimentName) {
                            parameters.experimentName = options.experimentName;
                        }
                        if (options.Foco) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"foco\": {\"id\": " + Number(options.Foco) + " } } }"));
                        }
                        if (options.TypeAssay) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"type_assay\": {\"id\": " + Number(options.TypeAssay) + " } } }"));
                        }
                        if (options.Tecnologia) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"tecnologia\": {\"cod_tec\": \"" + options.Tecnologia + "\" } } }"));
                        }
                        if (options.Epoca) {
                            parameters.period = Number(options.Epoca);
                        }
                        if (options.Status) {
                            parameters.status = options.Status;
                        }
                        if (options.status) {
                            parameters.status = options.status;
                        }
                        if (options.gli) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"gli\": {\"contains\": \"" + options.gli + "\" } } }"));
                        }
                        take = (options.take) ? Number(options.take) : undefined;
                        skip = (options.skip) ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        console.log('parameters');
                        console.log(parameters);
                        return [4 /*yield*/, this.experimentRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 2:
                        response = _a.sent();
                        console.log('response');
                        console.log(response);
                        response.map(function (item) {
                            var newItem = item;
                            newItem.countNT = functionsUtils_1.functionsUtils
                                .countChildrenForSafra(item.assay_list.genotype_treatment, Number(options.idSafra));
                            newItem.npeQT = item.countNT * item.repetitionsNumber;
                            return newItem;
                        });
                        if (response.total <= 0) {
                            return [2 /*return*/, {
                                    status: 400, response: [], total: 0, message: 'Nenhum experimento encontrado'
                                }];
                        }
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 3:
                        error_1 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'GetAll', error_1.message);
                        throw new Error('[Controller] - GetAll Experimento erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!id)
                            throw new Error('Dados inválidos');
                        return [4 /*yield*/, this.experimentRepository.findOne(id)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            return [2 /*return*/, { status: 400, response: response }];
                        return [2 /*return*/, { status: 200, response: response }];
                    case 2:
                        error_2 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'GetOne', error_2.message);
                        throw new Error('[Controller] - GetOne Experimento erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.getFromExpName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.experimentRepository.findOneByName(name)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            throw new Error('Item não encontrado');
                        return [2 /*return*/, { status: 200, response: response }];
                    case 2:
                        error_3 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'GetOne', error_3.message);
                        throw new Error('[Controller] - GetOne Experimento erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.experimentRepository.create(data)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: 'Experimento cadastrado' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Experimento não cadastrado' }];
                    case 2:
                        error_4 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'Create', error_4.message);
                        throw new Error('[Controller] - Create Experimento erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var idList, experimento, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (!data.idList) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.experimentRepository.relationGroup(data)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.countExperimentGroupChildren(data.experimentGroupId)];
                    case 2:
                        idList = _a.sent();
                        return [4 /*yield*/, this.setParcelasStatus(idList)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { status: 200, message: 'Experimento atualizado' }];
                    case 4: return [4 /*yield*/, this.experimentRepository.findOne(data.id)];
                    case 5:
                        experimento = _a.sent();
                        if (!experimento)
                            return [2 /*return*/, { status: 404, message: 'Experimento não encontrado' }];
                        return [4 /*yield*/, this.experimentRepository.update(experimento.id, data)];
                    case 6:
                        response = _a.sent();
                        if (!experimento.experimentGroupId) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.countExperimentGroupChildren(experimento.experimentGroupId)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!!response.experimentGroupId) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.experimentRepository.update(response.id, { status: 'SORTEADO' })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (response) {
                            return [2 /*return*/, { status: 200, message: 'Experimento atualizado' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Experimento não atualizado' }];
                    case 11:
                        error_5 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'Update', error_5.message);
                        throw new Error('[Controller] - Update Experimento erro');
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype["delete"] = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var experimentExist, response, assayList, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getOne(Number(data.id))];
                    case 1:
                        experimentExist = _a.sent();
                        if (!experimentExist)
                            return [2 /*return*/, { status: 404, message: 'Experimento não encontrado' }];
                        if ((experimentExist === null || experimentExist === void 0 ? void 0 : experimentExist.status) === 'PARCIALMENTE ALOCADO' || (experimentExist === null || experimentExist === void 0 ? void 0 : experimentExist.status) === 'TOTALMENTE  ALOCADO')
                            return [2 /*return*/, { status: 400, message: 'Não é possível deletar.' }];
                        return [4 /*yield*/, this.experimentRepository["delete"](Number(data.id))];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.assayListController.getOne(Number(experimentExist === null || experimentExist === void 0 ? void 0 : experimentExist.idAssayList))];
                    case 3:
                        assayList = (_a.sent()).response;
                        if (!!(assayList === null || assayList === void 0 ? void 0 : assayList.experiment.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.assayListController.update({
                                id: experimentExist === null || experimentExist === void 0 ? void 0 : experimentExist.idAssayList,
                                status: 'IMPORTADO'
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (response) {
                            return [2 /*return*/, { status: 200, message: 'Experimento excluído' }];
                        }
                        return [2 /*return*/, { status: 404, message: 'Experimento não excluído' }];
                    case 6:
                        error_6 = _a.sent();
                        handleError_1["default"]('Experimento controller', 'Delete', error_6.message);
                        throw new Error('[Controller] - Delete Experimento erro');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.countExperimentGroupChildren = function (id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var experimentGroupController, response, idList, experimentAmount, status;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        experimentGroupController = new experiment_group_controller_1.ExperimentGroupController();
                        return [4 /*yield*/, experimentGroupController.getOne(id)];
                    case 1:
                        response = (_c.sent()).response;
                        if (!response)
                            throw new Error('GRUPO DE EXPERIMENTO NÃO ENCONTRADO');
                        idList = (_a = response.experiment) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.id; });
                        experimentAmount = (_b = response.experiment) === null || _b === void 0 ? void 0 : _b.length;
                        status = response.status;
                        if (!response.status) {
                            status = experimentAmount === 0 ? null : 'ETIQ. NÃO INICIADA';
                        }
                        return [4 /*yield*/, experimentGroupController.update({ id: response.id, experimentAmount: experimentAmount, status: status })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, idList];
                }
            });
        });
    };
    ExperimentController.prototype.setParcelasStatus = function (idList) {
        return __awaiter(this, void 0, void 0, function () {
            var experimentGenotipeController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        experimentGenotipeController = new experiment_genotipe_controller_1.ExperimentGenotipeController();
                        return [4 /*yield*/, experimentGenotipeController.setStatus({ idList: idList, status: 'EM ETIQUETAGEM' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExperimentController.prototype.handleExperimentStatus = function (id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, allParcelas, toPrint, printed, allocated, status;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getOne(id)];
                    case 1:
                        response = (_c.sent()).response;
                        allParcelas = (_a = response === null || response === void 0 ? void 0 : response.experiment_genotipe) === null || _a === void 0 ? void 0 : _a.length;
                        toPrint = 0;
                        printed = 0;
                        allocated = 0;
                        status = '';
                        (_b = response.experiment_genotipe) === null || _b === void 0 ? void 0 : _b.map(function (parcelas) {
                            if (parcelas.status === 'IMPRESSO') {
                                printed += 1;
                            }
                            else if (parcelas.status === 'EM ETIQUETAGEM') {
                                toPrint += 1;
                            }
                            else if (parcelas.status === 'ALOCADO') {
                                allocated += 1;
                            }
                        });
                        if (toPrint > 1) {
                            status = 'ETIQ. EM ANDAMENTO';
                        }
                        if (printed === allParcelas) {
                            status = 'ETIQ. FINALIZADA';
                        }
                        if (toPrint === allParcelas) {
                            status = 'ETIQ. NÃO INICIADA';
                        }
                        if (allocated === allParcelas) {
                            status = 'TOTALMENTE ALOCADO';
                        }
                        if (allocated > 1) {
                            status = 'PARCIALMENTE ALOCADO';
                        }
                        return [4 /*yield*/, this.update({ id: id, status: status })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ExperimentController;
}());
exports.ExperimentController = ExperimentController;
