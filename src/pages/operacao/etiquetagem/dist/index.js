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
var cookies_next_1 = require("cookies-next");
var formik_1 = require("formik");
var material_table_1 = require("material-table");
var config_1 = require("next/config");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var bi_1 = require("react-icons/bi");
var bs_1 = require("react-icons/bs");
var ri_1 = require("react-icons/ri");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var XLSX = require("xlsx");
var sweetalert2_1 = require("sweetalert2");
var ai_1 = require("react-icons/ai");
var components_1 = require("../../../components");
var user_preference_controller_1 = require("../../../controllers/user-preference.controller");
var services_1 = require("../../../services");
var ITabs = require("../../../shared/utils/dropdown");
var helpers_1 = require("../../../helpers");
function Listagem(_a) {
    var _this = this;
    var allExperimentGroup = _a.allExperimentGroup, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, safraId = _a.safraId, filterApplication = _a.filterApplication, pageBeforeEdit = _a.pageBeforeEdit, filterBeforeEdit = _a.filterBeforeEdit, cultureId = _a.cultureId, typeOrderServer = _a.typeOrderServer, orderByserver = _a.orderByserver;
    var tabsOperation = ITabs["default"].tabsOperation;
    var tabsEtiquetagemMenu = tabsOperation.map(function (i) { return (i.titleTab === 'ETIQUETAGEM'
        ? __assign(__assign({}, i), { statusTab: true }) : __assign(__assign({}, i), { statubsTab: false })); });
    var userLogado = JSON.parse(localStorage.getItem('user'));
    var preferences = userLogado.preferences.etiquetagem || {
        id: 0,
        table_preferences: 'id,name,experimentAmount,tagsToPrint,tagsPrinted,totalTags,status,action'
    };
    var tableRef = react_1.useRef(null);
    var _b = react_1.useState(false), isOpenModal = _b[0], setIsOpenModal = _b[1];
    var _c = react_1.useState(preferences.table_preferences), camposGerenciados = _c[0], setCamposGerenciados = _c[1];
    var _d = react_1.useState(function () { return allExperimentGroup; }), experimentGroup = _d[0], setExperimentGroup = _d[1];
    var _e = react_1.useState(pageBeforeEdit), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = react_1.useState(1), orderList = _f[0], setOrder = _f[1];
    var _g = react_1.useState(filterBeforeEdit), filtersParams = _g[0], setFiltersParams = _g[1];
    var _h = react_1.useState(filterApplication), filter = _h[0], setFilter = _h[1];
    var _j = react_1.useState(totalItems), itemsTotal = _j[0], setTotalItems = _j[1];
    var _k = react_1.useState(function () { return [
        {
            name: 'CamposGerenciados[]',
            title: 'Nome do grupo de exp.',
            value: 'name',
            defaultChecked: function () { return camposGerenciados.includes('name'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Qtde. exp.',
            value: 'experimentAmount',
            defaultChecked: function () { return camposGerenciados.includes('experimentAmount'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Etiq. a imprimir',
            value: 'tagsToPrint',
            defaultChecked: function () { return camposGerenciados.includes('tagsToPrint'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Etiq. impressas',
            value: 'tagsPrinted',
            defaultChecked: function () { return camposGerenciados.includes('tagsPrinted'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Total etiquetas',
            value: 'totalTags',
            defaultChecked: function () { return camposGerenciados.includes('totalTags'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Status grupo exp.',
            value: 'status',
            defaultChecked: function () { return camposGerenciados.includes('status'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Ação',
            value: 'action',
            defaultChecked: function () { return camposGerenciados.includes('action'); }
        },
    ]; }), generatesProps = _k[0], setGeneratesProps = _k[1];
    var _l = react_1.useState(function () { return [
        {
            name: 'StatusCheckbox',
            title: 'ETIQ. NÃO INICIADA',
            value: 'ETIQ. NÃO INICIADA',
            defaultChecked: function () { return camposGerenciados.includes('ETIQ. NÃO INICIADA'); }
        },
        {
            name: 'StatusCheckbox',
            title: 'ETIQ. EM ANDAMENTO',
            value: 'ETIQ. EM ANDAMENTO',
            defaultChecked: function () { return camposGerenciados.includes('ETIQ. EM ANDAMENTO'); }
        },
        {
            name: 'StatusCheckbox',
            title: 'ETIQ. FINALIZADA',
            value: 'ETIQ. FINALIZADA',
            defaultChecked: function () { return camposGerenciados.includes('ETIQ. FINALIZADA'); }
        },
    ]; }), statusFilter = _l[0], setStatusFilter = _l[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _m = react_1.useState(''), orderType = _m[0], setOrderType = _m[1];
    var _o = react_1.useState(''), arrowOrder = _o[0], setArrowOrder = _o[1];
    var router = router_1.useRouter();
    var _p = react_1.useState(false), statusAccordion = _p[0], setStatusAccordion = _p[1];
    // const take: number = itensPerPage;
    var _q = react_1.useState(itensPerPage), take = _q[0], setTake = _q[1];
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _r = react_1.useState(orderByserver), orderBy = _r[0], setOrderBy = _r[1];
    var _s = react_1.useState(typeOrderServer), typeOrder = _s[0], setTypeOrder = _s[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}`;
    var formik = formik_1.useFormik({
        initialValues: {
            // filterExperimentGroup: checkValue('filterExperimentGroup'),
            // filterQuantityExperiment: checkValue('filterQuantityExperiment'),
            // filterTagsToPrint: checkValue('filterTagsToPrint'),
            // filterTagsPrinted: checkValue('filterTagsPrinted'),
            // filterTotalTags: checkValue('filterTotalTags'),
            // filterStatus: checkValue('filterStatus'),
            filterExperimentGroup: checkValue('filterExperimentGroup'),
            filterQuantityExperiment: checkValue('filterQuantityExperiment'),
            filterTagsToPrint: checkValue('filterTagsToPrint'),
            filterTagsPrinted: checkValue('filterTagsPrinted'),
            filterTotalTags: checkValue('filterTotalTags'),
            filterStatus: checkValue('filterStatus'),
            filterQtdExpFrom: checkValue('filterQtdExpFrom'),
            filterQtdExpTo: checkValue('filterQtdExpTo'),
            filterTotalEtiqImprimirFrom: checkValue('filterTotalEtiqImprimirFrom'),
            filterTotalEtiqImprimirTo: checkValue('filterTotalEtiqImprimirTo'),
            filterTotalEtiqImpressasFrom: checkValue('filterTotalEtiqImpressasFrom'),
            filterTotalEtiqImpressasTo: checkValue('filterTotalEtiqImpressasTo'),
            filterTotalEtiqFrom: checkValue('filterTotalEtiqFrom'),
            filterTotalEtiqTo: checkValue('filterTotalEtiqTo')
        },
        onSubmit: function (_a) {
            var filterExperimentGroup = _a.filterExperimentGroup, filterQuantityExperiment = _a.filterQuantityExperiment, filterTagsToPrint = _a.filterTagsToPrint, filterTagsPrinted = _a.filterTagsPrinted, filterTotalTags = _a.filterTotalTags, filterQtdExpTo = _a.filterQtdExpTo, filterQtdExpFrom = _a.filterQtdExpFrom, filterTotalEtiqImprimirTo = _a.filterTotalEtiqImprimirTo, filterTotalEtiqImprimirFrom = _a.filterTotalEtiqImprimirFrom, filterTotalEtiqImpressasTo = _a.filterTotalEtiqImpressasTo, filterTotalEtiqImpressasFrom = _a.filterTotalEtiqImpressasFrom, filterTotalEtiqTo = _a.filterTotalEtiqTo, filterTotalEtiqFrom = _a.filterTotalEtiqFrom, filterStatus = _a.filterStatus;
            return __awaiter(_this, void 0, void 0, function () {
                var parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            parametersFilter = "&filterExperimentGroup=" + filterExperimentGroup + "&filterQuantityExperiment=" + filterQuantityExperiment + "&filterTagsToPrint=" + filterTagsToPrint + "&filterTagsPrinted=" + filterTagsPrinted + "&filterTotalTags=" + filterTotalTags + "&filterStatus=" + filterStatus + "&safraId=" + safraId + "&id_culture=" + cultureId;
                            // setFiltersParams(parametersFilter);
                            // setCookies('filterBeforeEditOperation', filtersParams);
                            // await experimentGroupService
                            //   .getAll(`${parametersFilter}`)
                            //   .then(({ response, total: allTotal }) => {
                            //     setFilter(parametersFilter);
                            //     setExperimentGroup(response);
                            //     setTotalItems(allTotal);
                            //     setCurrentPage(0);
                            //     tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
                            //   });
                            setFilter(parametersFilter);
                            setCurrentPage(0);
                            return [4 /*yield*/, callingApi(parametersFilter)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    // Calling common API
    function callingApi(parametersFilter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cookies_next_1.setCookies('filterBeforeEditOperation', parametersFilter);
                        cookies_next_1.setCookies('filterBeforeEditTypeOrderOperation', typeOrder);
                        cookies_next_1.setCookies('filterBeforeEditOrderByOperation', orderBy);
                        parametersFilter = parametersFilter + "&" + pathExtra;
                        setFiltersParams(parametersFilter);
                        // setCookies("filtersParams", parametersFilter);
                        cookies_next_1.setCookies('filtersParamsOperation', parametersFilter);
                        return [4 /*yield*/, services_1.experimentGroupService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setExperimentGroup(response.response);
                                    setTotalItems(response.total);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // Call that function when change type order value.
    react_1.useEffect(function () {
        callingApi(filter);
    }, [typeOrder]);
    react_1.useEffect(function () {
        cookies_next_1.setCookies('filtersParams-test-rr', filtersParams);
    }, [filtersParams]);
    function handleOrder(column, order) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, typeOrderG, columnG, orderByG, arrowOrder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, helpers_1.tableGlobalFunctions.handleOrderG(column, order, orderList)];
                    case 1:
                        _a = _b.sent(), typeOrderG = _a.typeOrderG, columnG = _a.columnG, orderByG = _a.orderByG, arrowOrder = _a.arrowOrder;
                        setTypeOrder(typeOrderG);
                        setOrderBy(columnG);
                        setOrder(orderByG);
                        setArrowOrder(arrowOrder);
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteItem(id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, services_1.experimentGroupService.deleted(id)];
                    case 1:
                        _a = _b.sent(), status = _a.status, message = _a.message;
                        if (status === 200) {
                            router.reload();
                        }
                        else {
                            sweetalert2_1["default"].fire({
                                html: message,
                                width: '800'
                            });
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
    function actionTableFactory() {
        return {
            title: react_1["default"].createElement("div", { className: "flex items-center" }, "A\u00E7\u00E3o"),
            field: 'action',
            sorting: false,
            width: 0,
            render: function (rowData) { return (react_1["default"].createElement("div", { className: "flex gap-2" },
                react_1["default"].createElement("div", { className: "h-10 w-10" },
                    react_1["default"].createElement(components_1.Button, { title: "Editar " + rowData.name, type: "button", onClick: function () {
                            cookies_next_1.setCookies('pageBeforeEditOperation', currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies('filterBeforeEditOperation', filter);
                            cookies_next_1.setCookies('filterBeforeEditTypeOrderOperation', typeOrder);
                            cookies_next_1.setCookies('filterBeforeEditOrderByOperation', orderBy);
                            cookies_next_1.setCookies('filtersParamsOperation', filtersParams);
                            cookies_next_1.setCookies('lastPageOperation', 'atualizar');
                            router.push("/operacao/etiquetagem/atualizar?id=" + rowData.id);
                        }, rounder: "rounded-full", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiEdit, { size: 20 }) })),
                react_1["default"].createElement("div", { className: "h-10 w-10" },
                    react_1["default"].createElement(components_1.Button, { title: "", type: "button", onClick: function () {
                            cookies_next_1.setCookies('pageBeforeEditOperation', currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies('filterBeforeEditOperation', filter);
                            cookies_next_1.setCookies('filterBeforeEditTypeOrderOperation', typeOrder);
                            cookies_next_1.setCookies('filterBeforeEditOrderByOperation', orderBy);
                            cookies_next_1.setCookies('filtersParamsOperation', filtersParams);
                            cookies_next_1.setCookies('lastPageOperation', 'parcelas');
                            router.push("/operacao/etiquetagem/parcelas?id=" + rowData.id);
                        }, rounder: "rounded-full", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(ai_1.AiOutlinePrinter, { size: 20 }) })),
                react_1["default"].createElement("div", { className: "h-10 w-10" },
                    react_1["default"].createElement(components_1.Button, { title: "Excluir " + rowData.name, type: "button", onClick: function () { return deleteItem(rowData.id); }, rounder: "rounded-full", bgColor: "bg-red-600", textColor: "white", icon: react_1["default"].createElement(bs_1.BsTrashFill, { size: 20 }) })))); }
        };
    }
    function orderColumns(columnsOrder) {
        var columnOrder = columnsOrder.split(',');
        var tableFields = [];
        Object.keys(columnOrder).forEach(function (item) {
            if (columnOrder[item] === 'name') {
                tableFields.push(headerTableFactory('Nome do grupo de exp.', 'name'));
            }
            if (columnOrder[item] === 'experimentAmount') {
                tableFields.push(headerTableFactory('Qtde. exp.', 'experimentAmount'));
            }
            if (columnOrder[item] === 'tagsToPrint') {
                tableFields.push(headerTableFactory('Etiq. a imprimir', 'tagsToPrint'));
            }
            if (columnOrder[item] === 'tagsPrinted') {
                tableFields.push(headerTableFactory('Etiq. impressas', 'tagsPrinted'));
            }
            if (columnOrder[item] === 'totalTags') {
                tableFields.push(headerTableFactory('Total etiquetas', 'totalTags'));
            }
            if (columnOrder[item] === 'status') {
                tableFields.push(headerTableFactory('Status grupo exp.', 'status'));
            }
            if (columnOrder[item] === 'action') {
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
                        selecionados = '';
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
                                module_id: 29
                            })
                                .then(function (response) {
                                userLogado.preferences.etiquetagem = {
                                    id: response.response.id,
                                    userId: preferences.userId,
                                    table_preferences: campos
                                };
                                preferences.id = response.response.id;
                            })];
                    case 1:
                        _a.sent();
                        localStorage.setItem('user', JSON.stringify(userLogado));
                        return [3 /*break*/, 4];
                    case 2:
                        userLogado.preferences.etiquetagem = {
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
                        localStorage.setItem('user', JSON.stringify(userLogado));
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
                case 0: return [4 /*yield*/, services_1.experimentGroupService.getAll(filter).then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var workSheet = XLSX.utils.json_to_sheet(response);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, 'Grupos do experimento');
                            // Buffer
                            XLSX.write(workBook, {
                                bookType: 'xlsx',
                                type: 'buffer'
                            });
                            // Binary
                            XLSX.write(workBook, {
                                bookType: 'xlsx',
                                type: 'binary'
                            });
                            // Download
                            XLSX.writeFile(workBook, 'Grupos do experimento.xlsx');
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // manage total pages
    function handleTotalPages() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (currentPage < 0) {
                    setCurrentPage(0);
                }
                return [2 /*return*/];
            });
        });
    }
    function handlePagination() {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // const skip = currentPage * Number(take);
                    // let parametersFilter;
                    // if (orderType) {
                    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
                    // } else {
                    //   parametersFilter = `skip=${skip}&take=${take}`;
                    // }
                    // if (filter) {
                    //   parametersFilter = `${parametersFilter}&${filter}`;
                    // }
                    // await experimentGroupService
                    //   .getAll(parametersFilter)
                    //   .then(({ status, response }) => {
                    //     if (status === 200) {
                    //       setExperimentGroup(response);
                    //     }
                    //   });
                    return [4 /*yield*/, callingApi(filter)];
                    case 1:
                        // const skip = currentPage * Number(take);
                        // let parametersFilter;
                        // if (orderType) {
                        //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
                        // } else {
                        //   parametersFilter = `skip=${skip}&take=${take}`;
                        // }
                        // if (filter) {
                        //   parametersFilter = `${parametersFilter}&${filter}`;
                        // }
                        // await experimentGroupService
                        //   .getAll(parametersFilter)
                        //   .then(({ status, response }) => {
                        //     if (status === 200) {
                        //       setExperimentGroup(response);
                        //     }
                        //   });
                        _a.sent(); // handle pagination globly
                        return [2 /*return*/];
                }
            });
        });
    }
    // Checking defualt values
    function checkValue(value) {
        var parameter = helpers_1.tableGlobalFunctions.getValuesForFilter(value, filtersParams);
        return parameter;
    }
    function filterFieldFactory(title, name, small) {
        if (small === void 0) { small = false; }
        return (react_1["default"].createElement("div", { className: small ? 'h-7 w-1/3 ml-2' : 'h-7 w-1/2 ml-2' },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { type: "text", placeholder: name, id: title, defaultValue: checkValue(title), name: title, onChange: formik.handleChange })));
    }
    function handleSubmit(event) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var inputValue, response, _b, createStatus, newGroup;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        event.preventDefault();
                        inputValue = (_a = document.getElementById('inputName')) === null || _a === void 0 ? void 0 : _a.value;
                        return [4 /*yield*/, services_1.experimentGroupService.getAll({
                                filterExperimentGroup: inputValue,
                                safraId: safraId
                            })];
                    case 1:
                        response = (_c.sent()).response;
                        if (!((response === null || response === void 0 ? void 0 : response.length) > 0)) return [3 /*break*/, 2];
                        sweetalert2_1["default"].fire('Grupo já cadastrado');
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, services_1.experimentGroupService.create({
                            name: inputValue,
                            safraId: Number(safraId),
                            createdBy: userLogado.id
                        })];
                    case 3:
                        _b = _c.sent(), createStatus = _b.status, newGroup = _b.response;
                        if (createStatus !== 200) {
                            sweetalert2_1["default"].fire('Erro ao cadastrar grupo');
                        }
                        else {
                            router.push("/operacao/etiquetagem/atualizar?id=" + newGroup.id);
                        }
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(head_1["default"], null,
            react_1["default"].createElement("title", null, "Listagem de grupos de experimento")),
        react_1["default"].createElement(components_1.ModalComponent, { isOpen: isOpenModal, onPress: function (e) { return handleSubmit(e); }, onCancel: function () { return setIsOpenModal(false); } },
            react_1["default"].createElement("form", { className: "flex flex-col" },
                react_1["default"].createElement("div", { className: "flex flex-col px-4  justify-between" },
                    react_1["default"].createElement("header", { className: "flex flex-col mt-2" },
                        react_1["default"].createElement("h2", { className: "mb-2 text-blue-600 text-xl font-medium" }, "Cadastrar grupo")),
                    react_1["default"].createElement("h2", { style: { marginTop: 25, marginBottom: 5 } }, "Nome do grupo"),
                    react_1["default"].createElement(components_1.Input, { type: "text", placeholder: "Nome do grupo", id: "inputName", name: "inputName" })))),
        react_1["default"].createElement(components_1.Content, { contentHeader: tabsEtiquetagemMenu, moduloActive: "operacao" },
            react_1["default"].createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                react_1["default"].createElement(components_1.AccordionFilter, { title: "Filtrar grupos" },
                    react_1["default"].createElement("div", { className: "w-full flex gap-2" },
                        react_1["default"].createElement("form", { className: "flex flex-col\n                  w-full\n                  items-center\n                  px-1\n                  bg-white\n                ", onSubmit: formik.handleSubmit },
                            react_1["default"].createElement("div", { className: "w-full h-full\n                  flex\n                  justify-center\n                  pb-0\n                " },
                                filterFieldFactory('filterExperimentGroup', 'Nome do grupo de exp.'),
                                react_1["default"].createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Qtde. exp."),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterQtdExpFrom", name: "filterQtdExpFrom", onChange: formik.handleChange, defaultValue: checkValue('filterQtdExpFrom') }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterQtdExpTo", name: "filterQtdExpTo", onChange: formik.handleChange, defaultValue: checkValue('filterQtdExpTo') }))),
                                react_1["default"].createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Etiq. a imprimir"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterTotalEtiqImprimirFrom", name: "filterTotalEtiqImprimirFrom", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqImprimirFrom') }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterTotalEtiqImprimirTo", name: "filterTotalEtiqImprimirTo", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqImprimirTo') }))),
                                react_1["default"].createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Etiq. impressas"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterTotalEtiqImpressasFrom", name: "filterTotalEtiqImpressasFrom", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqImpressasFrom') }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterTotalEtiqImpressasTo", name: "filterTotalEtiqImpressasTo", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqImpressasTo') }))),
                                react_1["default"].createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Total etiquetas"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterTotalEtiqFrom", name: "filterTotalEtiqFrom", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqFrom') }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterTotalEtiqTo", name: "filterTotalEtiqTo", onChange: formik.handleChange, defaultValue: checkValue('filterTotalEtiqTo') }))),
                                react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status grupo exp."),
                                    react_1["default"].createElement(components_1.AccordionFilter, null,
                                        react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                            react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (react_1["default"].createElement("ul", __assign({ className: "w-full h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                statusFilter.map(function (generate, index) { return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (providers) {
                                                    var _a;
                                                    return (react_1["default"].createElement("li", __assign({ ref: providers.innerRef }, providers.draggableProps, providers.dragHandleProps),
                                                        react_1["default"].createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: false })));
                                                })); }),
                                                provided.placeholder)); })))),
                                react_1["default"].createElement(components_1.FieldItemsPerPage, { selected: take, onChange: setTake }),
                                react_1["default"].createElement("div", { style: { width: 40 } }),
                                react_1["default"].createElement("div", { className: "h-7 w-32 mt-6" },
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { }, value: "Filtrar", type: "submit", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                react_1["default"].createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    react_1["default"].createElement(material_table_1["default"], { tableRef: tableRef, style: { background: '#f9fafb' }, columns: columns, data: experimentGroup, options: {
                            selectionProps: function (rowData) { return isOpenModal && { disabled: rowData }; },
                            showTitle: false,
                            headerStyle: {
                                zIndex: 0
                            },
                            rowStyle: { background: '#f9fafb', height: 35 },
                            search: false,
                            filtering: false,
                            pageSize: Number(take)
                        }, onChangeRowsPerPage: function () { }, components: {
                            Toolbar: function () { return (react_1["default"].createElement("div", { className: "w-full max-h-96\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                react_1["default"].createElement("div", { className: "h-12 w-44 ml-0" },
                                    react_1["default"].createElement(components_1.Button, { title: "Criar novo grupo", value: "Criar novo grupo", textColor: "white", onClick: function () {
                                            setIsOpenModal(!isOpenModal);
                                        }, bgColor: "bg-blue-600" })),
                                react_1["default"].createElement("strong", { className: "text-blue-600" },
                                    "Total registrado:",
                                    ' ',
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
                                        react_1["default"].createElement(components_1.Button, { title: "Exportar planilha de grupos", icon: react_1["default"].createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }))))); },
                            Pagination: function (props) { return (react_1["default"].createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
                                react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                Array(1)
                                    .fill('')
                                    .map(function (value, index) { return (react_1["default"].createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages }))); }
                        } }))))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, token, cultureId, idSafra, pageBeforeEdit, lastPageServer, filterBeforeEdit, filterApplication, typeOrderServer, orderByserver, publicRuntimeConfig, baseUrl, param, urlParameters, requestOptions, _b, allExperimentGroup, totalItems, safraId;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_d = (_c = (_f.sent())) === null || _c === void 0 ? void 0 : _c.response[0]) === null || _d === void 0 ? void 0 : _d.itens_per_page)];
                case 2:
                    itensPerPage = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : 10;
                    token = req.cookies.token;
                    cultureId = req.cookies.cultureId;
                    idSafra = Number(req.cookies.safraId);
                    pageBeforeEdit = req.cookies.pageBeforeEditOperation
                        ? req.cookies.pageBeforeEditOperation
                        : 0;
                    lastPageServer = req.cookies.lastPageOperation
                        ? req.cookies.lastPageOperation
                        : 'No';
                    if (lastPageServer == undefined || lastPageServer == "No") {
                        cookies_next_1.removeCookies('filterBeforeEditOperation', { req: req, res: res });
                        cookies_next_1.removeCookies('pageBeforeEditOperation', { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditTypeOrderOperation", { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditOrderByOperation", { req: req, res: res });
                        cookies_next_1.removeCookies("lastPageOperation", { req: req, res: res });
                    }
                    filterBeforeEdit = req.cookies.filterBeforeEditOperation
                        ? req.cookies.filterBeforeEditOperation
                        : "safraId=" + idSafra + "&id_culture=" + cultureId;
                    filterApplication = req.cookies.filterBeforeEditOperation
                        ? "" + req.cookies.filterBeforeEditOperation
                        : "safraId=" + idSafra + "&id_culture=" + cultureId;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrderOperation
                        ? req.cookies.filterBeforeEditTypeOrderOperation
                        : 'desc';
                    orderByserver = req.cookies.filterBeforeEditOrderByOperation
                        ? req.cookies.filterBeforeEditOrderByOperation
                        : 'experimentAmount';
                    cookies_next_1.removeCookies('filterBeforeEditOperation', { req: req, res: res });
                    cookies_next_1.removeCookies('pageBeforeEditOperation', { req: req, res: res });
                    cookies_next_1.removeCookies("filterBeforeEditTypeOrderOperation", { req: req, res: res });
                    cookies_next_1.removeCookies("filterBeforeEditOrderByOperation", { req: req, res: res });
                    cookies_next_1.removeCookies("lastPageOperation", { req: req, res: res });
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrl = publicRuntimeConfig.apiUrl + "/experiment";
                    param = "skip=0&take=" + itensPerPage + "&safraId=" + idSafra + "&id_culture=" + cultureId;
                    urlParameters = new URL(baseUrl);
                    urlParameters.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParameters.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _f.sent(), allExperimentGroup = _b.response, totalItems = _b.total;
                    safraId = idSafra;
                    return [2 /*return*/, {
                            props: {
                                allExperimentGroup: allExperimentGroup,
                                totalItems: totalItems,
                                safraId: safraId,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit,
                                cultureId: cultureId,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer
                            }
                        }];
            }
        });
    });
};
