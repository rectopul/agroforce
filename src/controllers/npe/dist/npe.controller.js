"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.NpeController = void 0;
var handleOrderForeign_1 = require("../../shared/utils/handleOrderForeign");
var handleError_1 = require("../../shared/utils/handleError");
var npe_repository_1 = require("../../repository/npe.repository");
var reporte_repository_1 = require("../../repository/reporte.repository");
var group_controller_1 = require("../group.controller");
var db_1 = require("../../pages/api/db/db");
var experiment_controller_1 = require("../experiment/experiment.controller");
var NpeController = /** @class */ (function () {
    function NpeController() {
        this.npeRepository = new npe_repository_1.NpeRepository();
        this.groupController = new group_controller_1.GroupController();
        this.experimentController = new experiment_controller_1.ExperimentController();
        this.reporteRepository = new reporte_repository_1.ReporteRepository();
    }
    NpeController.prototype.getAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, orderBy, select, take, skip, objSelect_1, response, next_available_npe_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {};
                        select = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (options.filterStatus) {
                            if (options.filterStatus !== '2') {
                                if (options.filterStatus == '1') {
                                    parameters.status = JSON.parse('{ "in" : [1, 3]}');
                                }
                                else if (options.filterStatus == '4') {
                                    parameters.status = 1;
                                }
                                else {
                                    parameters.status = Number(options.filterStatus);
                                }
                            }
                        }
                        if (options.filterLocal) {
                            parameters.local = JSON.parse("{ \"name_local_culture\": { \"contains\": \"" + options.filterLocal + "\" } }");
                        }
                        if (options.filterFoco) {
                            parameters.foco = JSON.parse("{ \"name\": { \"contains\": \"" + options.filterFoco + "\" } }");
                        }
                        if (options.filterEnsaio) {
                            parameters.type_assay = JSON.parse("{ \"name\": { \"contains\": \"" + options.filterEnsaio + "\" } }");
                        }
                        if (options.filterTecnologia) {
                            parameters.tecnologia = JSON.parse("{ \"name\": {\"contains\": \"" + options.filterTecnologia + "\" } }");
                        }
                        if (options.filterCodTecnologia) {
                            parameters.tecnologia = JSON.parse("{ \"cod_tec\": {\"contains\": \"" + options.filterCodTecnologia + "\" } }");
                        }
                        if (options.filterEpoca) {
                            parameters.epoca = JSON.parse("{ \"contains\": \"" + options.filterEpoca + "\" }");
                        }
                        if (options.filterNPE) {
                            parameters.npei = Number(options.filterNPE);
                        }
                        if (options.id_safra) {
                            parameters.safraId = Number(options.id_safra);
                        }
                        if (options.safraId) {
                            parameters.safraId = Number(options.safraId);
                        }
                        if (options.filterSafra) {
                            parameters.safra = JSON.parse("{ \"safraName\": { \"contains\": \"" + options.filterSafra + "\" } }");
                        }
                        if (options.focoId) {
                            parameters.focoId = Number(options.focoId);
                        }
                        if (options.typeAssayId) {
                            parameters.typeAssayId = Number(options.typeAssayId);
                        }
                        if (options.tecnologiaId) {
                            parameters.tecnologiaId = Number(options.tecnologiaId);
                        }
                        if (options.epoca) {
                            parameters.epoca = String(options.epoca);
                        }
                        if (options.localId) {
                            parameters.localId = Number(options.localId);
                        }
                        if (options.npei) {
                            parameters.npei = Number(options.npei);
                        }
                        if (options.filterNpeFrom || options.filterNpeTo) {
                            if (options.filterNpeFrom && options.filterNpeTo) {
                                parameters.npei = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + ", \"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                            else if (options.filterNpeFrom) {
                                parameters.npei = JSON.parse("{\"gte\": " + Number(options.filterNpeFrom) + " }");
                            }
                            else if (options.filterNpeTo) {
                                parameters.npei = JSON.parse("{\"lte\": " + Number(options.filterNpeTo) + " }");
                            }
                        }
                        if (options.filterNpeFinalFrom || options.filterNpeFinalTo) {
                            if (options.filterNpeFinalFrom && options.filterNpeFinalTo) {
                                parameters.npef = JSON.parse("{\"gte\": " + Number(options.filterNpeFinalFrom) + ", \"lte\": " + Number(options.filterNpeFinalTo) + " }");
                            }
                            else if (options.filterNpeFinalFrom) {
                                parameters.npef = JSON.parse("{\"gte\": " + Number(options.filterNpeFinalFrom) + " }");
                            }
                            else if (options.filterNpeFinalTo) {
                                parameters.npef = JSON.parse("{\"lte\": " + Number(options.filterNpeFinalTo) + " }");
                            }
                        }
                        if (options.filterGrpFrom || options.filterGrpTo) {
                            if (options.filterGrpFrom && options.filterGrpTo) {
                                parameters.group = JSON.parse(" { \"some\" : {\"group\": {\"gte\": " + Number(options.filterGrpFrom) + ", \"lte\": " + Number(options.filterGrpTo) + " } , \"id_safra\": " + Number(options.id_safra) + "} }");
                            }
                            else if (options.filterGrpFrom) {
                                parameters.group = JSON.parse("{ \"some\" : {\"group\": {\"gte\": " + Number(options.filterGrpFrom) + " } , \"id_safra\": " + Number(options.id_safra) + "} }");
                            }
                            else if (options.filterGrpTo) {
                                parameters.group = JSON.parse(" { \"some\" : {\"group\": {\"lte\": " + Number(options.filterGrpTo) + " } , \"id_safra\": " + Number(options.id_safra) + "} }");
                            }
                        }
                        take = (options.take) ? Number(options.take) : undefined;
                        skip = (options.skip) ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        else {
                            orderBy = '{"prox_npe":"asc"}';
                        }
                        if (options.paramSelect) {
                            objSelect_1 = options.paramSelect.split(',');
                            Object.keys(objSelect_1).forEach(function (item) {
                                if (objSelect_1[item] === 'ensaio') {
                                    select.type_assay = true;
                                }
                                else {
                                    select[objSelect_1[item]] = true;
                                }
                            });
                            select = __assign({}, select);
                        }
                        else {
                            select = {
                                id: true,
                                safraId: true,
                                localId: true,
                                prox_npe: true,
                                local: { select: { name_local_culture: true } },
                                safra: { select: { safraName: true } },
                                foco: { select: { name: true, id: true } },
                                epoca: true,
                                tecnologia: { select: { name: true, id: true, cod_tec: true } },
                                type_assay: { select: { name: true, id: true } },
                                group: true,
                                npei: true,
                                npei_i: true,
                                npef: true,
                                status: true,
                                edited: true,
                                npeQT: true
                            };
                        }
                        return [4 /*yield*/, this.npeRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 2:
                        response = _a.sent();
                        if (response.length > 0) {
                            next_available_npe_1 = response[response.length - 1].prox_npe;
                            response.map(function (value, index, elements) { return __awaiter(_this, void 0, void 0, function () {
                                var newItem, next;
                                return __generator(this, function (_a) {
                                    newItem = value;
                                    next = elements[index + 1];
                                    if (next) {
                                        if (!newItem.npeQT) {
                                            newItem.npeQT = newItem.npef < next.npei ? next.npei - newItem.npef : next.npei_i - newItem.npef;
                                        }
                                        newItem.nextNPE = next;
                                    }
                                    else {
                                        newItem.npeQT = 'N/A';
                                        newItem.nextNPE = 0;
                                    }
                                    newItem.nextAvailableNPE = next_available_npe_1;
                                    return [2 /*return*/, newItem];
                                });
                            }); });
                        }
                        if (!response || response.total <= 0) {
                            return [2 /*return*/, {
                                    status: 400, response: [], total: 0, message: 'Nenhuma NPE cadastrada'
                                }];
                        }
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 3:
                        error_1 = _a.sent();
                        handleError_1["default"]('NPE Controller', 'GetAll', error_1.message);
                        throw new Error('[Controller] - GetAll NPE erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NpeController.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.npeRepository.findOne(id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response }];
                        }
                        return [2 /*return*/, { status: 404, response: [], message: 'Npe não existe' }];
                    case 2: return [2 /*return*/, { status: 405, response: [], message: 'Id da Npe não informado' }];
                    case 3:
                        error_2 = _a.sent();
                        handleError_1["default"]('NPE Controller', 'GetOne', error_2.message);
                        throw new Error('[Controller] - GetOne NPE erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NpeController.prototype.validateNpeiDBA = function (data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var group, safra, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        if (!data.safra) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.groupController.getAll({ id_safra: data.safra, id_foco: data.foco })];
                    case 1:
                        group = _c.sent();
                        if (!(group.response.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT npei\n                                                  FROM npe n\n                                                  WHERE n.safraId = ", "\n                                                  AND n.groupId = ", "\n                                                  AND n.npei = ", "\n                                                  AND n.status = ", "\n                                                  ORDER BY npei DESC \n                                                  LIMIT 1"], ["SELECT npei\n                                                  FROM npe n\n                                                  WHERE n.safraId = ", "\n                                                  AND n.groupId = ", "\n                                                  AND n.npei = ", "\n                                                  AND n.status = ", "\n                                                  ORDER BY npei DESC \n                                                  LIMIT 1"])), data.safra, (_a = group.response[0]) === null || _a === void 0 ? void 0 : _a.id, data.npei, 1)];
                    case 2:
                        safra = _c.sent();
                        if ((safra[0])) {
                            return [2 /*return*/, { message: "<li style=\"text-align:left\">A " + data.Column + "\u00BA coluna da " + data.Line + "\u00BA linha est\u00E1 incorreta, NPEI ja cadastrado dentro do grupo " + ((_b = group.response[0]) === null || _b === void 0 ? void 0 : _b.group) + "</li><br>", erro: 1 }];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, { message: "<li style=\"text-align:left\">A " + data.Column + "\u00BA coluna da " + data.Line + "\u00BA linha est\u00E1 incorreta, todos os focos precisam ter grupos cadastrados nessa safra</li><br>", erro: 1 }];
                    case 4: return [2 /*return*/, { erro: 0 }];
                    case 5:
                        error_3 = _c.sent();
                        handleError_1["default"]('NPE Controller', 'Validate', error_3.message);
                        throw new Error('[Controller] - Validate NPE erro');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NpeController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.npeRepository.create(data)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: 'NPE criada' }];
                        }
                        return [2 /*return*/, { status: 400, response: [], message: 'NPE não criada' }];
                    case 2:
                        error_4 = _a.sent();
                        handleError_1["default"]('NPE Controller', 'Create', error_4.message);
                        throw new Error('[Controller] - Create NPE erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NpeController.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var operation, npe, ip, npeExist, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!data) return [3 /*break*/, 5];
                        operation = data.status === 1 ? 'Ativação' : 'Inativação';
                        return [4 /*yield*/, this.npeRepository.update(data.id, data)];
                    case 1:
                        npe = _a.sent();
                        if (!npe)
                            return [2 /*return*/, { status: 400, message: 'Npe não encontrado' }];
                        if (!(data.status === 0 || data.status === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, fetch('https://api.ipify.org/?format=json').then(function (results) { return results.json(); })["catch"](function () { return '0.0.0.0'; })];
                    case 2:
                        ip = (_a.sent()).ip;
                        return [4 /*yield*/, this.reporteRepository.create({
                                madeBy: npe.created_by, module: 'Npe',
                                operation: operation,
                                name: JSON.stringify(npe.safraId), ip: JSON.stringify(ip), idOperation: npe.id
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, { status: 200, message: 'Npe atualizada' }];
                    case 5: return [4 /*yield*/, this.getOne(data.id)];
                    case 6:
                        npeExist = _a.sent();
                        if (!npeExist)
                            return [2 /*return*/, npeExist];
                        return [4 /*yield*/, this.npeRepository.update(data.id, data)];
                    case 7:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, { status: 200, response: response, message: { message: 'NPE atualizado' } }];
                        }
                        return [2 /*return*/, { status: 400, response: [], message: { message: 'NPE não foi atualizada' } }];
                    case 8:
                        error_5 = _a.sent();
                        handleError_1["default"]('NPE Controller', 'Update', error_5.message);
                        throw new Error('[Controller] - Update NPE erro');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return NpeController;
}());
exports.NpeController = NpeController;
var templateObject_1;
