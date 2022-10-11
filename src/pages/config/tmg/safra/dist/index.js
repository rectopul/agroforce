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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getServerSideProps = void 0;
var formik_1 = require("formik");
var material_table_1 = require("material-table");
var config_1 = require("next/config");
var head_1 = require("next/head");
var react_1 = require("react");
var router_1 = require("next/router");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var ai_1 = require("react-icons/ai");
var bi_1 = require("react-icons/bi");
var fa_1 = require("react-icons/fa");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var ri_1 = require("react-icons/ri");
var XLSX = require("xlsx");
var cookies_next_1 = require("cookies-next");
var components_1 = require("../../../../../components");
var user_preference_controller_1 = require("../../../../../controllers/user-preference.controller");
var services_1 = require("../../../../../services");
var helpers_1 = require("../../../../../helpers");
var dropdown_1 = require("../../../../../shared/utils/dropdown");
function Listagem(_a) {
    var _this = this;
    var allSafras = _a.allSafras, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, cultureId = _a.cultureId, pageBeforeEdit = _a.pageBeforeEdit, filterBeforeEdit = _a.filterBeforeEdit, typeOrderServer = _a.typeOrderServer, // RR
    orderByserver = _a.orderByserver;
    var TabsDropDowns = dropdown_1["default"].TabsDropDowns;
    var tabsDropDowns = TabsDropDowns();
    // eslint-disable-next-line no-return-assign, no-param-reassign
    tabsDropDowns.map(function (tab) { return (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)); });
    var router = router_1.useRouter();
    var userLogado = JSON.parse(localStorage.getItem('user'));
    var preferences = userLogado.preferences.safra || {
        id: 0,
        table_preferences: 'id,safraName,year,plantingStartTime,plantingEndTime,status'
    };
    var _b = react_1.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var _c = react_1.useState(function () { return allSafras; }), safras = _c[0], setSafras = _c[1];
    var _d = react_1.useState(Number(pageBeforeEdit)), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = react_1.useState(filterBeforeEdit), filtersParams = _e[0], setFiltersParams = _e[1]; // Set filter Parameter
    var _f = react_1.useState(totalItems), itemsTotal = _f[0], setTotalItems = _f[1];
    var _g = react_1.useState(1), orderList = _g[0], setOrder = _g[1];
    var _h = react_1.useState(''), arrowOrder = _h[0], setArrowOrder = _h[1];
    var _j = react_1.useState(false), statusAccordion = _j[0], setStatusAccordion = _j[1];
    var _k = react_1.useState(function () { return [
        // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
        { name: 'CamposGerenciados[]', title: 'Safra', value: 'safraName' },
        { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
        {
            name: 'CamposGerenciados[]',
            title: 'Período ideal de início de plantio',
            value: 'plantingStartTime'
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Período ideal do fim do plantio',
            value: 'plantingEndTime'
        },
        { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
    ]; }), generatesProps = _k[0], setGeneratesProps = _k[1];
    var _l = react_1.useState(filterApplication), filter = _l[0], setFilter = _l[1];
    var _m = react_1.useState(''), colorStar = _m[0], setColorStar = _m[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _o = react_1.useState(''), orderType = _o[0], setOrderType = _o[1];
    var filtersStatusItem = [
        { id: 2, name: 'Todos' },
        { id: 1, name: 'Ativos' },
        { id: 0, name: 'Inativos' },
    ];
    var filterStatusBeforeEdit = filterBeforeEdit.split('');
    var take = itensPerPage;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _p = react_1.useState(orderByserver), orderBy = _p[0], setOrderBy = _p[1];
    var _q = react_1.useState(typeOrderServer), typeOrder = _q[0], setTypeOrder = _q[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    var formik = formik_1.useFormik({
        initialValues: {
            filterStatus: filterStatusBeforeEdit[13],
            filterSafra: checkValue('filterSafra'),
            filterYear: checkValue('filterYear'),
            filterYearTo: '',
            filterYearFrom: '',
            filterStartDate: '',
            filterEndDate: '',
            orderBy: '',
            typeOrder: ''
        },
        onSubmit: function (_a) {
            var filterStatus = _a.filterStatus, filterSafra = _a.filterSafra, filterYearTo = _a.filterYearTo, filterYearFrom = _a.filterYearFrom, filterStartDate = _a.filterStartDate, filterEndDate = _a.filterEndDate;
            return __awaiter(_this, void 0, void 0, function () {
                var parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            parametersFilter = "filterStatus=" + (filterStatus || 2) + "&filterSafra=" + filterSafra + "&filterYearTo=" + filterYearTo + "&filterYearFrom=" + filterYearFrom + "&filterStartDate=" + filterStartDate + "&filterEndDate=" + filterEndDate + "&id_culture=" + cultureId;
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
                        cookies_next_1.setCookies('filterBeforeEdit', parametersFilter);
                        cookies_next_1.setCookies('filterBeforeEditTypeOrder', typeOrder);
                        cookies_next_1.setCookies('filterBeforeEditOrderBy', orderBy);
                        parametersFilter = parametersFilter + "&" + pathExtra;
                        setFiltersParams(parametersFilter);
                        cookies_next_1.setCookies('filtersParams', parametersFilter);
                        return [4 /*yield*/, services_1.safraService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setSafras(response.response);
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
    function handleStatusSafra(idItem, data) {
        return __awaiter(this, void 0, Promise, function () {
            var index, _a, id, safraName, year, plantingStartTime, plantingEndTime, status;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (data.status === 1) {
                            data.status = 0;
                        }
                        else {
                            data.status = 1;
                        }
                        index = safras.findIndex(function (safra) { return safra.id === idItem; });
                        if (index === -1) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, services_1.safraService.updateSafras({
                                id: idItem,
                                status: data.status
                            })];
                    case 1:
                        _b.sent();
                        setSafras(function (oldSafra) {
                            var copy = __spreadArrays(oldSafra);
                            copy[index].status = data.status;
                            return copy;
                        });
                        _a = safras[index], id = _a.id, safraName = _a.safraName, year = _a.year, plantingStartTime = _a.plantingStartTime, plantingEndTime = _a.plantingEndTime, status = _a.status;
                        return [4 /*yield*/, services_1.safraService.updateSafras({
                                id: id,
                                safraName: safraName,
                                year: year,
                                plantingStartTime: plantingStartTime,
                                plantingEndTime: plantingEndTime,
                                status: status
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // async function handleOrder(
    //   column: string,
    //   order: string | any,
    // ): Promise<void> {
    //   let typeOrder: any;
    //   let parametersFilter: any;
    //   if (order === 1) {
    //     typeOrder = 'asc';
    //   } else if (order === 2) {
    //     typeOrder = 'desc';
    //   } else {
    //     typeOrder = '';
    //   }
    //   setOrderBy(column);
    //   setOrderType(typeOrder);
    //   if (filter && typeof filter !== 'undefined') {
    //     if (typeOrder !== '') {
    //       parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
    //     } else {
    //       parametersFilter = filter;
    //     }
    //   } else if (typeOrder !== '') {
    //     parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    //   } else {
    //     parametersFilter = filter;
    //   }
    //   await safraService
    //     .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //     .then((response) => {
    //       if (response.status === 200) {
    //         setSafras(response.response);
    //       }
    //     });
    //   if (orderList === 2) {
    //     setOrder(0);
    //     setArrowOrder(<AiOutlineArrowDown />);
    //   } else {
    //     setOrder(orderList + 1);
    //     if (orderList === 1) {
    //       setArrowOrder(<AiOutlineArrowUp />);
    //     } else {
    //       setArrowOrder('');
    //     }
    //   }
    // }
    function headerTableFactory(name, title) {
        return {
            title: (React.createElement("div", { className: "flex items-center" },
                React.createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: true
        };
    }
    function idHeaderFactory() {
        return {
            title: React.createElement("div", { className: "flex items-center" }, arrowOrder),
            field: 'id',
            width: 0,
            sorting: false,
            render: function () { return (colorStar === '#eba417' ? (React.createElement("div", { className: "h-9 flex" },
                React.createElement("div", null,
                    React.createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar(''); } },
                        React.createElement(ai_1.AiTwotoneStar, { size: 20, color: "#eba417" }))))) : (React.createElement("div", { className: "h-9 flex" },
                React.createElement("div", null,
                    React.createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar('#eba417'); } },
                        React.createElement(ai_1.AiTwotoneStar, { size: 20 })))))); }
        };
    }
    function statusHeaderFactory() {
        var _this = this;
        return {
            title: 'Status',
            field: 'status',
            sorting: false,
            searchable: false,
            filterPlaceholder: 'Filtrar por status',
            render: function (rowData) { return (React.createElement("div", { className: "h-8 flex" },
                React.createElement("div", { className: "h-7" },
                    React.createElement(components_1.Button, { icon: React.createElement(bi_1.BiEdit, { size: 14 }), title: "Atualizar " + rowData.safraName, onClick: function () {
                            cookies_next_1.setCookies('pageBeforeEdit', currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies('filterBeforeEdit', filter);
                            cookies_next_1.setCookies('filterBeforeEditTypeOrder', typeOrder);
                            cookies_next_1.setCookies('filterBeforeEditOrderBy', orderBy);
                            cookies_next_1.setCookies('filtersParams', filtersParams);
                            cookies_next_1.setCookies('lastPage', 'atualizar');
                            router.push("/config/tmg/safra/atualizar?id=" + rowData.id + "&currentPage=" + currentPage + "&" + filtersParams);
                        }, bgColor: "bg-blue-600", textColor: "white" })),
                React.createElement("div", { style: { width: 5 } }),
                rowData.status ? (React.createElement("div", { className: "h-7" },
                    React.createElement(components_1.Button, { title: "Ativo", icon: React.createElement(fa_1.FaRegThumbsUp, { size: 14 }), onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, handleStatusSafra(rowData.id, __assign({ status: rowData.status }, rowData))];
                            });
                        }); }, bgColor: "bg-green-600", textColor: "white" }))) : (React.createElement("div", { className: "h-7" },
                    React.createElement(components_1.Button, { title: "Inativo", icon: React.createElement(fa_1.FaRegThumbsDown, { size: 14 }), onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, handleStatusSafra(rowData.id, __assign({ status: rowData.status }, rowData))];
                            });
                        }); }, bgColor: "bg-red-800", textColor: "white" }))))); }
        };
    }
    function columnsOrder(camposGerenciados) {
        var columnCampos = camposGerenciados.split(',');
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (item, index) {
            // if (columnCampos[index] === 'id') {
            //   tableFields.push(idHeaderFactory());
            // }
            if (columnCampos[index] === 'safraName') {
                tableFields.push(headerTableFactory('Safra', 'safraName'));
            }
            if (columnCampos[index] === 'year') {
                tableFields.push(headerTableFactory('Ano', 'year'));
            }
            if (columnCampos[index] === 'plantingStartTime') {
                tableFields.push(headerTableFactory('Período ideal início de plantio', 'plantingStartTime'));
            }
            if (columnCampos[index] === 'plantingEndTime') {
                tableFields.push(headerTableFactory('Período ideal fim do plantio', 'plantingEndTime'));
            }
            if (columnCampos[index] === 'status') {
                tableFields.push(statusHeaderFactory());
            }
        });
        return tableFields;
    }
    var columns = columnsOrder(camposGerenciados);
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
                                module_id: 3
                            })
                                .then(function (response) {
                                userLogado.preferences.safra = {
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
                        userLogado.preferences.safra = {
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
                case 0: return [4 /*yield*/, services_1.safraService.getAll(filter).then(function (response) {
                        if (response.status === 200) {
                            var newData = response.response.map(function (row) {
                                if (row.status === 0) {
                                    row.status = 'Inativos';
                                }
                                else {
                                    row.status = 'Ativos';
                                }
                                row.Nome = row.safraName;
                                row.Ano = row.year;
                                row.Início_Plantio = row.plantingStartTime;
                                row.Fim_Plantio = row.plantingEndTime;
                                row.Status = row.status;
                                delete row.safraName;
                                delete row.year;
                                delete row.plantingStartTime;
                                delete row.plantingEndTime;
                                delete row.status;
                                delete row.id;
                                delete row.tableData;
                                return row;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(newData);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, 'safras');
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
                            XLSX.writeFile(workBook, 'Safras.xlsx');
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
                    case 0: return [4 /*yield*/, callingApi(filter)];
                    case 1:
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
    react_1.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "Listagem de safras")),
        React.createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "config" },
            React.createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                React.createElement(components_1.AccordionFilter, { title: "Filtrar safras" },
                    React.createElement("div", { className: "w-full flex gap-2" },
                        React.createElement("form", { className: "flex flex-col\n                    w-full\n                    items-center\n                    px-4\n                    bg-white\n                  ", onSubmit: formik.handleSubmit },
                            React.createElement("div", { className: "w-full h-full\n                    flex\n                    justify-center\n                  " },
                                React.createElement("div", { className: "h-6 w-1/2 ml-4" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status"),
                                    React.createElement(components_1.Select, { name: "filterStatus", id: "filterStatus", onChange: formik.handleChange, defaultValue: checkValue('filterStatus'), 
                                        // defaultValue={filterStatusBeforeEdit[13]}
                                        values: filtersStatusItem.map(function (id) { return id; }), selected: "2" })),
                                React.createElement("div", { className: "h-6 w-1/2 ml-4" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Safra"),
                                    React.createElement(components_1.Input, { placeholder: "Nome da Safra", id: "filterSafra", name: "filterSafra", defaultValue: checkValue('filterSafra'), onChange: formik.handleChange })),
                                React.createElement("div", { className: "h-6 w-1/2 ml-4" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Ano"),
                                    React.createElement("div", { className: "flex" },
                                        React.createElement(components_1.Input, { placeholder: "De", id: "filterYearFrom", name: "filterYearFrom", onChange: formik.handleChange }),
                                        React.createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterYearTo", name: "filterYearTo", onChange: formik.handleChange }))),
                                React.createElement("div", { className: "h-7 w-32 mt-6", style: { marginLeft: 10 } },
                                    React.createElement(components_1.Button, { type: "submit", onClick: function () { }, value: "Filtrar", bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                React.createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    React.createElement(material_table_1["default"], { style: { background: '#f9fafb' }, columns: columns, data: safras, options: {
                            sorting: true,
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20
                            },
                            search: false,
                            filtering: false,
                            pageSize: itensPerPage
                        }, components: {
                            Toolbar: function () { return (React.createElement("div", { className: "w-full max-h-96\n                      flex\n                      items-center\n                      justify-between\n                      gap-4\n                      bg-gray-50\n                      py-2\n                      px-5\n                      border-solid border-b\n                      border-gray-200\n                    " },
                                React.createElement("div", { className: "h-12" },
                                    React.createElement(components_1.Button, { title: "Cadastrar safra", value: "Cadastrar safra", bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                            router.push('safra/cadastro');
                                        }, icon: React.createElement(md_1.MdDateRange, { size: 20 }) })),
                                React.createElement("strong", { className: "text-blue-600" },
                                    "Total registrado:",
                                    ' ',
                                    itemsTotal),
                                React.createElement("div", { className: "h-full flex items-center gap-2" },
                                    React.createElement("div", { className: "border-solid border-2 border-blue-600 rounded" },
                                        React.createElement("div", { className: "w-72" },
                                            React.createElement(components_1.AccordionFilter, { title: "Gerenciar Campos", grid: statusAccordion },
                                                React.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                                    React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (React.createElement("ul", __assign({ className: "w-full h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                        React.createElement("div", { className: "h-8 mb-2" },
                                                            React.createElement(components_1.Button, { value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", onClick: getValuesColumns, icon: React.createElement(io5_1.IoReloadSharp, { size: 20 }) })),
                                                        generatesProps.map(function (generate, index) { return (React.createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (provided) {
                                                            var _a;
                                                            return (React.createElement("li", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                                                                React.createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: camposGerenciados.includes(generate.value) })));
                                                        })); }),
                                                        provided.placeholder)); }))))),
                                    React.createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                        React.createElement(components_1.Button, { title: "Exportar planilha de safras", icon: React.createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }))))); },
                            Pagination: function (props) { return (React.createElement("div", __assign({ className: "flex\n                        h-20\n                        gap-2\n                        pr-2\n                        py-5\n                        bg-gray-50\n                      " }, props),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage <= 1 }),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                Array(1)
                                    .fill('')
                                    .map(function (value, index) { return (React.createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages }))); }
                        } }))))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, cultureId, lastPageServer, pageBeforeEdit, filterBeforeEdit, typeOrderServer, orderByserver, token, publicRuntimeConfig, baseUrl, param, filterApplication, urlParameters, requestOptions, _b, allSafras, totalItems;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.response[0]) === null || _d === void 0 ? void 0 : _d.itens_per_page)];
                case 2:
                    itensPerPage = _e.sent();
                    cultureId = req.cookies.cultureId;
                    lastPageServer = req.cookies.lastPage
                        ? req.cookies.lastPage
                        : 'No';
                    if (lastPageServer == undefined || lastPageServer == 'No') {
                        cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                        cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                        cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                        cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                        cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    }
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "filterStatus=1&id_culture=" + cultureId;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : 'desc';
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : 'safraName';
                    token = req.cookies.token;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrl = publicRuntimeConfig.apiUrl + "/safra";
                    param = "skip=0&take=" + itensPerPage + "&filterStatus=1&id_culture=" + cultureId;
                    filterApplication = req.cookies.filterBeforeEdit
                        ? "" + req.cookies.filterBeforeEdit
                        : "filterStatus=1&id_culture=" + cultureId;
                    cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                    // RR
                    cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                    cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    urlParameters = new URL(baseUrl);
                    urlParameters.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParameters.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _e.sent(), allSafras = _b.response, totalItems = _b.total;
                    return [2 /*return*/, {
                            props: {
                                allSafras: allSafras,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                cultureId: cultureId,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer
                            }
                        }];
            }
        });
    });
};
