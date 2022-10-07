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
exports.GenotypeTreatmentController = void 0;
var handleOrderForeign_1 = require("../../shared/utils/handleOrderForeign");
var handleError_1 = require("../../shared/utils/handleError");
var genotype_treatment_repository_1 = require("../../repository/genotype-treatment/genotype-treatment.repository");
var counts_1 = require("../../shared/utils/counts");
var GenotypeTreatmentController = /** @class */ (function () {
    function GenotypeTreatmentController() {
        this.genotypeTreatmentRepository = new genotype_treatment_repository_1.GenotypeTreatmentRepository();
    }
    GenotypeTreatmentController.prototype.getAll = function (options) {
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
                        if (options.filterStatus) {
                            parameters.OR = [];
                            statusParams = options.filterStatus.split(',');
                            parameters.OR.push(JSON.parse("{ \"assay_list\": {\"status\": {\"equals\": \"" + statusParams[0] + "\" } } }"));
                            parameters.OR.push(JSON.parse("{ \"assay_list\": {\"status\": {\"equals\": \"" + statusParams[1] + "\" } } }"));
                        }
                        if (options.filterBgmFrom || options.filterBgmTo) {
                            if (options.filterBgmFrom && options.filterBgmTo) {
                                parameters.AND.push(JSON.parse("{ \"assay_list\": {\"bgm\": {\"gte\": " + Number(options.filterBgmFrom) + ", \"lte\": " + Number(options.filterBgmTo) + " } } }"));
                            }
                            else if (options.filterBgmFrom) {
                                parameters.AND.push(JSON.parse("{ \"assay_list\": {\"bgm\": {\"gte\": " + Number(options.filterBgmFrom) + " } } }"));
                            }
                            else if (options.filterBgmTo) {
                                parameters.AND.push(JSON.parse("{ \"assay_list\": {\"bgm\": {\"lte\": " + Number(options.filterBgmTo) + " } } }"));
                            }
                        }
                        if (options.filterNtFrom || options.filterNtTo) {
                            if (options.filterNtFrom && options.filterNtTo) {
                                parameters.treatments_number = JSON.parse("{\"gte\": " + Number(options.filterNtFrom) + ", \"lte\": " + Number(options.filterNtTo) + " }");
                            }
                            else if (options.filterNtFrom) {
                                parameters.treatments_number = JSON.parse("{\"gte\": " + Number(options.filterNtFrom) + " }");
                            }
                            else if (options.filterNtTo) {
                                parameters.treatments_number = JSON.parse("{\"lte\": " + Number(options.filterNtTo) + " }");
                            }
                        }
                        if (options.filterStatusT) {
                            parameters.status = JSON.parse("{ \"contains\":\"" + options.filterStatusT + "\" }");
                        }
                        if (options.filterNca) {
                            parameters.AND.push(JSON.parse("{ \"lote\": {\"ncc\": \"" + options.filterNca + "\" } } "));
                        }
                        if (options.filterTreatmentsNumber) {
                            parameters.treatments_number = Number(options.filterTreatmentsNumber);
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
                        if (options.filterTechnology) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"tecnologia\": { \"name\":  {\"contains\": \"" + options.filterTechnology + "\" } } } }"));
                        }
                        if (options.filterCodTec) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"tecnologia\": { \"cod_tec\":  {\"contains\": \"" + options.filterCodTec + "\" } } } }"));
                        }
                        if (options.filterBgm) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"bgm\":  " + Number(options.filterBgm) + "  } }"));
                        }
                        if (options.filterStatusAssay) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"status\": {\"contains\": \"" + options.filterStatusAssay + "\" } } }"));
                        }
                        if (options.filterGenotypeName) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": {\"name_genotipo\":  {\"contains\": \"" + options.filterGenotypeName + "\" }  } }"));
                        }
                        if (options.filterStatusAssay) {
                            parameters.AND.push(JSON.parse("{ \"assay_list\": {\"status\": {\"contains\": \"" + options.filterStatusAssay + "\" } } }"));
                        }
                        if (options.status_experiment) {
                            parameters.status_experiment = JSON.parse("{\"contains\": \"" + options.status_experiment + "\" }");
                        }
                        select = {
                            id: true,
                            id_lote: true,
                            id_genotipo: true,
                            safra: {
                                select: {
                                    id: true,
                                    safraName: true
                                }
                            },
                            genotipo: {
                                select: {
                                    id: true,
                                    name_genotipo: true,
                                    gmr: true,
                                    bgm: true,
                                    tecnologia: {
                                        select: {
                                            cod_tec: true,
                                            name: true
                                        }
                                    }
                                }
                            },
                            treatments_number: true,
                            status: true,
                            status_experiment: true,
                            lote: {
                                select: {
                                    ncc: true,
                                    cod_lote: true,
                                    fase: true
                                }
                            },
                            assay_list: {
                                select: {
                                    foco: { select: { id: true, name: true } },
                                    experiment: { select: { id: true, experimentName: true } },
                                    type_assay: { select: { id: true, name: true } },
                                    tecnologia: { select: { id: true, name: true, cod_tec: true } },
                                    gli: true,
                                    bgm: true,
                                    status: true
                                }
                            },
                            comments: true
                        };
                        if (options.id_safra) {
                            parameters.id_safra = Number(options.id_safra);
                        }
                        if (options.id_assay_list) {
                            parameters.id_assay_list = Number(options.id_assay_list);
                        }
                        if (options.treatments_number) {
                            parameters.treatments_number = Number(options.treatments_number);
                        }
                        if (options.gli) {
                            parameters.assay_list = (JSON.parse("{\"gli\": {\"contains\": \"" + options.gli + "\" } }"));
                        }
                        if (options.name_genotipo) {
                            parameters.genotipo = (JSON.parse("{\"name_genotipo\": {\"contains\": \"" + options.name_genotipo + "\" } }"));
                        }
                        if (options.nca) {
                            parameters.lote = (JSON.parse("{\"ncc\": " + Number(options.nca) + " }"));
                        }
                        if (options.status) {
                            parameters.status = options.status;
                        }
                        take = (options.take) ? Number(options.take) : undefined;
                        skip = (options.skip) ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        return [4 /*yield*/, this.genotypeTreatmentRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 2:
                        response = _a.sent();
                        if (!response || response.total <= 0) {
                            return [2 /*return*/, { status: 400, response: [], total: 0 }];
                        }
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 3:
                        error_1 = _a.sent();
                        handleError_1["default"]('Tratamentos do genótipo controller', 'GetAll', error_1.message);
                        throw new Error('[Controller] - GetAll Tratamentos do genótipo erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GenotypeTreatmentController.prototype.getOne = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.genotypeTreatmentRepository.findById(id)];
                    case 1:
                        response = _b.sent();
                        if (!response)
                            throw new Error('Tratamentos do genótipo não encontrada');
                        return [2 /*return*/, { status: 200, response: response }];
                    case 2:
                        error_2 = _b.sent();
                        handleError_1["default"]('Tratamentos do genótipo controller', 'getOne', error_2.message);
                        throw new Error('[Controller] - getOne Tratamentos do genótipo erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // async create(data: any) {
    //   try {
    //     console.log("herere   ");
    //     return false
    //     await this.genotypeTreatmentRepository.create(data);
    //     await countTreatmentsNumber(data.id_assay_list);
    //     return { status: 200, message: 'Tratamentos do genótipo cadastrada' };
    //   } catch (error: any) {
    //     handleError('Tratamentos do genótipo controller', 'Create', error.message);
    //     throw new Error('[Controller] - Create Tratamentos do genótipo erro');
    //   }
    // }
    GenotypeTreatmentController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // console.log("herere   ",data);
                        // return false
                        return [4 /*yield*/, this.genotypeTreatmentRepository.create(data)];
                    case 1:
                        // console.log("herere   ",data);
                        // return false
                        _a.sent();
                        return [4 /*yield*/, counts_1.countTreatmentsNumber(data.id_assay_list)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, message: 'Tratamentos do genótipo cadastrada' }];
                    case 3:
                        error_3 = _a.sent();
                        handleError_1["default"]('Tratamentos do genótipo controller', 'Create', error_3.message);
                        throw new Error('[Controller] - Create Tratamentos do genótipo erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GenotypeTreatmentController.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.genotypeTreatmentRepository.findById(data.id)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            return [2 /*return*/, { status: 404, response: response, message: 'Tratamentos do genótipo não existente' }];
                        return [4 /*yield*/, this.genotypeTreatmentRepository.update(data.id, data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, message: 'Tratamentos do genótipo atualizado' }];
                    case 3:
                        error_4 = _a.sent();
                        handleError_1["default"]('Tratamentos do genótipo controller', 'Update', error_4.message);
                        throw new Error('[Controller] - Update Tratamentos do genótipo erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GenotypeTreatmentController.prototype.deleteAll = function (idAssayList) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.genotypeTreatmentRepository.deleteAll(Number(idAssayList))];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, message: 'Tratamentos do genótipo excluídos' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Tratamentos do genótipo não excluídos' }];
                    case 2:
                        error_5 = _a.sent();
                        handleError_1["default"]('Tratamentos do genótipo controller', 'DeleteAll', error_5.message);
                        throw new Error('[Controller] - DeleteAll Tratamentos do genótipo erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GenotypeTreatmentController;
}());
exports.GenotypeTreatmentController = GenotypeTreatmentController;
