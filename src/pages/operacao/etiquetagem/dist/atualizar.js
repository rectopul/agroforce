"use strict";
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
exports.getServerSideProps = void 0;
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
var react_1 = require("react");
var material_table_1 = require("material-table");
var config_1 = require("next/config");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_2 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var bi_1 = require("react-icons/bi");
var bs_1 = require("react-icons/bs");
var ri_1 = require("react-icons/ri");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var XLSX = require("xlsx");
var sweetalert2_1 = require("sweetalert2");
var io_1 = require("react-icons/io");
var components_1 = require("../../../components");
var user_preference_controller_1 = require("../../../controllers/user-preference.controller");
var services_1 = require("../../../services");
var ITabs = require("../../../shared/utils/dropdown");
function Listagem(_a) {
    var _this = this;
    var experimentGroup = _a.experimentGroup, experimentGroupId = _a.experimentGroupId, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, safraId = _a.safraId, filterBeforeEdit = _a.filterBeforeEdit;
    var tabsOperation = ITabs["default"].tabsOperation;
    var tabsEtiquetagemMenu = tabsOperation.map(function (i) {
        return i.titleTab === "ETIQUETAGEM" ? __assign(__assign({}, i), { statusTab: true }) : i;
    });
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.genotypeTreatment || {
        id: 0,
        table_preferences: "id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action"
    };
    var _b = react_2.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var _c = react_2.useState([]), experiments = _c[0], setExperiments = _c[1];
    var _d = react_2.useState(false), tableMessage = _d[0], setMessage = _d[1];
    var _e = react_2.useState(0), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = react_2.useState(1), orderList = _f[0], setOrder = _f[1];
    var _g = react_2.useState(false), afterFilter = _g[0], setAfterFilter = _g[1];
    var _h = react_2.useState(filterBeforeEdit), filtersParams = _h[0], setFiltersParams = _h[1];
    var _j = react_2.useState(filterApplication), filter = _j[0], setFilter = _j[1];
    var _k = react_2.useState(0), itemsTotal = _k[0], setTotalItems = _k[1];
    var _l = react_2.useState(function () { return [
        { name: "CamposGerenciados[]", title: "Foco", value: "foco" },
        { name: "CamposGerenciados[]", title: "Ensaio", value: "type_assay" },
        { name: "CamposGerenciados[]", title: "GLI", value: "gli" },
        {
            name: "CamposGerenciados[]",
            title: "Nome experimento",
            value: "experimentName"
        },
        { name: "CamposGerenciados[]", title: "Tecnologia", value: "tecnologia" },
        { name: "CamposGerenciados[]", title: "Época", value: "period" },
        {
            name: "CamposGerenciados[]",
            title: "Delineamento",
            value: "delineamento"
        },
        { name: "CamposGerenciados[]", title: "Rep.", value: "repetitionsNumber" },
        { name: "CamposGerenciados[]", title: "Status EXP.", value: "status" },
        { name: "CamposGerenciados[]", title: "Ações", value: "action" },
    ]; }), generatesProps = _l[0], setGeneratesProps = _l[1];
    var _m = react_2.useState(""), orderBy = _m[0], setOrderBy = _m[1];
    var _o = react_2.useState(""), orderType = _o[0], setOrderType = _o[1];
    var router = router_1.useRouter();
    var _p = react_2.useState(false), statusAccordion = _p[0], setStatusAccordion = _p[1];
    // const take: number = itensPerPage;
    var _q = react_2.useState(itensPerPage), take = _q[0], setTake = _q[1];
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _r = react_2.useState([]), selectedCheckBox = _r[0], setSelectedCheckBox = _r[1];
    function handleOrder(column, order) {
        return __awaiter(this, void 0, Promise, function () {
            var typeOrder, parametersFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (order === 1) {
                            typeOrder = "asc";
                        }
                        else if (order === 2) {
                            typeOrder = "desc";
                        }
                        else {
                            typeOrder = "";
                        }
                        setOrderBy(column);
                        setOrderType(typeOrder);
                        if (filter && typeof filter !== "undefined") {
                            if (typeOrder !== "") {
                                parametersFilter = filter + "&orderBy=" + column + "&typeOrder=" + typeOrder;
                            }
                            else {
                                parametersFilter = filter;
                            }
                        }
                        else if (typeOrder !== "") {
                            parametersFilter = "orderBy=" + column + "&typeOrder=" + typeOrder;
                        }
                        else {
                            parametersFilter = filter;
                        }
                        return [4 /*yield*/, services_1.experimentService
                                .getAll(parametersFilter + "&skip=0&take=" + take)
                                .then(function (_a) {
                                var status = _a.status, response = _a.response;
                                if (status === 200) {
                                    setExperiments(response);
                                }
                            })];
                    case 1:
                        _a.sent();
                        if (orderList === 2) {
                            setOrder(0);
                        }
                        else {
                            setOrder(orderList + 1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function headerTableFactory(name, title) {
        return {
            title: (react_1["default"].createElement("div", { className: "flex items-center" },
                react_1["default"].createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: true
        };
    }
    function tecnologiaHeaderFactory(name, title) {
        return {
            title: (react_1["default"].createElement("div", { className: "flex items-center" },
                react_1["default"].createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: "tecnologia",
            width: 0,
            sorting: true,
            render: function (rowData) {
                var _a, _b, _c, _d;
                return (react_1["default"].createElement("div", { className: "h-10 flex" },
                    react_1["default"].createElement("div", null, ((_b = (_a = rowData === null || rowData === void 0 ? void 0 : rowData.assay_list) === null || _a === void 0 ? void 0 : _a.tecnologia) === null || _b === void 0 ? void 0 : _b.cod_tec) + " " + ((_d = (_c = rowData === null || rowData === void 0 ? void 0 : rowData.assay_list) === null || _c === void 0 ? void 0 : _c.tecnologia) === null || _d === void 0 ? void 0 : _d.name))));
            }
        };
    }
    function actionTableFactory() {
        return {
            title: react_1["default"].createElement("div", { className: "flex items-center" }, "A\u00E7\u00E3o"),
            field: "action",
            sorting: false,
            width: 0,
            render: function (rowData) { return (react_1["default"].createElement("div", { className: "flex gap-2" },
                react_1["default"].createElement("div", { className: "h-10 w-10" },
                    react_1["default"].createElement(components_1.Button, { title: "Excluir " + rowData.name, type: "button", onClick: function () { return deleteItem(rowData.id); }, rounder: "rounded-full", bgColor: "bg-red-600", textColor: "white", icon: react_1["default"].createElement(bs_1.BsTrashFill, { size: 20 }) })))); }
        };
    }
    function orderColumns(columnsOrder) {
        var columnOrder = columnsOrder.split(",");
        var tableFields = [];
        Object.keys(columnOrder).forEach(function (_, index) {
            if (columnOrder[index] === "foco") {
                tableFields.push(headerTableFactory("Foco", "assay_list.foco.name"));
            }
            if (columnOrder[index] === "type_assay") {
                tableFields.push(headerTableFactory("Ensaio", "assay_list.type_assay.name"));
            }
            if (columnOrder[index] === "gli") {
                tableFields.push(headerTableFactory("GLI", "assay_list.gli"));
            }
            if (columnOrder[index] === "tecnologia") {
                tableFields.push(tecnologiaHeaderFactory("Tecnologia", "tecnologia"));
            }
            if (columnOrder[index] === "experimentName") {
                tableFields.push(headerTableFactory("Nome experimento", "experimentName"));
            }
            if (columnOrder[index] === "period") {
                tableFields.push(headerTableFactory("Época", "period"));
            }
            if (columnOrder[index] === "delineamento") {
                tableFields.push(headerTableFactory("Delineamento", "delineamento.name"));
            }
            if (columnOrder[index] === "repetitionsNumber") {
                tableFields.push(headerTableFactory("Rep.", "repetitionsNumber"));
            }
            if (columnOrder[index] === "status") {
                tableFields.push(headerTableFactory("Status EXP.", "status"));
            }
            if (columnOrder[index] === "action") {
                tableFields.push(actionTableFactory());
            }
        });
        return tableFields;
    }
    var columns = orderColumns(camposGerenciados);
    function getValuesColumns() {
        return __awaiter(this, void 0, Promise, function () {
            var els, selecionados, i, totalString, campos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        els = document.querySelectorAll("input[type='checkbox'");
                        selecionados = "";
                        for (i = 0; i < els.length; i += 1) {
                            if (els[i].checked) {
                                selecionados += els[i].value + ",";
                            }
                        }
                        totalString = selecionados.length;
                        campos = selecionados.substr(0, totalString - 1);
                        if (!(preferences.id === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, services_1.userPreferencesService
                                .create({
                                table_preferences: campos,
                                userId: userLogado.id,
                                module_id: 27
                            })
                                .then(function (response) {
                                userLogado.preferences.genotypeTreatment = {
                                    id: response.response.id,
                                    userId: preferences.userId,
                                    table_preferences: campos
                                };
                                preferences.id = response.response.id;
                            })];
                    case 1:
                        _a.sent();
                        localStorage.setItem("user", JSON.stringify(userLogado));
                        return [3 /*break*/, 4];
                    case 2:
                        userLogado.preferences.genotypeTreatment = {
                            id: preferences.id,
                            userId: preferences.userId,
                            table_preferences: campos
                        };
                        return [4 /*yield*/, services_1.userPreferencesService.update({
                                table_preferences: campos,
                                id: preferences.id
                            })];
                    case 3:
                        _a.sent();
                        localStorage.setItem("user", JSON.stringify(userLogado));
                        _a.label = 4;
                    case 4:
                        setStatusAccordion(false);
                        setCamposGerenciados(campos);
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleOnDragEnd(result) {
        var _a;
        setStatusAccordion(true);
        if (!result)
            return;
        var items = Array.from(generatesProps);
        var reorderedItem = items.splice(result.source.index, 1)[0];
        var index = Number((_a = result.destination) === null || _a === void 0 ? void 0 : _a.index);
        items.splice(index, 0, reorderedItem);
        setGeneratesProps(items);
    }
    var downloadExcel = function () { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, services_1.experimentService.getAll(filter).then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                var newItem = item;
                                newItem.SAFRA = (_b = (_a = item.assay_list) === null || _a === void 0 ? void 0 : _a.safra) === null || _b === void 0 ? void 0 : _b.safraName;
                                newItem.FOCO = (_c = item.assay_list) === null || _c === void 0 ? void 0 : _c.foco.name;
                                newItem.ENSAIO = (_d = item.assay_list) === null || _d === void 0 ? void 0 : _d.type_assay.name;
                                newItem.GLI = (_e = item.assay_list) === null || _e === void 0 ? void 0 : _e.gli;
                                newItem.NOME_DO_EXPERIMENTO = item === null || item === void 0 ? void 0 : item.experimentName;
                                newItem.TECNOLOGIA = (_f = item.assay_list) === null || _f === void 0 ? void 0 : _f.tecnologia.name;
                                newItem.ÉPOCA = item === null || item === void 0 ? void 0 : item.period;
                                newItem.DELINEAMENTO = (_g = item.delineamento) === null || _g === void 0 ? void 0 : _g.name;
                                newItem.REPETIÇÃO = (_h = item.delineamento) === null || _h === void 0 ? void 0 : _h.repeticao;
                                newItem.STATUS_ENSAIO = (_j = item.assay_list) === null || _j === void 0 ? void 0 : _j.status;
                                delete newItem.experimentGroupId;
                                delete newItem.experiment_genotipe;
                                delete newItem.countNT;
                                delete newItem.npeQT;
                                delete newItem.local;
                                delete newItem.delineamento;
                                delete newItem.eel;
                                delete newItem.clp;
                                delete newItem.nlp;
                                delete newItem.orderDraw;
                                delete newItem.comments;
                                delete newItem.period;
                                delete newItem.repetitionsNumber;
                                delete newItem.density;
                                delete newItem.status;
                                delete newItem.experimentName;
                                delete newItem.type_assay;
                                delete newItem.idSafra;
                                delete newItem.id;
                                delete newItem.assay_list;
                                return newItem;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(newData);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Experimentos");
                            // Buffer
                            XLSX.write(workBook, {
                                bookType: "xlsx",
                                type: "buffer"
                            });
                            // Binary
                            XLSX.write(workBook, {
                                bookType: "xlsx",
                                type: "binary"
                            });
                            // Download
                            XLSX.writeFile(workBook, "Experimentos.xlsx");
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    function handleTotalPages() {
        if (currentPage < 0) {
            setCurrentPage(0);
        }
        else if (currentPage >= pages) {
            setCurrentPage(pages - 1);
        }
    }
    function handlePagination() {
        return __awaiter(this, void 0, Promise, function () {
            var skip, parametersFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = currentPage * Number(take);
                        if (orderType) {
                            parametersFilter = "skip=" + skip + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + orderType;
                        }
                        else {
                            parametersFilter = "skip=" + skip + "&take=" + take;
                        }
                        if (filter) {
                            parametersFilter = parametersFilter + "&" + filter;
                        }
                        return [4 /*yield*/, services_1.experimentService
                                .getAll(parametersFilter)
                                .then(function (_a) {
                                var status = _a.status, response = _a.response, newTotal = _a.total;
                                if (status === 200) {
                                    setExperiments(response);
                                    setTotalItems(newTotal);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function updateFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "w-full h7" },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { style: { background: "#e5e7eb" }, disabled: true, required: true, id: title, name: title, value: experimentGroup[title] })));
    }
    function nameGroupFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "h7", style: { minWidth: 230 } },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { style: { background: "#e5e7eb" }, disabled: true, required: true, id: title, name: title, value: experimentGroup[title] })));
    }
    function deleteItem(id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, services_1.experimentService.update({
                            id: id,
                            experimentGroupId: null
                        })];
                    case 1:
                        _a = _b.sent(), status = _a.status, message = _a.message;
                        if (status === 200) {
                            router.reload();
                        }
                        else {
                            sweetalert2_1["default"].fire({
                                html: message,
                                width: "800"
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteMultipleItems() {
        return __awaiter(this, void 0, void 0, function () {
            var selectedCheckBoxIds;
            return __generator(this, function (_a) {
                selectedCheckBoxIds = selectedCheckBox.map(function (i) { return i.id; });
                // console.log({ selectedCheckBoxIds });
                if ((selectedCheckBox === null || selectedCheckBox === void 0 ? void 0 : selectedCheckBox.length) <= 0) {
                    return [2 /*return*/, sweetalert2_1["default"].fire("Selecione os experimentos para excluir.")];
                }
                return [2 /*return*/];
            });
        });
    }
    react_2.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(head_1["default"], null,
            react_1["default"].createElement("title", null, "Listagem de experimentos")),
        react_1["default"].createElement(components_1.Content, { contentHeader: tabsEtiquetagemMenu, moduloActive: "operacao" },
            react_1["default"].createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                react_1["default"].createElement("form", { className: "w-full bg-white shadow-md rounded p-4", onSubmit: function () { } },
                    react_1["default"].createElement("div", { className: "w-full flex justify-between items-start gap-5 mt-1" },
                        nameGroupFieldFactory("name", "Nome do grupo de exp."),
                        updateFieldFactory("experimentAmount", "Qtde. exp."),
                        updateFieldFactory("tagsToPrint", "Total etiq. a imp."),
                        updateFieldFactory("tagsPrinted", "Total etiq. imp."),
                        updateFieldFactory("totalTags", "Total etiq"),
                        updateFieldFactory("status", "Status"),
                        react_1["default"].createElement("div", { className: "h-7 w-full flex gap-3 justify-end mt-6" },
                            react_1["default"].createElement("div", { className: "w-40" },
                                react_1["default"].createElement(components_1.Button, { type: "button", value: "Voltar", bgColor: "bg-red-600", textColor: "white", icon: react_1["default"].createElement(io_1.IoMdArrowBack, { size: 18 }), onClick: function () { return router.back(); } }))))),
                react_1["default"].createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    react_1["default"].createElement(material_table_1["default"], { style: { background: "#f9fafb" }, columns: columns, data: experiments, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 0
                            },
                            rowStyle: { background: "#f9fafb", height: 35 },
                            search: false,
                            filtering: false,
                            selection: true,
                            showSelectAllCheckbox: true,
                            pageSize: Number(take)
                        }, 
                        // localization={{
                        //   body: {
                        //     emptyDataSourceMessage: tableMessage ? 'Nenhum experimento encontrado!' : 'ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS.',
                        //   },
                        // }}
                        onChangeRowsPerPage: function () { }, onSelectionChange: setSelectedCheckBox, components: {
                            Toolbar: function () { return (react_1["default"].createElement("div", { className: "w-full\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                react_1["default"].createElement("div", { className: "flex" },
                                    react_1["default"].createElement("div", { className: "h-12 w-52" },
                                        react_1["default"].createElement(components_1.Button, { title: "Adicionar Exp. ao grupo", value: "Adicionar Exp. ao grupo", textColor: "white", onClick: function () {
                                                router.push("/operacao/etiquetagem/relacionar-experimento?experimentGroupId=" + experimentGroupId);
                                            }, bgColor: "bg-blue-600" })),
                                    react_1["default"].createElement("div", { className: "h-12 w-12 ml-2" },
                                        react_1["default"].createElement(components_1.Button, { title: "Excluir grupo", type: "button", onClick: deleteMultipleItems, bgColor: "bg-red-600", textColor: "white", icon: react_1["default"].createElement(bs_1.BsTrashFill, { size: 20 }) }))),
                                react_1["default"].createElement("strong", { className: "flex text-blue-600" },
                                    "Total registrado: ",
                                    itemsTotal),
                                react_1["default"].createElement("div", { className: "h-full flex items-center gap-2\n                    " },
                                    react_1["default"].createElement("div", { className: "border-solid border-2 border-blue-600 rounded" },
                                        react_1["default"].createElement("div", { className: "w-64" },
                                            react_1["default"].createElement(components_1.AccordionFilter, { title: "Gerenciar Campos", grid: statusAccordion },
                                                react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                                    react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (react_1["default"].createElement("ul", __assign({ className: "w-full h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                        react_1["default"].createElement("div", { className: "h-8 mb-3" },
                                                            react_1["default"].createElement(components_1.Button, { value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", onClick: getValuesColumns, icon: react_1["default"].createElement(io5_1.IoReloadSharp, { size: 20 }) })),
                                                        generatesProps.map(function (generate, index) { return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (providers) {
                                                            var _a;
                                                            return (react_1["default"].createElement("li", __assign({ ref: providers.innerRef }, providers.draggableProps, providers.dragHandleProps),
                                                                react_1["default"].createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: camposGerenciados.includes(generate.value) })));
                                                        })); }),
                                                        provided.placeholder)); }))))),
                                    react_1["default"].createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                        react_1["default"].createElement(components_1.Button, { title: "Exportar planilha de tratamentos", icon: react_1["default"].createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }))))); },
                            Pagination: function (props) {
                                return (react_1["default"].createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                    Array(1)
                                        .fill("")
                                        .map(function (value, index) { return (react_1["default"].createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages })));
                            }
                        } }))))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res, query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, pageBeforeEdit, filterBeforeEdit, token, safraId, experimentGroupId, publicRuntimeConfig, baseUrlExperiments, filterApplication, param, urlParametersExperiments, requestOptions, _b, _c, allExperiments, _d, totalItems, baseUrlShow, experimentGroup;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_f = (_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.response[0]) === null || _f === void 0 ? void 0 : _f.itens_per_page)];
                case 2:
                    itensPerPage = _g.sent();
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "";
                    token = req.cookies.token;
                    safraId = req.cookies.safraId;
                    experimentGroupId = query.id;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrlExperiments = publicRuntimeConfig.apiUrl + "/experiment";
                    filterApplication = "experimentGroupId=" + experimentGroupId + "&safraId=" + safraId ||
                        "&experimentGroupId=" + experimentGroupId + "&safraId=" + safraId;
                    param = "&experimentGroupId=" + experimentGroupId + "&safraId=" + safraId;
                    urlParametersExperiments = new URL(baseUrlExperiments);
                    urlParametersExperiments.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: "GET",
                        credentials: "include",
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParametersExperiments.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _g.sent(), _c = _b.response, allExperiments = _c === void 0 ? [] : _c, _d = _b.total, totalItems = _d === void 0 ? 0 : _d;
                    baseUrlShow = publicRuntimeConfig.apiUrl + "/experiment-group";
                    return [4 /*yield*/, fetch(baseUrlShow + "/" + experimentGroupId, requestOptions).then(function (response) { return response.json(); })];
                case 4:
                    experimentGroup = _g.sent();
                    return [2 /*return*/, {
                            props: {
                                allExperiments: allExperiments,
                                experimentGroupId: experimentGroupId,
                                experimentGroup: experimentGroup,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                safraId: safraId,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit
                            }
                        }];
            }
        });
    });
};
