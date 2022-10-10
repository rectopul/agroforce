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
exports.ExperimentGenotipeController = void 0;
var experiment_genotipe_repository_1 = require("src/repository/experiment-genotipe.repository");
var handleError_1 = require("../shared/utils/handleError");
var experiment_group_controller_1 = require("./experiment-group/experiment-group.controller");
var experiment_controller_1 = require("./experiment/experiment.controller");
var print_history_controller_1 = require("./print-history/print-history.controller");
var handleOrderForeign_1 = require("../shared/utils/handleOrderForeign");
var ExperimentGenotipeController = /** @class */ (function () {
    function ExperimentGenotipeController() {
        this.ExperimentGenotipeRepository = new experiment_genotipe_repository_1.ExperimentGenotipeRepository();
        this.experimentController = new experiment_controller_1.ExperimentController();
        this.experimentGroupController = new experiment_group_controller_1.ExperimentGroupController();
        this.printedHistoryController = new print_history_controller_1.PrintHistoryController();
    }
    ExperimentGenotipeController.prototype.getAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, orderBy, statusParams, select, idList, take, skip, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {};
                        parameters.AND = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (options.filterFoco) {
                            parameters.foco = JSON.parse("{ \"name\": { \"contains\": \"" + options.filterFoco + "\" } }");
                        }
                        if (options.filterTypeAssay) {
                            parameters.type_assay = JSON.parse("{ \"name\": { \"contains\": \"" + options.filterTypeAssay + "\" } }");
                        }
                        // if (options.filterGli) {
                        //   parameters.assayList = JSON.parse(
                        //     `{ "name": { "contains": "${options.filterGli}" } }`,
                        //   );
                        // }
                        if (options.filterNameTec) {
                            parameters.tecnologia = JSON.parse("{ \"name\": { \"contains\": \"" + options.filterNameTec + "\" } }");
                        }
                        if (options.filterCodTec) {
                            parameters.AND.push(JSON.parse("{ \"tecnologia\": {\"cod_tec\": {\"contains\": \"" + options.filterCodTec + "\" } } }"));
                        }
                        if (options.filterTechnology) {
                            parameters.AND.push(JSON.parse("{ \"tecnologia\": {\"name\": \"" + options.filterTechnology + "\" } }"));
                        }
                        if (options.filterExperimentName) {
                            parameters.AND.push(JSON.parse("{ \"experiment\": {\"experimentName\": {\"contains\": \"" + options.filterExperimentName + "\" } } }"));
                        }
                        if (options.filterPlacingPlace) {
                            parameters.AND.push(JSON.parse("{ \"experiment\": { \"local\": {\"name_local_culture\": {\"contains\": \"" + options.filterPlacingPlace + "\" } } } }"));
                        }
                        if (options.filterGli) {
                            parameters.AND.push(JSON.parse("{ \"experiment\": { \"assay_list\": {\"gli\": {\"contains\": \"" + options.filterGli + "\" } } } }"));
                        }
                        if (options.filterStatus) {
                            parameters.OR = [];
                            statusParams = options.filterStatus.split(',');
                            parameters.OR.push(JSON.parse("{ \"experiment\": {\"status\": {\"contains\": \"" + statusParams[0] + "\" } } }"));
                            parameters.OR.push(JSON.parse("{ \"experiment\": {\"status\": {\"contains\": \"" + statusParams[1] + "\" } } }"));
                        }
                        if (options.ensaio) {
                            parameters.AND.push(JSON.parse("{ \"type_assay\": {\"name\": {\"contains\": \"" + options.ensaio + "\" } } }"));
                        }
                        if (options.filterLocal) {
                            parameters.experiment = JSON.parse("{ \"local\": { \"name_local_culture\": { \"contains\": \"" + options.filterLocal + "\" } } }");
                        }
                        if (options.filterGenotypeName) {
                            parameters.name_genotipo = JSON.parse("{ \"contains\": \"" + options.filterGenotypeName + "\" }");
                        }
                        if (options.filterNca) {
                            parameters.nca = JSON.parse("{ \"contains\": \"" + options.filterNca + "\" }");
                        }
                        if (options.filterRepetitionFrom || options.filterRepetitionTo) {
                            if (options.filterRepetitionFrom && options.filterRepetitionTo) {
                                parameters.rep = JSON.parse("{\"gte\": " + Number(options.filterRepetitionFrom) + ", \"lte\": " + Number(options.filterRepetitionTo) + " }");
                            }
                            else if (options.filterRepetitionFrom) {
                                parameters.rep = JSON.parse("{\"gte\": " + Number(options.filterRepetitionFrom) + " }");
                            }
                            else if (options.filterRepetitionTo) {
                                parameters.rep = JSON.parse("{\"lte\": " + Number(options.filterRepetitionTo) + " }");
                            }
                        }
                        if (options.filterNpeFrom || options.filterNpeTo) {
                            if (options.filterNpeFrom && options.filterNpeTo) {
                                parameters.npe = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + ", \"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                            else if (options.filterNpeFrom) {
                                parameters.npe = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + " }");
                            }
                            else if (options.filterNpeTo) {
                                parameters.npe = JSON.parse("{\"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                        }
                        if (options.filterNtFrom || options.filterNtTo) {
                            if (options.filterNtFrom && options.filterNtTo) {
                                parameters.nt = JSON.parse("{\"gte\": " + Number(options.filterNtFrom) + ", \"lte\": " + Number(options.filterNtTo) + " }");
                            }
                            else if (options.filterNtFrom) {
                                parameters.nt = JSON.parse("{\"gte\": " + Number(options.filterNtFrom) + " }");
                            }
                            else if (options.filterNtTo) {
                                parameters.nt = JSON.parse("{\"lte\": " + Number(options.filterNtTo) + " }");
                            }
                        }
                        if (options.filterRepFrom || options.filterRepTo) {
                            if (options.filterRepFrom && options.filterRepTo) {
                                parameters.rep = JSON.parse("{\"gte\": " + Number(options.filterRepFrom) + ", \"lte\": " + Number(options.filterRepTo) + " }");
                            }
                            else if (options.filterRepFrom) {
                                parameters.rep = JSON.parse("{\"gte\": " + Number(options.filterRepFrom) + " }");
                            }
                            else if (options.filterRepTo) {
                                parameters.rep = JSON.parse("{\"lte\": " + Number(options.filterRepTo) + " }");
                            }
                        }
                        if (options.filterNpeFrom || options.filterNpeTo) {
                            if (options.filterNpeFrom && options.filterNpeTo) {
                                parameters.npe = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + ", \"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                            else if (options.filterNpeFrom) {
                                parameters.npe = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + " }");
                            }
                            else if (options.filterNpeTo) {
                                parameters.npe = JSON.parse("{\"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                        }
                        select = {
                            id: true,
                            safra: { select: { safraName: true } },
                            foco: { select: { name: true } },
                            type_assay: { select: { name: true, envelope: true } },
                            tecnologia: { select: { name: true, cod_tec: true } },
                            gli: true,
                            status: true,
                            experiment: {
                                select: {
                                    experimentName: true,
                                    status: true,
                                    delineamento: true,
                                    local: {
                                        select: { name_local_culture: true }
                                    },
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
                                    }
                                }
                            },
                            idGenotipo: true,
                            rep: true,
                            nt: true,
                            npe: true,
                            genotipo: {
                                select: {
                                    name_genotipo: true,
                                    lote: {
                                        select: {
                                            fase: true
                                        }
                                    }
                                }
                            },
                            nca: true,
                            lote: true,
                            status_t: true,
                            sequencia_delineamento: true
                        };
                        if (!options.experimentGroupId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.generateIdList(Number(options.experimentGroupId))];
                    case 2:
                        idList = _a.sent();
                        if ((idList === null || idList === void 0 ? void 0 : idList.length) > 1) {
                            parameters.idExperiment = {};
                            parameters.idExperiment["in"] = idList;
                        }
                        else {
                            parameters.idExperiment = Number(idList);
                        }
                        _a.label = 3;
                    case 3:
                        if (options.idExperiment) {
                            parameters.idExperiment = Number(options.idExperiment);
                        }
                        if (options.safraName) {
                            parameters.AND.push(JSON.parse("{ \"safra\": {\"safraName\": {\"contains\": \"" + options.safraName + "\" } } }"));
                        }
                        if (options.id_safra) {
                            parameters.idSafra = Number(options.id_safra);
                        }
                        if (options.idFoco) {
                            parameters.idFoco = Number(options.idFoco);
                        }
                        if (options.idTypeAssay) {
                            parameters.idTypeAssay = Number(options.idTypeAssay);
                        }
                        if (options.idTecnologia) {
                            parameters.idTecnologia = Number(options.idTecnologia);
                        }
                        if (options.nt) {
                            parameters.nt = Number(options.nt);
                        }
                        if (options.gli) {
                            parameters.gli = options.gli;
                        }
                        if (options.npe) {
                            parameters.npe = Number(options.npe);
                        }
                        if (options.idExperiment) {
                            parameters.idExperiment = Number(options.idExperiment);
                        }
                        if (options.idGenotipo) {
                            parameters.idGenotipo = Number(options.idGenotipo);
                        }
                        if (options.idLote) {
                            parameters.idLote = Number(options.idLote);
                        }
                        take = options.take ? Number(options.take) : undefined;
                        skip = options.skip ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 4:
                        response = _a.sent();
                        if (!response || response.total <= 0) {
                            return [2 /*return*/, { status: 400, response: [], total: 0 }];
                        }
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 5:
                        error_1 = _a.sent();
                        handleError_1["default"]('Parcelas controller', 'GetAll', error_1.message);
                        throw new Error('[Controller] - GetAll Parcelas erro');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.createMany(data)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, message: 'Tratamento experimental registrado' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Parcelas não registrado' }];
                    case 2:
                        error_2 = _a.sent();
                        handleError_1["default"]('Parcelas do controlador', 'Create', error_2.message);
                        throw new Error('[Controller] - Erro ao criar esboço de Parcelas');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.findById(id)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            throw new Error('Parcela não encontrada');
                        return [2 /*return*/, { status: 200, response: response }];
                    case 2:
                        error_3 = _a.sent();
                        handleError_1["default"]('Parcela controller', 'getOne', error_3.message);
                        throw new Error('[Controller] - getOne Parcela erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.update = function (_a) {
        var idList = _a.idList, status = _a.status, userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var parcelas, response, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.printed(idList, status)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getOne(idList[0])];
                    case 2:
                        parcelas = (_b.sent()).response;
                        return [4 /*yield*/, this.experimentController.getOne(parcelas === null || parcelas === void 0 ? void 0 : parcelas.idExperiment)];
                    case 3:
                        response = (_b.sent()).response;
                        return [4 /*yield*/, this.experimentGroupController.countEtiqueta(response.experimentGroupId, parcelas === null || parcelas === void 0 ? void 0 : parcelas.idExperiment)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.printedHistoryController.create({ idList: idList, userId: userId })];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _b.sent();
                        handleError_1["default"]('Parcelas controller', 'Update', error_4.message);
                        throw new Error('[Controller] - Update Parcelas erro');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.relateLayout = function (_a) {
        var id = _a.id, blockLayoutId = _a.blockLayoutId, status = _a.status;
        return __awaiter(this, void 0, void 0, function () {
            var parcela, response, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getOne(Number(id))];
                    case 1:
                        parcela = _b.sent();
                        if (!parcela)
                            return [2 /*return*/, { status: 400, message: 'parcela não existente' }];
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.update(id, {
                                blockLayoutId: blockLayoutId,
                                status: status
                            })];
                    case 2:
                        response = _b.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: 'parcela atualizada' }];
                        }
                        return [2 /*return*/, { status: 400, response: response, message: 'parcela não atualizada' }];
                    case 3:
                        error_5 = _b.sent();
                        handleError_1["default"]('Parcelas controller', 'Relacionar layout', error_5.message);
                        throw new Error('[Controller] - Relacionar layout Parcelas erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.generateIdList = function (id) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var experimentGroupController, response, idList, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        experimentGroupController = new experiment_group_controller_1.ExperimentGroupController();
                        return [4 /*yield*/, experimentGroupController.getOne(id)];
                    case 1:
                        response = (_b.sent()).response;
                        idList = (_a = response.experiment) === null || _a === void 0 ? void 0 : _a.map(function (item) { return Number(item.id); });
                        return [2 /*return*/, idList];
                    case 2:
                        error_6 = _b.sent();
                        handleError_1["default"]('Parcelas controller', 'generateIdList', error_6.message);
                        throw new Error('[Controller] - generateIdList Parcelas erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.setStatus = function (_a) {
        var idExperiment = _a.idList, status = _a.status;
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.updateStatus(idExperiment, status)];
                    case 1:
                        _b.sent();
                        idExperiment.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.experimentController.getOne(id)];
                                    case 1:
                                        response = (_a.sent()).response;
                                        return [4 /*yield*/, this.experimentGroupController.countEtiqueta(response.experimentGroupId, idExperiment)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        handleError_1["default"]('Parcelas controller', 'setStatus', error_7.message);
                        throw new Error('[Controller] - setStatus Parcelas erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExperimentGenotipeController.prototype.updateData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, check, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.findById(data.id)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            return [2 /*return*/, {
                                    status: 404,
                                    response: response,
                                    message: 'Tratamentos do genótipo não existente'
                                }];
                        }
                        return [4 /*yield*/, this.ExperimentGenotipeRepository.update(data.id, data)];
                    case 2:
                        check = _a.sent();
                        return [2 /*return*/, { status: 200, message: 'experimento do genótipo atualizado' }];
                    case 3:
                        error_8 = _a.sent();
                        handleError_1["default"]('Tratamento do experimento do controlador', 'Create', error_8.message);
                        throw new Error('[Controller] - Erro ao criar esboço de tratamento do experimento');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ExperimentGenotipeController;
}());
exports.ExperimentGenotipeController = ExperimentGenotipeController;
