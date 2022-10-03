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
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
var cookies_next_1 = require("cookies-next");
var formik_1 = require("formik");
var material_table_1 = require("material-table");
var config_1 = require("next/config");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_1 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var bi_1 = require("react-icons/bi");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var ri_1 = require("react-icons/ri");
var sweetalert2_1 = require("sweetalert2");
var XLSX = require("xlsx");
var bs_1 = require("react-icons/bs");
var user_preference_controller_1 = require("../../../../controllers/user-preference.controller");
var services_1 = require("../../../../services");
var experiment_service_1 = require("../../../../services/experiment.service");
var components_1 = require("../../../../components");
var dropdown_1 = require("../../../../shared/utils/dropdown");
var helpers_1 = require("../../../../helpers");
function Listagem(_a) {
    var _this = this;
    var allExperiments = _a.allExperiments, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, idSafra = _a.idSafra, pageBeforeEdit = _a.pageBeforeEdit, filterBeforeEdit = _a.filterBeforeEdit, typeOrderServer = _a.typeOrderServer, orderByserver = _a.orderByserver, cultureId = _a.cultureId;
    var TabsDropDowns = dropdown_1["default"].TabsDropDowns;
    var tabsDropDowns = TabsDropDowns('listas');
    tabsDropDowns.map(function (tab) { return (tab.titleTab === 'EXPERIMENTOS'
        ? (tab.statusTab = true)
        : (tab.statusTab = false)); });
    var userLogado = JSON.parse(localStorage.getItem('user'));
    var preferences = userLogado.preferences.experimento || {
        id: 0,
        table_preferences: 'id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action'
    };
    var _b = react_1.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var router = router_1.useRouter();
    var _c = react_1.useState(function () { return (allExperiments); }), experimentos = _c[0], setExperimento = _c[1];
    var _d = react_1.useState(Number(pageBeforeEdit)), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = react_1.useState(filterBeforeEdit), filter = _e[0], setFilter = _e[1];
    var _f = react_1.useState(totalItems || 0), itemsTotal = _f[0], setTotalItems = _f[1];
    var _g = react_1.useState(1), orderList = _g[0], setOrder = _g[1];
    var _h = react_1.useState(''), arrowOrder = _h[0], setArrowOrder = _h[1];
    var _j = react_1.useState(false), statusAccordion = _j[0], setStatusAccordion = _j[1];
    var _k = react_1.useState(function () { return [
        // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
        { name: 'CamposGerenciados[]', title: 'Foco', value: 'foco' },
        { name: 'CamposGerenciados[]', title: 'Ensaio', value: 'type_assay' },
        { name: 'CamposGerenciados[]', title: 'GLI', value: 'gli' },
        {
            name: 'CamposGerenciados[]',
            title: 'Nome do experimento',
            value: 'experimentName'
        },
        { name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia' },
        { name: 'CamposGerenciados[]', title: 'Época', value: 'period' },
        {
            name: 'CamposGerenciados[]',
            title: 'Delineamento',
            value: 'delineamento'
        },
        { name: 'CamposGerenciados[]', title: 'Rep.', value: 'repetitionsNumber' },
        { name: 'CamposGerenciados[]', title: 'Status EXP.', value: 'status' },
        { name: 'CamposGerenciados[]', title: 'Ações', value: 'action' },
    ]; }), generatesProps = _k[0], setGeneratesProps = _k[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _l = react_1.useState(''), orderType = _l[0], setOrderType = _l[1];
    var _m = react_1.useState(''), colorStar = _m[0], setColorStar = _m[1];
    var _o = react_1.useState(''), order = _o[0], setOrderParams = _o[1];
    var take = itensPerPage;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _p = react_1.useState(orderByserver), orderBy = _p[0], setOrderBy = _p[1];
    var _q = react_1.useState(typeOrderServer), typeOrder = _q[0], setTypeOrder = _q[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + (orderBy == 'tecnologia' ? 'assay_list.tecnologia.cod_tec' : orderBy) + "&typeOrder=" + typeOrder;
    var _r = react_1.useState(filterBeforeEdit), filtersParams = _r[0], setFiltersParams = _r[1]; // Set filter Parameter
    var _s = react_1.useState(function () { return [
        {
            name: 'StatusCheckbox',
            title: 'IMPORTADO ',
            value: 'importado',
            defaultChecked: function () { return camposGerenciados.includes('importado'); }
        },
        {
            name: 'StatusCheckbox',
            title: 'SORTEADO',
            value: 'sorteado',
            defaultChecked: function () { return camposGerenciados.includes('sorteado'); }
        },
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
    ]; }), statusFilter = _s[0], setStatusFilter = _s[1];
    var formik = formik_1.useFormik({
        initialValues: {
            filterFoco: checkValue('filterFoco'),
            filterTypeAssay: checkValue('filterTypeAssay'),
            filterGli: checkValue('filterGli'),
            filterExperimentName: checkValue('filterExperimentName'),
            filterTecnologia: checkValue('filterTecnologia'),
            filterCod: checkValue('filterCod'),
            filterPeriod: checkValue('filterPeriod'),
            filterDelineamento: checkValue('filterDelineamento'),
            filterRepetition: checkValue('filterRepetition'),
            filterRepetitionTo: checkValue('filterRepetitionTo'),
            filterRepetitionFrom: checkValue('filterRepetitionFrom'),
            orderBy: '',
            typeOrder: ''
        },
        onSubmit: function (_a) {
            var filterFoco = _a.filterFoco, filterTypeAssay = _a.filterTypeAssay, filterGli = _a.filterGli, filterExperimentName = _a.filterExperimentName, filterTecnologia = _a.filterTecnologia, filterCod = _a.filterCod, filterPeriod = _a.filterPeriod, filterDelineamento = _a.filterDelineamento, filterRepetition = _a.filterRepetition, filterRepetitionTo = _a.filterRepetitionTo, filterRepetitionFrom = _a.filterRepetitionFrom;
            return __awaiter(_this, void 0, void 0, function () {
                var allCheckBox, selecionados, i, filterStatus, parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            allCheckBox = document.querySelectorAll("input[name='StatusCheckbox']");
                            selecionados = '';
                            for (i = 0; i < allCheckBox.length; i += 1) {
                                if (allCheckBox[i].checked) {
                                    selecionados += allCheckBox[i].value + ",";
                                }
                            }
                            filterStatus = selecionados.substr(0, selecionados.length - 1);
                            parametersFilter = "filterRepetitionTo=" + filterRepetitionTo + "&filterRepetitionFrom=" + filterRepetitionFrom + "&filterFoco=" + filterFoco + "&filterTypeAssay=" + filterTypeAssay + "&filterGli=" + filterGli + "&filterExperimentName=" + filterExperimentName + "&filterTecnologia=" + filterTecnologia + "&filterPeriod=" + filterPeriod + "&filterRepetition=" + filterRepetition + "&filterDelineamento=" + filterDelineamento + "&idSafra=" + idSafra + "&filterCod=" + filterCod + "&filterStatus=" + filterStatus + "&id_culture=" + cultureId;
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
                        return [4 /*yield*/, experiment_service_1.experimentService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || (response.status === 400 && response.total == 0)) {
                                    setExperimento(response.response);
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
    function headerTableFactory(name, title) {
        return {
            title: (React.createElement("div", { className: "flex items-center" },
                React.createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: true
        };
    }
    // function idHeaderFactory() {
    //   return {
    //     title: (
    //       <div className="flex items-center">
    //         {arrowOrder}
    //       </div>
    //     ),
    //     field: 'id',
    //     width: 0,
    //     sorting: false,
    //     render: () => (
    //       colorStar === '#eba417'
    //         ? (
    //           <div className="h-7 flex">
    //             <div>
    //               <button
    //                 type="button"
    //                 className="w-full h-full flex items-center justify-center border-0"
    //                 onClick={() => setColorStar('')}
    //               >
    //                 <AiTwotoneStar size={20} color="#eba417" />
    //               </button>
    //             </div>
    //           </div>
    //         )
    //         : (
    //           <div className="h-7 flex">
    //             <div>
    //               <button
    //                 type="button"
    //                 className="w-full h-full flex items-center justify-center border-0"
    //                 onClick={() => setColorStar('#eba417')}
    //               >
    //                 <AiTwotoneStar size={20} />
    //               </button>
    //             </div>
    //           </div>
    //         )
    //     ),
    //   };
    // }
    function deleteItem(id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, experiment_service_1.experimentService.deleted({ id: id, userId: userLogado.id })];
                    case 1: return [4 /*yield*/, _b.sent()];
                    case 2:
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
    function statusHeaderFactory() {
        return {
            title: 'Ações',
            field: 'action',
            sorting: false,
            searchable: false,
            render: function (rowData) { return (React.createElement("div", { className: "h-7 flex" },
                React.createElement("div", { className: "h-7" },
                    React.createElement(components_1.Button, { icon: React.createElement(bi_1.BiEdit, { size: 14 }), title: "Atualizar " + rowData.experiment_name, onClick: function () {
                            cookies_next_1.setCookies('pageBeforeEdit', currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies('filterBeforeEdit', filter);
                            cookies_next_1.setCookies('filterBeforeEditTypeOrder', typeOrder);
                            cookies_next_1.setCookies('filterBeforeEditOrderBy', orderBy);
                            cookies_next_1.setCookies('filtersParams', filtersParams);
                            cookies_next_1.setCookies('lastPage', 'atualizar');
                            router.push("/listas/experimentos/experimento/atualizar?id=" + rowData.id);
                        }, bgColor: "bg-blue-600", textColor: "white" })),
                React.createElement("div", { style: { width: 5 } }),
                React.createElement("div", null,
                    React.createElement(components_1.Button, { title: "Deletar " + rowData.experiment_name, icon: React.createElement(bs_1.BsTrashFill, { size: 14 }), onClick: function () { return deleteItem(rowData.id); }, bgColor: "bg-red-600", textColor: "white" })))); }
        };
    }
    function tecnologiaHeaderFactory(name, title) {
        return {
            title: (React.createElement("div", { className: "flex items-center" },
                React.createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: 'tecnologia',
            width: 0,
            sorting: true,
            render: function (rowData) { return (React.createElement("div", { className: "h-10 flex" },
                React.createElement("div", null, rowData.assay_list.tecnologia.cod_tec + " " + rowData.assay_list.tecnologia.name))); }
        };
    }
    function columnsOrder(columnsCampos) {
        var columnCampos = columnsCampos.split(',');
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (_, index) {
            if (columnCampos[index] === 'foco') {
                tableFields.push(headerTableFactory('Foco', 'assay_list.foco.name'));
            }
            if (columnCampos[index] === 'type_assay') {
                tableFields.push(headerTableFactory('Ensaio', 'assay_list.type_assay.name'));
            }
            if (columnCampos[index] === 'gli') {
                tableFields.push(headerTableFactory('GLI', 'assay_list.gli'));
            }
            if (columnCampos[index] === 'tecnologia') {
                tableFields.push(tecnologiaHeaderFactory('Tecnologia', 'tecnologia'));
            }
            if (columnCampos[index] === 'experimentName') {
                tableFields.push(headerTableFactory('Nome experimento', 'experimentName'));
            }
            if (columnCampos[index] === 'period') {
                tableFields.push(headerTableFactory('Época', 'period'));
            }
            if (columnCampos[index] === 'delineamento') {
                tableFields.push(headerTableFactory('Delineamento', 'delineamento.name'));
            }
            if (columnCampos[index] === 'repetitionsNumber') {
                tableFields.push(headerTableFactory('Rep.', 'repetitionsNumber'));
            }
            if (columnCampos[index] === 'status') {
                tableFields.push(headerTableFactory('Status EXP.', 'status'));
            }
            if (columnCampos[index] === 'action') {
                tableFields.push(statusHeaderFactory());
            }
        });
        return tableFields;
    }
    var columns = columnsOrder(camposGerenciados);
    function getValuesColumns() {
        return __awaiter(this, void 0, Promise, function () {
            var els, selecionados, i, totalString, campos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        els = document.querySelectorAll("input[type='checkbox']");
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
                                module_id: 22
                            })
                                .then(function (response) {
                                userLogado.preferences.experimento = {
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
                        userLogado.preferences.experimento = {
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
                case 0: return [4 /*yield*/, experiment_service_1.experimentService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response, message = _a.message;
                        if (status === 200) {
                            response.map(function (item) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                var newItem = item;
                                newItem.SAFRA = (_b = (_a = item.assay_list) === null || _a === void 0 ? void 0 : _a.safra) === null || _b === void 0 ? void 0 : _b.safraName;
                                newItem.FOCO = (_c = item.assay_list) === null || _c === void 0 ? void 0 : _c.foco.name;
                                newItem.TIPO_DE_ENSAIO = (_d = item.assay_list) === null || _d === void 0 ? void 0 : _d.type_assay.name;
                                newItem.TECNOLOGIA = (_e = item.assay_list) === null || _e === void 0 ? void 0 : _e.tecnologia.name;
                                newItem.GLI = (_f = item.assay_list) === null || _f === void 0 ? void 0 : _f.gli;
                                newItem.NOME_DO_EXPERIMENTO = item === null || item === void 0 ? void 0 : item.experimentName;
                                newItem.BGM = (_g = item.assay_list) === null || _g === void 0 ? void 0 : _g.bgm;
                                newItem.STATUS_ENSAIO = (_h = item.assay_list) === null || _h === void 0 ? void 0 : _h.status;
                                newItem.PLANTIO = (_j = newItem.local) === null || _j === void 0 ? void 0 : _j.name_local_culture;
                                newItem.DELINEAMENTO = (_k = item.delineamento) === null || _k === void 0 ? void 0 : _k.name;
                                newItem.REPETIÇÃO = (_l = item.delineamento) === null || _l === void 0 ? void 0 : _l.repeticao;
                                newItem.DENSIDADE = item === null || item === void 0 ? void 0 : item.density;
                                newItem.NÚMERO_DE_REPETIÇÕES = item.repetitionsNumber;
                                newItem.ÉPOCA = item === null || item === void 0 ? void 0 : item.period;
                                newItem.ORDEM_SORTEIO = item === null || item === void 0 ? void 0 : item.orderDraw;
                                newItem.NLP = item === null || item === void 0 ? void 0 : item.nlp;
                                newItem.CLP = item === null || item === void 0 ? void 0 : item.clp;
                                newItem.EEL = item === null || item === void 0 ? void 0 : item.eel;
                                newItem.OBSERVAÇÕES = item === null || item === void 0 ? void 0 : item.comments;
                                newItem.COUNT_NT = newItem.countNT;
                                newItem.NPE_QT = newItem.npeQT;
                                delete newItem.experimentGroupId;
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
                                delete newItem.assay_list;
                                return newItem;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(response);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, 'experimentos');
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
                            XLSX.writeFile(workBook, 'Experimentos.xlsx');
                        }
                        else {
                            sweetalert2_1["default"].fire(message);
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
                    // // manage using comman function
                    // const { parametersFilter, currentPages } = await fetchWrapper.handlePaginationGlobal(currentPage, take, filtersParams);
                    // await experimentService.getAll(`${parametersFilter}&idSafra=${idSafra}`).then(({ status, response }: any) => {
                    //   if (status === 200) {
                    //     setExperimento(response);
                    //     // setFiltersParams(parametersFilter);
                    //     // setTotalItems(response.total); //Set new total records
                    //     // setCurrentPage(currentPages); //Set new current page
                    //     setTimeout(removestate, 10000); // Remove State
                    //   }
                    // });
                    return [4 /*yield*/, callingApi(filter)];
                    case 1:
                        // // manage using comman function
                        // const { parametersFilter, currentPages } = await fetchWrapper.handlePaginationGlobal(currentPage, take, filtersParams);
                        // await experimentService.getAll(`${parametersFilter}&idSafra=${idSafra}`).then(({ status, response }: any) => {
                        //   if (status === 200) {
                        //     setExperimento(response);
                        //     // setFiltersParams(parametersFilter);
                        //     // setTotalItems(response.total); //Set new total records
                        //     // setCurrentPage(currentPages); //Set new current page
                        //     setTimeout(removestate, 10000); // Remove State
                        //   }
                        // });
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
        // localStorage.removeItem('orderSorting');
    }, [currentPage]);
    function filterFieldFactory(title, name) {
        return (React.createElement("div", { className: "h-7 w-full ml-4" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            React.createElement(components_1.Input, { type: "text", placeholder: name, max: "40", id: title, name: title, defaultValue: checkValue(title), onChange: formik.handleChange })));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "Listagem de experimentos")),
        React.createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "listas" },
            React.createElement("main", { className: "h-full w-full\n                        flex flex-col\n                        items-start\n                        gap-4\n                        " },
                React.createElement(components_1.AccordionFilter, { title: "Filtrar experimentos" },
                    React.createElement("div", { className: "w-full flex gap-2" },
                        React.createElement("form", { className: "flex flex-col\n                                    w-full\n                                    items-center\n                                    px-4\n                                    bg-white\n                                    ", onSubmit: formik.handleSubmit },
                            React.createElement("div", { className: "w-full h-full\n                                        flex\n                                        justify-center\n                                        pb-8\n                                        " },
                                filterFieldFactory('filterFoco', 'Foco'),
                                filterFieldFactory('filterTypeAssay', 'Ensaio'),
                                filterFieldFactory('filterGli', 'GLI'),
                                filterFieldFactory('filterExperimentName', 'Nome Experimento'),
                                filterFieldFactory('filterCod', 'Cód. Tecnologia')),
                            React.createElement("div", { className: "w-full h-full\n                                        flex\n                                        justify-center\n                                        pb-2\n                                        " },
                                filterFieldFactory('filterTecnologia', 'Nome Tecnologia'),
                                filterFieldFactory('filterPeriod', 'Epoca'),
                                filterFieldFactory('filterDelineamento', 'Delineamento'),
                                React.createElement("div", { className: "h-6 w-full ml-4" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Repeti\u00E7\u00E3o"),
                                    React.createElement("div", { className: "flex" },
                                        React.createElement(components_1.Input, { placeholder: "De", id: "filterRepetitionFrom", name: "filterRepetitionFrom", onChange: formik.handleChange }),
                                        React.createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterRepetitionTo", name: "filterRepetitionTo", onChange: formik.handleChange }))),
                                React.createElement("div", { className: "h-10 w-full ml-4" },
                                    React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status do Experimento"),
                                    React.createElement(components_1.AccordionFilter, null,
                                        React.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleOnDragEnd },
                                            React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "characters" }, function (provided) { return (React.createElement("ul", __assign({ className: "w-1/2 h-full characters" }, provided.droppableProps, { ref: provided.innerRef }),
                                                statusFilter.map(function (generate, index) { return (React.createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (providers) {
                                                    var _a;
                                                    return (React.createElement("li", __assign({ ref: providers.innerRef }, providers.draggableProps, providers.dragHandleProps),
                                                        React.createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: false })));
                                                })); }),
                                                provided.placeholder)); })))),
                                React.createElement("div", { style: { width: 80 } }),
                                React.createElement("div", { className: "h-7 w-32 mt-6" },
                                    React.createElement(components_1.Button, { type: "submit", onClick: function () { }, value: "Filtrar", bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                React.createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    React.createElement(material_table_1["default"], { style: { background: '#f9fafb' }, columns: columns, data: experimentos, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20
                            },
                            rowStyle: { background: '#f9fafb', height: 35 },
                            search: false,
                            filtering: false,
                            pageSize: itensPerPage
                        }, components: {
                            Toolbar: function () { return (React.createElement("div", { className: "w-full max-h-96\n                                                flex\n                                                items-center\n                                                justify-between\n                                                gap-4\n                                                bg-gray-50\n                                                py-2\n                                                px-5\n                                                border-solid border-b\n                                                border-gray-200\n                                            " },
                                React.createElement("div", null),
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
                                                        React.createElement("div", { className: "h-8 mb-3" },
                                                            React.createElement(components_1.Button, { value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", onClick: getValuesColumns, icon: React.createElement(io5_1.IoReloadSharp, { size: 20 }) })),
                                                        generatesProps.map(function (generate, index) { return (React.createElement(react_beautiful_dnd_1.Draggable, { key: index, draggableId: String(generate.title), index: index }, function (provider) {
                                                            var _a;
                                                            return (React.createElement("li", __assign({ ref: provider.innerRef }, provider.draggableProps, provider.dragHandleProps),
                                                                React.createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: camposGerenciados.includes(String(generate.value)) })));
                                                        })); }),
                                                        provided.placeholder)); }))))),
                                    React.createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                        React.createElement(components_1.Button, { title: "Exportar planilha de experimentos", icon: React.createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }))))); },
                            Pagination: function (props) { return (React.createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
                                React.createElement(components_1.Button, { onClick: function () {
                                        setCurrentPage(currentPage - 1);
                                    }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                Array(1)
                                    .fill('')
                                    .map(function (value, index) { return (React.createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600 RR", textColor: "white", icon: React.createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages }))); }
                        } }))))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, token, cultureId, idSafra, pageBeforeEdit, lastPageServer, filterBeforeEdit, filterApplication, typeOrderServer, orderByserver, publicRuntimeConfig, baseUrl, param, urlParameters, requestOptions, _b, allExperiments, totalItems;
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
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
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
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "idSafra=" + idSafra + "&id_culture=" + cultureId;
                    filterApplication = req.cookies.filterBeforeEdit
                        ? "" + req.cookies.filterBeforeEdit
                        : "idSafra=" + idSafra + "&id_culture=" + cultureId;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : 'asc';
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : '';
                    cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                    cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrl = publicRuntimeConfig.apiUrl + "/experiment";
                    param = "skip=0&take=" + itensPerPage + "&idSafra=" + idSafra + "&id_culture=" + cultureId;
                    urlParameters = new URL(baseUrl);
                    urlParameters.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: 'GET',
                        credentials: 'include',
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParameters.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _f.sent(), allExperiments = _b.response, totalItems = _b.total;
                    return [2 /*return*/, {
                            props: {
                                allExperiments: allExperiments,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                idSafra: idSafra,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer,
                                cultureId: cultureId
                            }
                        }];
            }
        });
    });
};
