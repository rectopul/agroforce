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
exports.LoteController = void 0;
var handleError_1 = require("../shared/utils/handleError");
var handleOrderForeign_1 = require("../shared/utils/handleOrderForeign");
var lote_repository_1 = require("../repository/lote.repository");
var genotipo_controller_1 = require("./genotype/genotipo.controller");
var counts_1 = require("../shared/utils/counts");
var LoteController = /** @class */ (function () {
    function LoteController() {
        this.loteRepository = new lote_repository_1.LoteRepository();
        this.genotipoController = new genotipo_controller_1.GenotipoController();
    }
    LoteController.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loteRepository.findById(id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response }];
                        }
                        return [2 /*return*/, { status: 404, response: [], message: 'Lote não encontrado' }];
                    case 2:
                        error_1 = _a.sent();
                        handleError_1["default"]('Lote Controller', 'GetOne', error_1.message);
                        throw new Error('[Controller] - GetOne Lote erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoteController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, genotype, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.loteRepository.create(data)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.genotipoController.getOne(data.id_genotipo)];
                    case 2:
                        genotype = _a.sent();
                        return [4 /*yield*/, counts_1.countLotesNumber(genotype)];
                    case 3:
                        _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: 'Lote cadastrado' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Lote não cadastrado' }];
                    case 4:
                        error_2 = _a.sent();
                        handleError_1["default"]('Lote Controller', 'Create', error_2.message);
                        throw new Error('[Controller] - Create Lote erro');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LoteController.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var lote, genotype, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.loteRepository.findById(data.id)];
                    case 1:
                        lote = _a.sent();
                        if (!lote)
                            return [2 /*return*/, { status: 404, message: 'Lote não existente' }];
                        return [4 /*yield*/, this.genotipoController.getOne(data.id_genotipo)];
                    case 2:
                        genotype = _a.sent();
                        return [4 /*yield*/, counts_1.countLotesNumber(genotype)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.loteRepository.update(data.id, data)];
                    case 4:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: 'Lote atualizado' }];
                        }
                        return [2 /*return*/, { status: 400, message: 'Lote não atualizado' }];
                    case 5:
                        error_3 = _a.sent();
                        handleError_1["default"]('Lote Controller', 'Update', error_3.message);
                        throw new Error('[Controller] - Update Lote erro');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoteController.prototype.getAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, orderBy, gmrMax, select, take, skip, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {};
                        orderBy = '';
                        parameters.AND = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (options.filterYearFrom || options.filterYearTo) {
                            if (options.filterYearFrom && options.filterYearTo) {
                                parameters.year = JSON.parse("{\"gte\": " + Number(options.filterYearFrom) + ", \"lte\": " + Number(options.filterYearTo) + " }");
                            }
                            else if (options.filterYearFrom) {
                                parameters.year = JSON.parse("{\"gte\": " + Number(options.filterYearFrom) + " }");
                            }
                            else if (options.filterYearTo) {
                                parameters.year = JSON.parse("{\"lte\": " + Number(options.filterYearTo) + " }");
                            }
                        }
                        if (options.filterSeedFrom || options.filterSeedTo) {
                            if (options.filterSeedFrom && options.filterSeedTo) {
                                parameters.quant_sementes = JSON.parse("{\"gte\": " + Number(options.filterSeedFrom) + ", \"lte\": " + Number(options.filterSeedTo) + " }");
                            }
                            else if (options.filterSeedFrom) {
                                parameters.quant_sementes = JSON.parse("{\"gte\": " + Number(options.filterSeedFrom) + " }");
                            }
                            else if (options.filterSeedTo) {
                                parameters.quant_sementes = JSON.parse("{\"lte\": " + Number(options.filterSeedTo) + " }");
                            }
                        }
                        if (options.filterWeightFrom || options.filterWeightTo) {
                            if (options.filterWeightFrom && options.filterWeightTo) {
                                parameters.peso = JSON.parse("{\"gte\": \"" + Number(options.filterWeightFrom) + "\", \"lte\": \"" + Number(options.filterWeightTo) + "\" }");
                            }
                            else if (options.filterWeightFrom) {
                                parameters.peso = JSON.parse("{\"gte\": \"" + Number(options.filterWeightFrom) + "\" }");
                            }
                            else if (options.filterWeightTo) {
                                parameters.peso = JSON.parse("{\"lte\": \"" + Number(options.filterWeightTo) + "\" }");
                            }
                        }
                        if (options.filterGmrFrom || options.filterGmrTo) {
                            if (options.filterGmrFrom && options.filterGmrTo) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"gmr\": {\"gte\": \"" + Number(options.filterGmrFrom) + "\", \"lte\": \"" + Number(options.filterGmrTo) + "\" }}}"));
                            }
                            else if (options.filterGmrFrom) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"gmr\": {\"gte\": \"" + Number(options.filterGmrFrom) + "\" }}}"));
                            }
                            else if (options.filterGmrTo) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"gmr\": {\"lte\": \"" + Number(options.filterGmrTo) + "\" }}}"));
                            }
                        }
                        if (options.filterBgmFrom || options.filterBgmTo) {
                            if (options.filterBgmFrom && options.filterBgmTo) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"bgm\": {\"gte\": \"" + Number(options.filterBgmFrom) + "\", \"lte\": \"" + Number(options.filterBgmTo) + "\" }}}"));
                            }
                            else if (options.filterBgmFrom) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"bgm\": {\"gte\": \"" + Number(options.filterBgmFrom) + "\" }}}"));
                            }
                            else if (options.filterBgmTo) {
                                parameters.AND.push(JSON.parse("{ \"genotipo\": {\"bgm\": {\"lte\": \"" + Number(options.filterBgmTo) + "\" }}}"));
                            }
                        }
                        if (options.filterYear) {
                            parameters.year = Number(options.filterYear);
                        }
                        if (options.filterCodLote) {
                            parameters.cod_lote = JSON.parse("{ \"contains\":\"" + options.filterCodLote + "\" }");
                        }
                        if (options.filterNcc) {
                            console.log("nccc   ", options.filterNcc);
                            parameters.ncc = Number(options.filterNcc);
                        }
                        if (options.filterPeso) {
                            parameters.peso = Number(options.filterPeso);
                        }
                        if (options.filterFase) {
                            parameters.fase = JSON.parse("{ \"contains\":\"" + options.filterFase + "\" }");
                        }
                        if (options.filterSeeds) {
                            parameters.quant_sementes = Number(options.filterSeeds);
                        }
                        if (options.filterGenotipo) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": {\"name_genotipo\": {\"contains\": \"" + options.filterGenotipo + "\" } } }"));
                        }
                        if (options.filterMainName) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": { \"name_main\": {\"contains\": \"" + options.filterMainName + "\" } } }"));
                        }
                        if (options.filterGmr) {
                            gmrMax = Number(options.filterGmr) + 1;
                            parameters.AND.push(JSON.parse("{ \"genotipo\": { \"gmr\": {\"gte\": \"" + Number(options.filterGmr).toFixed(1) + "\", \"lt\": \"" + gmrMax.toFixed(1) + "\" } } }"));
                        }
                        if (options.filterBgm) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": { \"bgm\":  " + Number(options.filterBgm) + "  } }"));
                        }
                        if (options.filterTecnologiaCod) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": { \"tecnologia\": { \"cod_tec\": {\"contains\": \"" + options.filterTecnologiaCod + "\" } } } }"));
                        }
                        if (options.filterTecnologiaDesc) {
                            parameters.AND.push(JSON.parse("{ \"genotipo\": { \"tecnologia\": { \"desc\": {\"contains\": \"" + options.filterTecnologiaDesc + "\" } } } }"));
                        }
                        select = {
                            id: true,
                            id_genotipo: true,
                            id_s2: true,
                            id_dados: true,
                            year: true,
                            cod_lote: true,
                            ncc: true,
                            fase: true,
                            peso: true,
                            safra: true,
                            quant_sementes: true,
                            genotipo: {
                                select: {
                                    id: true,
                                    name_genotipo: true,
                                    name_main: true,
                                    gmr: true,
                                    bgm: true,
                                    tecnologia: {
                                        select: {
                                            name: true,
                                            cod_tec: true
                                        }
                                    }
                                }
                            }
                        };
                        if (options.genotipo) {
                            parameters.genotipo = options.genotipo;
                        }
                        if (options.id_safra) {
                            parameters.id_safra = Number(options.id_safra);
                        }
                        if (options.name) {
                            parameters.name = options.name;
                        }
                        if (options.cod_lote) {
                            parameters.cod_lote = options.cod_lote;
                        }
                        if (options.id_genotipo) {
                            parameters.id_genotipo = Number(options.id_genotipo);
                        }
                        if (options.id_dados) {
                            parameters.id_dados = Number(options.id_dados);
                        }
                        if (options.ncc) {
                            parameters.ncc = Number(options.ncc);
                        }
                        take = (options.take) ? Number(options.take) : undefined;
                        skip = (options.skip) ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        console.log("paramter   ", parameters);
                        return [4 /*yield*/, this.loteRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 2:
                        response = _a.sent();
                        if (!response || response.total <= 0) {
                            return [2 /*return*/, { status: 400, response: [], total: 0 }];
                        }
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 3:
                        error_4 = _a.sent();
                        handleError_1["default"]('Lote Controller', 'GetAll', error_4.message);
                        throw new Error('[Controller] - GetAll Lote erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LoteController;
}());
exports.LoteController = LoteController;
