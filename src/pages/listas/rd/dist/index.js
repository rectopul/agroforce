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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.getServerSideProps = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
var head_1 = require("next/head");
var read_excel_file_1 = require("read-excel-file");
var sweetalert2_1 = require("sweetalert2");
var react_1 = require("react");
var config_1 = require("next/config");
var io_1 = require("react-icons/io");
var material_table_1 = require("material-table");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var ai_1 = require("react-icons/ai");
var bi_1 = require("react-icons/bi");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var ri_1 = require("react-icons/ri");
var XLSX = require("xlsx");
var formik_1 = require("formik");
var material_1 = require("@mui/material");
var helpers_1 = require("src/helpers");
var components_1 = require("../../../components");
var user_preference_controller_1 = require("../../../controllers/user-preference.controller");
var services_1 = require("../../../services");
var ITabs = require("../../../shared/utils/dropdown");
var Loading_1 = require("../../../components/Loading");
function Import(_a) {
    var _this = this;
    var allLogs = _a.allLogs, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, uploadInProcess = _a.uploadInProcess, idSafra = _a.idSafra, idCulture = _a.idCulture;
    var TabsDropDowns = ITabs.TabsDropDowns;
    var tabsDropDowns = TabsDropDowns('listas');
    tabsDropDowns.map(function (tab) { return (tab.titleTab === 'RD' ? (tab.statusTab = true) : (tab.statusTab = false)); });
    var _b = react_1.useState(Number(uploadInProcess)), executeUpload = _b[0], setExecuteUpload = _b[1];
    var disabledButton = executeUpload === 1;
    var bgColor = executeUpload === 1 ? 'bg-red-600' : 'bg-blue-600';
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    function readExcel(moduleId, table) {
        return __awaiter(this, void 0, void 0, function () {
            var value, userLogado;
            var _this = this;
            return __generator(this, function (_a) {
                value = document.getElementById("inputFile-" + moduleId);
                if (!value.files[0]) {
                    sweetalert2_1["default"].fire('Insira um arquivo');
                    return [2 /*return*/];
                }
                userLogado = JSON.parse(localStorage.getItem('user'));
                setExecuteUpload(1);
                read_excel_file_1["default"](value.files[0]).then(function (rows) { return __awaiter(_this, void 0, void 0, function () {
                    var message, message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                setLoading(true);
                                console.log("modeule id --- ", moduleId);
                                if (!moduleId) return [3 /*break*/, 2];
                                return [4 /*yield*/, services_1.importService.validate({
                                        spreadSheet: rows,
                                        moduleId: moduleId,
                                        created_by: userLogado.id,
                                        idSafra: idSafra,
                                        idCulture: idCulture,
                                        table: table,
                                        disabledButton: disabledButton
                                    })];
                            case 1:
                                message = (_a.sent()).message;
                                setLoading(false);
                                sweetalert2_1["default"].fire({
                                    html: message,
                                    width: '800'
                                });
                                setExecuteUpload(0);
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, services_1.importService.validateProtocol({
                                    spreadSheet: rows,
                                    moduleId: moduleId,
                                    created_by: userLogado.id,
                                    idSafra: idSafra,
                                    idCulture: idCulture,
                                    table: table,
                                    disabledButton: disabledButton
                                })];
                            case 3:
                                message = (_a.sent()).message;
                                setLoading(false);
                                sweetalert2_1["default"].fire({
                                    html: message,
                                    width: '800'
                                });
                                setExecuteUpload(0);
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                document.getElementById("inputFile-" + moduleId).value = null;
                return [2 /*return*/];
            });
        });
    }
    var userLogado = JSON.parse(localStorage.getItem('user'));
    var preferences = userLogado.preferences.rd || {
        id: 0,
        table_preferences: 'id,user_id,created_at,table,state'
    };
    var _d = react_1.useState(preferences.table_preferences), camposGerenciados = _d[0], setCamposGerenciados = _d[1];
    var _e = react_1.useState(allLogs), logs = _e[0], setLogs = _e[1];
    var _f = react_1.useState(0), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = react_1.useState(totalItems), itemsTotal = _g[0], setTotalItems = _g[1];
    var _h = react_1.useState(filterApplication), filter = _h[0], setFilter = _h[1];
    var _j = react_1.useState(0), orderList = _j[0], setOrder = _j[1];
    var _k = react_1.useState(''), arrowOrder = _k[0], setArrowOrder = _k[1];
    var _l = react_1.useState(false), statusAccordion = _l[0], setStatusAccordion = _l[1];
    var _m = react_1.useState(function () { return [
        // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
        { name: 'CamposGerenciados[]', title: 'Usuário', value: 'user_id' },
        { name: 'CamposGerenciados[]', title: 'Tabela', value: 'table' },
        { name: 'CamposGerenciados[]', title: 'Status', value: 'state' },
        { name: 'CamposGerenciados[]', title: 'Importado em', value: 'created_at' },
    ]; }), generatesProps = _m[0], setGeneratesProps = _m[1];
    var _o = react_1.useState(''), colorStar = _o[0], setColorStar = _o[1];
    var _p = react_1.useState(''), orderBy = _p[0], setOrderBy = _p[1];
    var _q = react_1.useState(''), typeOrder = _q[0], setTypeOrder = _q[1];
    var take = itensPerPage || 10;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    var pages = Math.ceil(total / take);
    var formik = formik_1.useFormik({
        initialValues: {
            filterUser: '',
            filterTable: '',
            filterStartDate: '',
            filterEndDate: '',
            filterState: '',
            orderBy: '',
            typeOrder: ''
        },
        onSubmit: function (_a) {
            var filterUser = _a.filterUser, filterTable = _a.filterTable, filterStartDate = _a.filterStartDate, filterEndDate = _a.filterEndDate, filterState = _a.filterState;
            return __awaiter(_this, void 0, void 0, function () {
                var parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            parametersFilter = "filterUser=" + filterUser + "&filterTable=" + filterTable + "&filterStartDate=" + filterStartDate + "&filterEndDate=" + filterEndDate + "&filterState=" + filterState;
                            setFilter(parametersFilter);
                            return [4 /*yield*/, getAllLogs("" + parametersFilter)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    function getAllLogs(parametersFilter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parametersFilter = parametersFilter + "&" + pathExtra;
                        return [4 /*yield*/, services_1.logImportService
                                .getAll(parametersFilter)
                                .then(function (_a) {
                                var response = _a.response, allTotal = _a.total;
                                setLogs(response);
                                setTotalItems(allTotal);
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
        getAllLogs(filter);
    }, [typeOrder]);
    // async function handleOrder(
    //   column: string,
    //   order: string | any,
    // ): Promise<void> {
    //   let orderType: any;
    //   let parametersFilter: any;
    //   if (order === 1) {
    //     orderType = 'asc';
    //   } else if (order === 2) {
    //     orderType = 'desc';
    //   } else {
    //     orderType = '';
    //   }
    //   setOrderBy(column);
    //   setTypeOrder(orderType);
    //   if (filter && typeof filter !== 'undefined') {
    //     if (orderType !== '') {
    //       parametersFilter = `${filter}&orderBy=${column}&typeOrder=${orderType}`;
    //     } else {
    //       parametersFilter = filter;
    //     }
    //   } else if (orderType !== '') {
    //     parametersFilter = `orderBy=${column}&typeOrder=${orderType}`;
    //   } else {
    //     parametersFilter = filter;
    //   }
    //   await logImportService
    //     .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //     .then((response) => {
    //       if (response.status === 200) {
    //         setLogs(response.response);
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
            title: (react_1["default"].createElement("div", { className: "flex items-center" },
                react_1["default"].createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: true
        };
    }
    function idHeaderFactory() {
        return {
            title: react_1["default"].createElement("div", { className: "flex items-center" }, arrowOrder),
            field: 'id',
            width: 0,
            sorting: false,
            render: function () { return (colorStar === '#eba417' ? (react_1["default"].createElement("div", { className: "h-7 flex" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar(''); } },
                        react_1["default"].createElement(ai_1.AiTwotoneStar, { size: 20, color: "#eba417" }))))) : (react_1["default"].createElement("div", { className: "h-7 flex" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar('#eba417'); } },
                        react_1["default"].createElement(ai_1.AiTwotoneStar, { size: 20 })))))); }
        };
    }
    function columnsOrder(columnOrder) {
        var columnCampos = columnOrder.split(',');
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (item, index) {
            // if (columnCampos[index] === 'id') {
            //   tableFields.push(idHeaderFactory());
            // }
            if (columnCampos[index] === 'user_id') {
                tableFields.push(headerTableFactory('Usuário', 'user.name'));
            }
            if (columnCampos[index] === 'table') {
                tableFields.push(headerTableFactory('Tabela', 'table'));
            }
            if (columnCampos[index] === 'created_at') {
                tableFields.push(headerTableFactory('Importado em', 'created_at'));
            }
            if (columnCampos[index] === 'state') {
                tableFields.push(headerTableFactory('Status', 'state'));
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
                    case 0: return [4 /*yield*/, helpers_1.fetchWrapper.handleOrderG(column, order, orderList)];
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
                                module_id: 25
                            })
                                .then(function (response) {
                                userLogado.preferences.rd = {
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
                        userLogado.preferences.rd = {
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
    // async function lastUpdate(tableName: string) {
    //   switch (tableName) {
    //     case 'ensaio':
    //       return (
    //         <p>00-00-000 00:00:00</p>
    //       );
    //     case 'experimento': {
    //       const { status, response } = await experimentService.getAll({ idSafra });
    //       let lastExperiment: any = 0;
    //       if (status === 200) {
    //         const lastExperimentUpdate = response.map((item: any) => {
    //           if (lastExperiment < item.created_at) {
    //             lastExperiment = item.created_at;
    //           }
    //         });
    //         return (
    //           <p>{lastExperimentUpdate}</p>
    //         );
    //       }
    //       return (
    //         <p>00-00-000 00:00:00</p>
    //       );
    //     }
    //     default:
    //       return (
    //         <p>00-00-000 00:00:00</p>
    //       );
    //   }
    // }
    var downloadExcel = function () { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, services_1.logImportService.getAll(filter).then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            response.map(function (item) {
                                var newItem = item;
                                newItem.USUÁRIO = item.user.name;
                                newItem.TABELA = item.table;
                                newItem.STATUS = item.state;
                                newItem.IMPORTADO_EM = item.created_at;
                                delete newItem.user;
                                delete newItem.table;
                                delete newItem.state;
                                delete newItem.created_at;
                                delete newItem.id;
                                delete newItem.status;
                                return newItem;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(response);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, 'logs');
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
                            XLSX.writeFile(workBook, 'Logs.xlsx');
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getAllLogs(filter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function filterFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-4" },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { type: "text", placeholder: name, id: title, name: title, onChange: formik.handleChange })));
    }
    function TabPanel(props) {
        var children = props.children, value = props.value, index = props.index, other = __rest(props, ["children", "value", "index"]);
        return (react_1["default"].createElement("div", __assign({ role: "tabpanel", hidden: value !== index, id: "simple-tabpanel-" + index, "aria-labelledby": "simple-tab-" + index }, other), value === index && (react_1["default"].createElement(material_1.Box, { sx: { p: 1 } },
            react_1["default"].createElement(material_1.Typography, null, children)))));
    }
    function a11yProps(index) {
        return {
            id: "simple-tab-" + index,
            'aria-controls': "simple-tabpanel-" + index
        };
    }
    var _r = react_1["default"].useState(0), value = _r[0], setValue = _r[1];
    var handleChange = function (event, newValue) {
        setValue(newValue);
    };
    react_1.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        loading && react_1["default"].createElement(Loading_1["default"], { text: "Importando planilha, aguarde..." }),
        react_1["default"].createElement(head_1["default"], null,
            react_1["default"].createElement("title", null, "Importa\u00E7\u00E3o planilhas")),
        react_1["default"].createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "listas" },
            react_1["default"].createElement("div", { className: "grid grid-cols-3 gap-4 h-screen" },
                react_1["default"].createElement("div", { className: "bg-white rounded-lg" },
                    react_1["default"].createElement("div", { className: "mt-2 justify-center flex" },
                        react_1["default"].createElement("span", { className: "text-xl", style: { marginLeft: '5%' } }, "IMPORTA\u00C7\u00C3O DE PLANILHAS")),
                    react_1["default"].createElement("hr", null),
                    react_1["default"].createElement(material_1.Box, { sx: { width: '100%' } },
                        react_1["default"].createElement(material_1.Box, { sx: { borderBottom: 1, borderColor: 'divider' } },
                            react_1["default"].createElement(material_1.Tabs, { value: value, onChange: handleChange, "aria-label": "basic tabs example", variant: "fullWidth" },
                                react_1["default"].createElement(material_1.Tab, __assign({ label: "Pesquisa" }, a11yProps(0))),
                                react_1["default"].createElement(material_1.Tab, __assign({ label: "Equipe de dados" }, a11yProps(1))))),
                        react_1["default"].createElement(TabPanel, { value: value, index: 0 },
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: "h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(0, ''); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Cadastros RD"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-0", name: "inputFile-0" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(26, 'ASSAY_LIST'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Lista de Ensaio"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-26", name: "inputFile-26" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-24 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', bgColor: bgColor, rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(22, 'EXPERIMENT'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Subs. de gen\u00F3tipo/nca Ensaio"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-22", name: "inputFile-22" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', bgColor: bgColor, rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(22, 'EXPERIMENT'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Lista de Experimento"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-22", name: "inputFile-22" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', bgColor: bgColor, rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(22, 'EXPERIMENT'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Subs. de gen\u00F3tipo/nca Experimento"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-22", name: "inputFile-22" }))),
                            react_1["default"].createElement("div", { className: "h-10" })),
                        react_1["default"].createElement(TabPanel, { value: value, index: 1 },
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: "h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(7, 'DELIMITATION'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Delineamento"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-7", name: "inputFile-7" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(14, 'NPE'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar NPE"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-14", name: "inputFile-14" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(5, 'BLOCK_LAYOUT'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Layout de quadra"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-5", name: "inputFile-5" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(17, 'BLOCK'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Quadra"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-17", name: "inputFile-17" }))),
                            react_1["default"].createElement("div", { className: "m-4 grid grid-cols-3 mt-10 gap-4 h-20 items-center" },
                                react_1["default"].createElement("div", { className: " h-20 w-20 flex items-center mr-1" },
                                    react_1["default"].createElement(components_1.Button, { textColor: "white", bgColor: bgColor, title: disabledButton
                                            ? 'Outra planilha já esta sendo importada'
                                            : 'Upload', rounder: "rounded-md rounded-bl-full rounded-br-full rounded-tr-full rounded-tl-full", onClick: function () { return readExcel(31, 'ALLOCATION'); }, icon: react_1["default"].createElement(io_1.IoIosCloudUpload, { size: 40 }), disabled: disabledButton, type: "button" })),
                                react_1["default"].createElement("div", { className: "col-span-2", style: { marginLeft: '-12%' } },
                                    react_1["default"].createElement("span", { className: "font-bold" }, "Importar Aloca\u00E7\u00E3o de Quadra"),
                                    react_1["default"].createElement("p", null, "ultimo update 28/06/22"),
                                    react_1["default"].createElement(components_1.Input, { type: "file", required: true, id: "inputFile-31", name: "inputFile-31" })))))),
                react_1["default"].createElement("div", { className: "bg-white rounded-lg col-span-2" },
                    react_1["default"].createElement("div", { className: "mt-2 justify-center flex" },
                        react_1["default"].createElement("span", { className: "text-xl", style: { marginLeft: '5%' } }, "HIST\u00D3RICO DE IMPORTA\u00C7\u00D5ES")),
                    react_1["default"].createElement("hr", null),
                    react_1["default"].createElement(components_1.AccordionFilter, { title: "Filtrar log de importa\u00E7\u00E3o" },
                        react_1["default"].createElement("div", { className: "w-full flex gap-2" },
                            react_1["default"].createElement("form", { className: "flex flex-col\n                      w-full\n                      items-center\n                      px-2\n                      bg-white\n                    ", onSubmit: formik.handleSubmit },
                                react_1["default"].createElement("div", { className: "w-full h-full\n                      flex\n                      justify-center\n                      pb-0\n                    " },
                                    filterFieldFactory('filterUser', 'Usuário'),
                                    filterFieldFactory('filterTable', 'Tabela'),
                                    react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-4" },
                                        react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "De:"),
                                        react_1["default"].createElement(components_1.Input, { type: "date", id: "filterStartDate", name: "filterStartDate", onChange: formik.handleChange })),
                                    react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-4" },
                                        react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "At\u00E9:"),
                                        react_1["default"].createElement(components_1.Input, { type: "date", id: "filterEndDate", name: "filterEndDate", onChange: formik.handleChange })),
                                    filterFieldFactory('filterState', 'Status'),
                                    react_1["default"].createElement("div", { style: { width: 40 } }),
                                    react_1["default"].createElement("div", { className: "h-7 w-32 mt-6" },
                                        react_1["default"].createElement(components_1.Button, { onClick: function () { }, value: "Filtrar", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                    react_1["default"].createElement("div", { style: { marginTop: '1%' }, className: "w-full h-auto overflow-y-scroll" },
                        react_1["default"].createElement(material_table_1["default"], { style: { background: '#f9fafb' }, columns: columns, data: logs, options: {
                                showTitle: false,
                                headerStyle: {
                                    zIndex: 20
                                },
                                rowStyle: { background: '#f9fafb', height: 35 },
                                search: false,
                                filtering: false,
                                pageSize: itensPerPage
                            }, components: {
                                Toolbar: function () { return (react_1["default"].createElement("div", { className: "w-full max-h-96 flex items-center justify-between gap-4 bg-gray-50 py-2 px-5 border-solid border-b border-gray-200" },
                                    react_1["default"].createElement("div", null),
                                    react_1["default"].createElement("strong", { className: "text-blue-600" },
                                        "Total registrado:",
                                        ' ',
                                        itemsTotal),
                                    react_1["default"].createElement("div", { className: "h-full flex items-center gap-2" },
                                        react_1["default"].createElement("div", { className: "border-solid border-2 border-blue-600 rounded" },
                                            react_1["default"].createElement("div", { className: "w-72" },
                                                react_1["default"].createElement(components_1.AccordionFilter, { title: "Gerenciar Campos", grid: statusAccordion },
                                                    react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                                        react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (react_1["default"].createElement("ul", __assign({ className: "w-full h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                            react_1["default"].createElement("div", { className: "h-8 mb-3" },
                                                                react_1["default"].createElement(components_1.Button, { value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", onClick: getValuesColumns, icon: react_1["default"].createElement(io5_1.IoReloadSharp, { size: 20 }) })),
                                                            generatesProps.map(function (genarate, index) { return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(genarate.title), index: index }, function (provider) {
                                                                var _a;
                                                                return (react_1["default"].createElement("li", __assign({ ref: provider.innerRef }, provider.draggableProps, provider.dragHandleProps),
                                                                    react_1["default"].createElement(components_1.CheckBox, { name: genarate.name, title: (_a = genarate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: genarate.value, defaultChecked: camposGerenciados.includes(genarate.value) })));
                                                            })); }),
                                                            provided.placeholder)); }))))),
                                        react_1["default"].createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                            react_1["default"].createElement(components_1.Button, { title: "Exportar planilha de logs", icon: react_1["default"].createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                    downloadExcel();
                                                } }))))); },
                                Pagination: function (props) { return (react_1["default"].createElement("div", __assign({ className: "flex h-20 gap-2 pr-2 py-5 bg-gray-50" }, props),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                    Array(1)
                                        .fill('')
                                        .map(function (value, index) { return (react_1["default"].createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages }))); }
                            } }))))))
    // )
    );
}
exports["default"] = Import;
exports.getServerSideProps = function (_a) {
    var req = _a.req;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, publicRuntimeConfig, token, idSafra, idCulture, filterApplication, param, urlParameters, requestOptions, _b, allLogs, totalItems, uploadInProcess;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_d = (_c = (_f.sent())) === null || _c === void 0 ? void 0 : _c.response[0]) === null || _d === void 0 ? void 0 : _d.itens_per_page)];
                case 2:
                    itensPerPage = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : 15;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    token = req.cookies.token;
                    idSafra = Number(req.cookies.safraId);
                    idCulture = Number(req.cookies.cultureId);
                    filterApplication = '';
                    param = "skip=0&take=" + itensPerPage;
                    urlParameters = new URL(publicRuntimeConfig.apiUrl + "/log-import");
                    urlParameters.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParameters.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _f.sent(), allLogs = _b.response, totalItems = _b.total;
                    uploadInProcess = 0;
                    allLogs === null || allLogs === void 0 ? void 0 : allLogs.map(function (item) { return (item.status === 2 ? (uploadInProcess = 1) : false); });
                    return [2 /*return*/, {
                            props: {
                                allLogs: allLogs,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                uploadInProcess: uploadInProcess,
                                idSafra: idSafra,
                                idCulture: idCulture
                            }
                        }];
            }
        });
    });
};
