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
exports.LogImportController = void 0;
var handleError_1 = require("../shared/utils/handleError");
var functionsUtils_1 = require("../shared/utils/functionsUtils");
var log_import_repository_1 = require("../repository/log-import.repository");
var handleOrderForeign_1 = require("../shared/utils/handleOrderForeign");
var LogImportController = /** @class */ (function () {
    function LogImportController() {
        this.required = 'Campo obrigatório';
        this.logImportRepository = new log_import_repository_1.LogImportRepository();
    }
    LogImportController.prototype.getOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.logImportRepository.findById(Number(id))];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            return [2 /*return*/, { status: 400, response: response, message: 'Log Import não encontrado' }];
                        return [2 /*return*/, { status: 200, response: response }];
                    case 2:
                        error_1 = _a.sent();
                        handleError_1["default"]('Log Import controller', 'GetOne', error_1.message);
                        throw new Error('[Controller] - GetOne Log Import erro');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LogImportController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var LogsAlreadyExists, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.logImportRepository.validateImportInExecuting()];
                    case 1:
                        LogsAlreadyExists = _a.sent();
                        if (LogsAlreadyExists)
                            return [2 /*return*/, { status: 400, message: 'Importação já está sendo executada' }];
                        return [4 /*yield*/, this.logImportRepository.create(data)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, { status: 200, response: response, message: 'Log Import cadastrado' }];
                    case 3:
                        error_2 = _a.sent();
                        handleError_1["default"]('Log Import controller', 'Create', error_2.message);
                        throw new Error('[Controller] - Create Log Import erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LogImportController.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var logImport, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getOne(data.id)];
                    case 1:
                        logImport = _a.sent();
                        if (!logImport)
                            return [2 /*return*/, { status: 400, message: 'Log não existe' }];
                        if (logImport.response.state === 'FALHA') {
                            return [2 /*return*/, { status: 200, logImport: logImport }];
                        }
                        return [4 /*yield*/, this.logImportRepository.update(data.id, data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, message: 'Log atualizado' }];
                    case 3:
                        error_3 = _a.sent();
                        handleError_1["default"]('LogImport controller', 'Update', error_3.message);
                        throw new Error('[Controller] - Update LogImport erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LogImportController.prototype.getAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, orderBy, newStartDate, newEndDate, select, take, skip, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {};
                        parameters.AND = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (options.filterUser) {
                            parameters.user = JSON.parse("{\"name\": {\"contains\":\"" + options.filterUser + "\"} }");
                        }
                        if (options.filterTable) {
                            parameters.table = JSON.parse("{\"contains\":\"" + options.filterTable + "\"}");
                        }
                        if (options.filterState) {
                            parameters.state = JSON.parse("{\"contains\":\"" + options.filterState + "\"}");
                        }
                        if (options.filterStartDate) {
                            newStartDate = new Date(options.filterStartDate);
                            parameters.AND.push({ created_at: { gte: newStartDate } });
                        }
                        if (options.filterEndDate) {
                            newEndDate = new Date(options.filterEndDate);
                            parameters.AND.push({ created_at: { lte: newEndDate } });
                        }
                        select = {
                            id: true,
                            user: { select: { name: true } },
                            table: true,
                            state: true,
                            status: true,
                            created_at: true
                        };
                        if (options.status) {
                            parameters.status = Number(options.status);
                        }
                        take = (options.take) ? Number(options.take) : undefined;
                        skip = (options.skip) ? Number(options.skip) : undefined;
                        if (options.orderBy) {
                            orderBy = handleOrderForeign_1["default"](options.orderBy, options.typeOrder);
                            orderBy = orderBy || "{\"" + options.orderBy + "\":\"" + options.typeOrder + "\"}";
                        }
                        else {
                            orderBy = '{ "id": "desc" }';
                        }
                        return [4 /*yield*/, this.logImportRepository.findAll(parameters, select, take, skip, orderBy)];
                    case 2:
                        response = _a.sent();
                        if (!response || response.total <= 0) {
                            return [2 /*return*/, { status: 400, response: [], total: 0 }];
                        }
                        response.map(function (item) {
                            var newItem = item;
                            newItem.created_at = functionsUtils_1.functionsUtils.formatDate(item.created_at);
                            return newItem;
                        });
                        return [2 /*return*/, { status: 200, response: response, total: response.total }];
                    case 3:
                        error_4 = _a.sent();
                        handleError_1["default"]('Log Import controller', 'GetAll', error_4.message);
                        throw new Error('[Controller] - GetAll Log Import erro');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LogImportController;
}());
exports.LogImportController = LogImportController;
