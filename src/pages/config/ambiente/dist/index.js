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
var router_1 = require("next/router");
var react_1 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var ai_1 = require("react-icons/ai");
var bi_1 = require("react-icons/bi");
var fa_1 = require("react-icons/fa");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var ri_1 = require("react-icons/ri");
var sweetalert2_1 = require("sweetalert2");
var XLSX = require("xlsx");
var cookies_next_1 = require("cookies-next");
var user_preference_controller_1 = require("../../../controllers/user-preference.controller");
var services_1 = require("../../../services");
var components_1 = require("../../../components");
var ITabs = require("../../../shared/utils/dropdown");
var helpers_1 = require("../../../helpers");
function Listagem(_a) {
    var _this = this;
    var allNpe = _a.allNpe, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, filterBeforeEdit = _a.filterBeforeEdit, totalItems = _a.totalItems, typeOrderServer = _a.typeOrderServer, orderByserver = _a.orderByserver, safraId = _a.safraId, idCulture = _a.idCulture;
    var TabsDropDowns = ITabs["default"].TabsDropDowns;
    var tabsDropDowns = TabsDropDowns();
    var router = router_1.useRouter();
    // eslint-disable-next-line no-return-assign, no-param-reassign
    tabsDropDowns.map(function (tab) { return (tab.titleTab === 'AMBIENTE'
        ? (tab.statusTab = true)
        : (tab.statusTab = false)); });
    var userLogado = JSON.parse(localStorage.getItem('user'));
    var preferences = userLogado.preferences.npe || {
        id: 0,
        table_preferences: 'id,safra,foco,ensaio,tecnologia,local,npei,epoca,prox_npe,status'
    };
    var _b = react_1.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var _c = react_1.useState(allNpe), npe = _c[0], setNPE = _c[1];
    var _d = react_1.useState(0), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = react_1.useState(1), orderList = _e[0], setOrder = _e[1];
    var _f = react_1.useState(''), arrowOrder = _f[0], setArrowOrder = _f[1];
    var _g = react_1.useState(filterApplication), filter = _g[0], setFilter = _g[1];
    var _h = react_1.useState(totalItems), itemsTotal = _h[0], setTotalItems = _h[1];
    var _j = react_1.useState(false), statusAccordion = _j[0], setStatusAccordion = _j[1];
    var _k = react_1.useState(''), colorStar = _k[0], setColorStar = _k[1];
    var _l = react_1.useState(function () { return [
        // {
        //   name: 'CamposGerenciados[]',
        //   title: 'Favorito ',
        //   value: 'id',
        //   defaultChecked: () => camposGerenciados.includes('id'),
        // },
        {
            name: 'CamposGerenciados[]',
            title: 'Safra ',
            value: 'safra',
            defaultChecked: function () { return camposGerenciados.includes('safra'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Foco ',
            value: 'foco',
            defaultChecked: function () { return camposGerenciados.includes('foco'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Ensaio ',
            value: 'ensaio',
            defaultChecked: function () { return camposGerenciados.includes('ensaio'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Nome tec.',
            value: 'tecnologia',
            defaultChecked: function () { return camposGerenciados.includes('tecnologia'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Lugar cultura',
            value: 'local',
            defaultChecked: function () { return camposGerenciados.includes('local'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Epoca ',
            value: 'epoca',
            defaultChecked: function () { return camposGerenciados.includes('epoca'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'NPE Inicial ',
            value: 'npei',
            defaultChecked: function () { return camposGerenciados.includes('npei'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Prox NPE ',
            value: 'prox_npe',
            defaultChecked: function () { return camposGerenciados.includes('prox_npe'); }
        },
        {
            name: 'CamposGerenciados[]',
            title: 'Status',
            value: 'status',
            defaultChecked: function () { return camposGerenciados.includes('status'); }
        },
    ]; }), generatesProps = _l[0], setGeneratesProps = _l[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _m = react_1.useState(''), orderType = _m[0], setOrderType = _m[1];
    var take = itensPerPage;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _o = react_1.useState(filterBeforeEdit), filtersParams = _o[0], setFiltersParams = _o[1]; // Set filter Parameter
    var _p = react_1.useState(orderByserver), orderBy = _p[0], setOrderBy = _p[1];
    var _q = react_1.useState(typeOrderServer), typeOrder = _q[0], setTypeOrder = _q[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    var filters = [
        { id: 2, name: 'Todos' },
        { id: 1, name: 'Ativos' },
        { id: 0, name: 'Inativos' },
    ];
    var filterStatusBeforeEdit = filterApplication.split('');
    var formik = formik_1.useFormik({
        initialValues: {
            filterStatus: filterStatusBeforeEdit[13],
            filterLocal: checkValue('filterLocal'),
            filterSafra: checkValue('filterSafra'),
            filterFoco: checkValue('filterFoco'),
            filterEnsaio: checkValue('filterEnsaio'),
            filterTecnologia: checkValue('filterTecnologia'),
            filterCodTecnologia: checkValue('filterCodTecnologia'),
            filterEpoca: checkValue('filterEpoca'),
            filterNPE: checkValue('filterNPE'),
            filterNpeTo: checkValue('filterNpeTo'),
            filterNpeFrom: checkValue('filterNpeFrom'),
            orderBy: '',
            typeOrder: ''
        },
        onSubmit: function (_a) {
            var filterStatus = _a.filterStatus, filterLocal = _a.filterLocal, filterSafra = _a.filterSafra, filterFoco = _a.filterFoco, filterEnsaio = _a.filterEnsaio, filterTecnologia = _a.filterTecnologia, filterCodTecnologia = _a.filterCodTecnologia, filterEpoca = _a.filterEpoca, filterNPE = _a.filterNPE, filterNpeTo = _a.filterNpeTo, filterNpeFrom = _a.filterNpeFrom, filterNpeFinalTo = _a.filterNpeFinalTo, filterNpeFinalFrom = _a.filterNpeFinalFrom;
            return __awaiter(_this, void 0, void 0, function () {
                var parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            parametersFilter = "filterStatus=" + (filterStatus || 1) + "&filterNpeTo=" + filterNpeTo + "&filterCodTecnologia=" + filterCodTecnologia + "&filterNpeFrom=" + filterNpeFrom + "&filterLocal=" + filterLocal + "&filterFoco=" + filterFoco + "&filterEnsaio=" + filterEnsaio + "&filterTecnologia=" + filterTecnologia + "&filterEpoca=" + filterEpoca + "&filterNPE=" + filterNPE + "&id_culture=" + idCulture + "&id_safra=" + safraId;
                            // &id_safra=${safraId}
                            // await npeService
                            //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
                            //   .then((response) => {
                            //     setFilter(parametersFilter);
                            //     setNPE(response.response);
                            //     setTotalItems(response.total);
                            //     setCurrentPage(0);
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
                        cookies_next_1.setCookies('filterBeforeEdit', parametersFilter);
                        cookies_next_1.setCookies('filterBeforeEditTypeOrder', typeOrder);
                        cookies_next_1.setCookies('filterBeforeEditOrderBy', orderBy);
                        parametersFilter = parametersFilter + "&" + pathExtra;
                        setFiltersParams(parametersFilter);
                        cookies_next_1.setCookies('filtersParams', parametersFilter);
                        return [4 /*yield*/, services_1.npeService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setNPE(response.response);
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
                    React.createElement("button", { className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar(''); } },
                        React.createElement(ai_1.AiTwotoneStar, { size: 20, color: "#eba417" }))))) : (React.createElement("div", { className: "h-9 flex" },
                React.createElement("div", null,
                    React.createElement("button", { className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar('#eba417'); } },
                        React.createElement(ai_1.AiTwotoneStar, { size: 20 })))))); }
        };
    }
    function statusHeaderFactory() {
        var _this = this;
        return {
            title: 'Ação',
            field: 'status',
            sorting: false,
            searchable: false,
            filterPlaceholder: 'Filtrar por status',
            render: function (rowData) { return (React.createElement("div", { className: "h-7 flex" },
                React.createElement("div", { className: "h-7" },
                    React.createElement(components_1.Button, { icon: React.createElement(bi_1.BiEdit, { size: 14 }), bgColor: rowData.edited == 1 ? 'bg-blue-900' : 'bg-blue-600', textColor: "white", title: "Editar", onClick: function () {
                            cookies_next_1.setCookies('pageBeforeEdit', currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies('filterBeforeEdit', filter);
                            cookies_next_1.setCookies('filterBeforeEditTypeOrder', typeOrder);
                            cookies_next_1.setCookies('filterBeforeEditOrderBy', orderBy);
                            cookies_next_1.setCookies('filtersParams', filtersParams);
                            cookies_next_1.setCookies('lastPage', 'atualizar');
                            router.push("/config/ambiente/atualizar?id=" + rowData.id);
                        } })),
                React.createElement("div", { style: { width: 5 } }),
                rowData.status == 1 || rowData.status == 3 ? (React.createElement("div", null,
                    React.createElement(components_1.Button, { title: rowData.status == 3 ? '' : 'Ativo', icon: React.createElement(fa_1.FaRegThumbsUp, { size: 14 }), onClick: function () { return handleStatus(rowData.id, __assign({ status: rowData.status }, rowData)); }, bgColor: rowData.status == 3 ? 'bg-gray-400' : 'bg-green-600', textColor: "white", disabled: rowData.status == 3 }))) : (React.createElement("div", { className: "h-7 flex" },
                    React.createElement("div", { className: "h-7" }),
                    React.createElement("div", null,
                        React.createElement(components_1.Button, { title: "Inativo", icon: React.createElement(fa_1.FaRegThumbsDown, { size: 14 }), onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, handleStatus(rowData.id, __assign({ status: rowData.status }, rowData))];
                                });
                            }); }, bgColor: "bg-red-800", textColor: "white" })))))); }
        };
    }
    function tecnologiaHeaderFactory(title, name) {
        return {
            title: (React.createElement("div", { className: "flex items-center" },
                React.createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, title))),
            field: 'tecnologia',
            width: 0,
            sorting: true,
            render: function (rowData) { return (React.createElement("div", { className: "h-10 flex" },
                React.createElement("div", null, rowData.tecnologia.cod_tec + " " + rowData.tecnologia.name))); }
        };
    }
    function colums(camposGerenciados) {
        var columnCampos = camposGerenciados.split(',');
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (item) {
            // if (columnCampos[item] === 'id') {
            //   tableFields.push(idHeaderFactory());
            // }
            if (columnCampos[item] === 'local') {
                tableFields.push(headerTableFactory('Lugar cultura', 'local.name_local_culture'));
            }
            if (columnCampos[item] === 'safra') {
                tableFields.push(headerTableFactory('Safra', 'safra.safraName'));
            }
            if (columnCampos[item] === 'foco') {
                tableFields.push(headerTableFactory('Foco', 'foco.name'));
            }
            if (columnCampos[item] === 'ensaio') {
                tableFields.push(headerTableFactory('Ensaio', 'type_assay.name'));
            }
            // if (columnCampos[item] === 'tecnologia') {
            //   tableFields.push(headerTableFactory('Nome tec.', 'tecnologia.name'));
            // }
            if (columnCampos[item] === 'tecnologia') {
                tableFields.push(tecnologiaHeaderFactory('Tecnologia', 'tecnologia'));
            }
            if (columnCampos[item] === 'epoca') {
                tableFields.push(headerTableFactory('Epoca', 'epoca'));
            }
            if (columnCampos[item] === 'npei') {
                tableFields.push(headerTableFactory('NPE Inicial', 'npei'));
            }
            if (columnCampos[item] === 'group') {
                tableFields.push(headerTableFactory('Grupo', 'group.group'));
            }
            if (columnCampos[item] === 'prox_npe') {
                tableFields.push(headerTableFactory('Prox NPE', 'prox_npe'));
            }
            if (columnCampos[item] === 'status') {
                tableFields.push(statusHeaderFactory());
            }
        });
        return tableFields;
    }
    var columns = colums(camposGerenciados);
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
                                module_id: 5
                            })
                                .then(function (response) {
                                userLogado.preferences.npe = {
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
                        userLogado.preferences.layout_quadra = {
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
    function handleStatus(idNPE, data) {
        return __awaiter(this, void 0, Promise, function () {
            var parametersFilter, index_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parametersFilter = "filterStatus=" + 1 + "&safraId=" + data.safraId + "&id_foco=" + data.id_foco + "&id_ogm=" + data.id_ogm + "&id_type_assay=" + data.id_type_assay + "&epoca=" + String(data.epoca);
                        if (!(data.status == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, services_1.npeService.getAll(parametersFilter).then(function (response) {
                                if (response.total > 0) {
                                    sweetalert2_1["default"].fire('NPE não pode ser atualizada pois já existe uma npei cadastrada com essas informações');
                                    router.push('');
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (data.status === 0) {
                            data.status = 1;
                        }
                        else {
                            data.status = 0;
                        }
                        return [4 /*yield*/, services_1.npeService.update({ id: idNPE, status: data.status })];
                    case 3:
                        _a.sent();
                        index_1 = npe.findIndex(function (npe) { return npe.id === idNPE; });
                        if (index_1 === -1) {
                            return [2 /*return*/];
                        }
                        setNPE(function (oldSafra) {
                            var copy = __spreadArrays(oldSafra);
                            copy[index_1].status = data.status;
                            return copy;
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
                case 0: return [4 /*yield*/, services_1.npeService.getAll(filter).then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (row) {
                                var _a, _b, _c, _d, _e;
                                delete row.avatar;
                                if (row.status === 0) {
                                    row.status = 'Inativo';
                                }
                                else {
                                    row.status = 'Ativo';
                                }
                                row.SAFRA = (_a = row.safra) === null || _a === void 0 ? void 0 : _a.safraName;
                                row.FOCO = (_b = row.foco) === null || _b === void 0 ? void 0 : _b.name;
                                row.TIPO_ENSAIO = (_c = row.type_assay) === null || _c === void 0 ? void 0 : _c.name;
                                row.TECNOLOGIA = (_d = row.tecnologia) === null || _d === void 0 ? void 0 : _d.name;
                                row.LOCAL = (_e = row.local) === null || _e === void 0 ? void 0 : _e.name_local_culture;
                                row.NPEI = row.npei;
                                row.ÉPOCA = row === null || row === void 0 ? void 0 : row.epoca;
                                row.GRUPO = row.group.group;
                                row.NEXT_AVAILABLE_NPE = row === null || row === void 0 ? void 0 : row.nextAvailableNPE;
                                row.PROX_NPE = row.prox_npe;
                                row.STATUS = row.status;
                                delete row.nextAvailableNPE;
                                delete row.prox_npe;
                                delete row.edited;
                                delete row.local;
                                delete row.safra;
                                delete row.foco;
                                delete row.epoca;
                                delete row.tecnologia;
                                delete row.type_assay;
                                delete row.group;
                                delete row.npei;
                                delete row.status;
                                delete row.nextNPE;
                                delete row.npeQT;
                                delete row.localId;
                                delete row.safraId;
                                delete row.npef;
                                delete row.id;
                                return row;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(newData);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, 'npe');
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
                            XLSX.writeFile(workBook, 'NPE.xlsx');
                        }
                        else {
                            sweetalert2_1["default"].fire('Não existem registros para serem exportados, favor checar.');
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
                    // await npeService.getAll(parametersFilter).then(({ status, response }) => {
                    //   if (status === 200) {
                    //     setNPE(response);
                    //   }
                    // });
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
                        // await npeService.getAll(parametersFilter).then(({ status, response }) => {
                        //   if (status === 200) {
                        //     setNPE(response);
                        //   }
                        // });
                        _a.sent(); // handle pagination globly
                        return [2 /*return*/];
                }
            });
        });
    }
    function filterFieldFactory(title, name) {
        return (React.createElement("div", { className: "h-4 w-1/4 ml-2" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            React.createElement(components_1.Input, { type: "text", placeholder: name, defaultValue: checkValue(title), max: "40", id: title, name: title, onChange: formik.handleChange })));
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
            React.createElement("title", null, "Listagem dos Ambientes")),
        React.createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "config" },
            React.createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                React.createElement(components_1.AccordionFilter, { title: "Filtrar ambiente" },
                    React.createElement("div", { className: "w-full flex gap-2" },
                        React.createElement("form", { className: "flex flex-col\n                  w-full\n                  items-center\n                  px-4\n                  bg-white\n                ", onSubmit: formik.handleSubmit },
                            React.createElement("div", { className: "w-full h-full flex justify-center pb-0" },
                                React.createElement("div", { className: "h-6 w-1/4 ml-0" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status"),
                                    React.createElement(components_1.Select, { name: "filterStatus", onChange: formik.handleChange, defaultValue: filterStatusBeforeEdit[13], 
                                        // defaultValue={checkValue('filterStatus')}
                                        values: filters.map(function (id) { return id; }), selected: "1" })),
                                filterFieldFactory('filterSafra', 'Safra'),
                                filterFieldFactory('filterFoco', 'Foco'),
                                filterFieldFactory('filterEnsaio', 'Ensaio'),
                                filterFieldFactory('filterCodTecnologia', 'Cód. Tec.'),
                                filterFieldFactory('filterTecnologia', 'Nome Tec.'),
                                filterFieldFactory('filterLocal', 'Lugar cultura'),
                                filterFieldFactory('filterEpoca', 'Epoca'),
                                React.createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "NPE Inicial"),
                                    React.createElement("div", { className: "flex" },
                                        React.createElement(components_1.Input, { placeholder: "De", id: "filterNpeFrom", name: "filterNpeFrom", onChange: formik.handleChange, defaultValue: checkValue('filterNpeFrom') }),
                                        React.createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterNpeTo", name: "filterNpeTo", defaultValue: checkValue('filterNpeTo'), onChange: formik.handleChange }))),
                                React.createElement("div", { className: "h-6 w-1/3 ml-2" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Prox NPE"),
                                    React.createElement("div", { className: "flex" },
                                        React.createElement(components_1.Input, { placeholder: "De", id: "filterNpeFinalFrom", name: "filterNpeFinalFrom", onChange: formik.handleChange }),
                                        React.createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterNpeFinalTo", name: "filterNpeFinalTo", onChange: formik.handleChange }))),
                                React.createElement("div", { style: { width: 40 } }),
                                React.createElement("div", { className: "h-7 w-32 mt-6" },
                                    React.createElement(components_1.Button, { onClick: function () { }, value: "Filtrar", bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                React.createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    React.createElement(material_table_1["default"], { style: { background: '#f9fafb' }, columns: columns, data: npe, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20
                            },
                            rowStyle: { background: '#f9fafb', height: 35 },
                            search: false,
                            filtering: false,
                            pageSize: itensPerPage
                        }, components: {
                            Toolbar: function () { return (React.createElement("div", { className: "w-full max-h-max\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                React.createElement("div", null),
                                React.createElement("strong", { className: "text-blue-600" },
                                    "Total registrado:",
                                    ' ',
                                    itemsTotal),
                                React.createElement("div", { className: "h-full flex items-center gap-2\n                    " },
                                    React.createElement("div", { className: "border-solid border-2 border-blue-600 rounded" },
                                        React.createElement("div", { className: "w-64" },
                                            React.createElement(components_1.AccordionFilter, { title: "Gerenciar Campos", grid: statusAccordion },
                                                React.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                                    React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (React.createElement("ul", __assign({ className: "w-full h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                        React.createElement("div", { className: "h-8 mb-3" },
                                                            React.createElement(components_1.Button, { value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", onClick: getValuesColumns, icon: React.createElement(io5_1.IoReloadSharp, { size: 20 }) })),
                                                        generatesProps.map(function (generate, index) { return (React.createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (provided) {
                                                            var _a;
                                                            return (React.createElement("li", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                                                                React.createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: camposGerenciados.includes(generate.value) })));
                                                        })); }),
                                                        provided.placeholder)); }))))),
                                    React.createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                        React.createElement(components_1.Button, { title: "Exportar planilha de NPE", icon: React.createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }),
                                        React.createElement("div", { style: { width: 20 } }),
                                        React.createElement(components_1.Button, { title: "Configurar Importa\u00E7\u00E3o de Planilha", icon: React.createElement(ri_1.RiSettingsFill, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () { }, href: "npe/importar-planilha/config-planilha" }))))); },
                            Pagination: function (props) { return (React.createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
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
        var PreferencesControllers, itensPerPage, safraId, idCulture, token, lastPageServer, typeOrderServer, orderByserver, filterBeforeEdit, publicRuntimeConfig, baseUrl, filterApplication, param, urlParameters, requestOptions, _b, _c, allNpe, _d, totalItems;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_f = (_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.response[0]) === null || _f === void 0 ? void 0 : _f.itens_per_page)];
                case 2:
                    itensPerPage = (_g.sent()) || 10;
                    safraId = req.cookies.safraId;
                    idCulture = req.cookies.cultureId;
                    token = req.cookies.token;
                    lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';
                    if (lastPageServer == undefined || lastPageServer == 'No') {
                        cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                        cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                        cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                        cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                        cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    }
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : '';
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : '';
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "filterStatus=1&id_culture=" + idCulture + "&id_safra=" + safraId;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrl = publicRuntimeConfig.apiUrl + "/npe";
                    filterApplication = req.cookies.filterBeforeEdit
                        ? "" + req.cookies.filterBeforeEdit
                        : "filterStatus=1&id_culture=" + idCulture + "&id_safra=" + safraId;
                    // id_culture=${idCulture}&id_safra=${safraId}
                    cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                    cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    param = "skip=0&take=" + itensPerPage + "&filterStatus=1&id_culture=" + idCulture + "&id_safra=" + safraId;
                    urlParameters = new URL(baseUrl);
                    urlParameters.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParameters.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _g.sent(), _c = _b.response, allNpe = _c === void 0 ? [] : _c, _d = _b.total, totalItems = _d === void 0 ? 0 : _d;
                    return [2 /*return*/, {
                            props: {
                                allNpe: allNpe,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                filterBeforeEdit: filterBeforeEdit,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer,
                                safraId: safraId,
                                idCulture: idCulture
                            }
                        }];
            }
        });
    });
};
