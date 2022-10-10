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
var react_2 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var bi_1 = require("react-icons/bi");
var ri_1 = require("react-icons/ri");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var XLSX = require("xlsx");
var sweetalert2_1 = require("sweetalert2");
var components_1 = require("../../../components");
var user_preference_controller_1 = require("../../../controllers/user-preference.controller");
var services_1 = require("../../../services");
var ITabs = require("../../../shared/utils/dropdown");
var helpers_1 = require("../../../helpers");
function Listagem(_a) {
    var _this = this;
    var allExperiments = _a.allExperiments, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, experimentGroupId = _a.experimentGroupId, filterApplication = _a.filterApplication, idSafra = _a.idSafra, pageBeforeEdit = _a.pageBeforeEdit, filterBeforeEdit = _a.filterBeforeEdit, idCulture = _a.idCulture, typeOrderServer = _a.typeOrderServer, // RR
    orderByserver = _a.orderByserver;
    var tabsOperation = ITabs["default"].tabsOperation;
    var tabsEtiquetagemMenu = tabsOperation.map(function (i) {
        return i.titleTab === "ETIQUETAGEM" ? __assign(__assign({}, i), { statusTab: true }) : i;
    });
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.experimento || {
        id: 0,
        table_preferences: "id,foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action"
    };
    var tableRef = react_1.useRef(null);
    var _b = react_2.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var _c = react_2.useState([]), experiments = _c[0], setExperiments = _c[1];
    var _d = react_2.useState(false), isOpenModal = _d[0], setIsOpenModal = _d[1];
    var _e = react_2.useState(false), tableMessage = _e[0], setMessage = _e[1];
    var _f = react_2.useState(0), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = react_2.useState(1), orderList = _g[0], setOrder = _g[1];
    var _h = react_2.useState(false), afterFilter = _h[0], setAfterFilter = _h[1];
    var _j = react_2.useState(filterBeforeEdit), filtersParams = _j[0], setFiltersParams = _j[1];
    var _k = react_2.useState(filterApplication), filter = _k[0], setFilter = _k[1];
    var _l = react_2.useState(totalItems), itemsTotal = _l[0], setTotalItems = _l[1];
    var _m = react_2.useState(''), arrowOrder = _m[0], setArrowOrder = _m[1];
    var _o = react_2.useState(function () { return [
        { name: "CamposGerenciados[]", title: "Foco", value: "foco" },
        { name: "CamposGerenciados[]", title: "Ensaio", value: "type_assay" },
        { name: "CamposGerenciados[]", title: "GLI", value: "gli" },
        {
            name: "CamposGerenciados[]",
            title: "Nome do experimento",
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
    ]; }), generatesProps = _o[0], setGeneratesProps = _o[1];
    var _p = react_2.useState(function () { return [
        {
            name: "StatusCheckbox",
            title: "IMPORTADO ",
            value: "importado",
            defaultChecked: function () { return camposGerenciados.includes("importado"); }
        },
        {
            name: "StatusCheckbox",
            title: "SORTEADO",
            value: "sorteado",
            defaultChecked: function () { return camposGerenciados.includes("sorteado"); }
        },
    ]; }), statusFilter = _p[0], setStatusFilter = _p[1];
    var _q = react_2.useState([]), statusFilterSelected = _q[0], setStatusFilterSelected = _q[1];
    // const [orderBy, setOrderBy] = useState<string>("");
    var _r = react_2.useState(""), orderType = _r[0], setOrderType = _r[1];
    var _s = react_2.useState(false), statusAccordion = _s[0], setStatusAccordion = _s[1];
    var _t = react_2.useState(itensPerPage), take = _t[0], setTake = _t[1];
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _u = react_2.useState(orderByserver), orderBy = _u[0], setOrderBy = _u[1];
    var _v = react_2.useState(typeOrderServer), typeOrder = _v[0], setTypeOrder = _v[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    var _w = react_2.useState([]), rowsSelected = _w[0], setRowsSelected = _w[1];
    var router = router_1.useRouter();
    var formik = formik_1.useFormik({
        initialValues: {
            filterFoco: "",
            filterTypeAssay: "",
            filterGli: "",
            filterExperimentName: "",
            filterTecnologia: "",
            filterCod: "",
            filterPeriod: "",
            filterDelineamento: "",
            filterRepetition: "",
            filterRepetitionTo: "",
            filterRepetitionFrom: "",
            orderBy: "",
            typeOrder: ""
        },
        onSubmit: function (_a) {
            var filterFoco = _a.filterFoco, filterTypeAssay = _a.filterTypeAssay, filterGli = _a.filterGli, filterExperimentName = _a.filterExperimentName, filterTecnologia = _a.filterTecnologia, filterCod = _a.filterCod, filterPeriod = _a.filterPeriod, filterDelineamento = _a.filterDelineamento, filterRepetition = _a.filterRepetition;
            return __awaiter(_this, void 0, void 0, function () {
                var allCheckBox, selecionados, i, filterStatus, parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            allCheckBox = document.querySelectorAll("input[name='StatusCheckbox']");
                            selecionados = "";
                            for (i = 0; i < allCheckBox.length; i += 1) {
                                if (allCheckBox[i].checked) {
                                    selecionados += allCheckBox[i].value + ",";
                                }
                            }
                            filterStatus = statusFilterSelected === null || statusFilterSelected === void 0 ? void 0 : statusFilterSelected.join(",");
                            parametersFilter = "filterFoco=" + filterFoco + "&filterTypeAssay=" + filterTypeAssay + "&filterGli=" + filterGli + "&filterExperimentName=" + filterExperimentName + "&filterTecnologia=" + filterTecnologia + "&filterCod=" + filterCod + "&filterPeriod=" + filterPeriod + "&filterRepetition=" + filterRepetition + "&filterDelineamento=" + filterDelineamento + "&idSafra=" + idSafra + "&filterStatus=" + filterStatus;
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
                        return [4 /*yield*/, services_1.experimentService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setExperiments(response.response);
                                    setTotalItems(response.total);
                                    tableRef.current.dataManager.changePageSize(itemsTotal >= take ? take : itemsTotal);
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
    react_2.useEffect(function () {
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
            render: function (rowData) { return (react_1["default"].createElement("div", { className: "h-10 flex" },
                react_1["default"].createElement("div", null, rowData.assay_list.tecnologia.cod_tec + " " + rowData.assay_list.tecnologia.name))); }
        };
    }
    function orderColumns(columnsOrder) {
        var columnOrder = columnsOrder.split(",");
        var tableFields = [];
        Object.keys(columnOrder).forEach(function (index) {
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
                tableFields.push(tecnologiaHeaderFactory("Tecnologia", "assay_list.tecnologia.cod_tec"));
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
                        localStorage.setItem("user", JSON.stringify(userLogado));
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
                case 0: return [4 /*yield*/, services_1.experimentService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                var newItem = item;
                                newItem.Safra = (_b = (_a = item.assay_list) === null || _a === void 0 ? void 0 : _a.safra) === null || _b === void 0 ? void 0 : _b.safraName;
                                newItem.Foco = (_c = item.assay_list) === null || _c === void 0 ? void 0 : _c.foco.name;
                                newItem.TipoDeEnsaio = (_d = item.assay_list) === null || _d === void 0 ? void 0 : _d.type_assay.name;
                                newItem.Tecnologia = (_e = item.assay_list) === null || _e === void 0 ? void 0 : _e.tecnologia.name;
                                newItem.Gli = (_f = item.assay_list) === null || _f === void 0 ? void 0 : _f.gli;
                                newItem.NomeDoExperimento = item === null || item === void 0 ? void 0 : item.experimentName;
                                newItem.Bgm = (_g = item.assay_list) === null || _g === void 0 ? void 0 : _g.bgm;
                                newItem.StatusEnsaio = (_h = item.assay_list) === null || _h === void 0 ? void 0 : _h.status;
                                newItem.Plantio = (_j = newItem.local) === null || _j === void 0 ? void 0 : _j.name_local_culture;
                                newItem.Delineamento = (_k = item.delineamento) === null || _k === void 0 ? void 0 : _k.name;
                                newItem.Repetição = (_l = item.delineamento) === null || _l === void 0 ? void 0 : _l.repeticao;
                                newItem.Densidade = item === null || item === void 0 ? void 0 : item.density;
                                newItem.NumeroDeRepetições = item.repetitionsNumber;
                                newItem.Época = item === null || item === void 0 ? void 0 : item.period;
                                newItem.OrdemSorteio = item === null || item === void 0 ? void 0 : item.orderDraw;
                                newItem.Nlp = item === null || item === void 0 ? void 0 : item.nlp;
                                newItem.Clp = item === null || item === void 0 ? void 0 : item.clp;
                                newItem.Eel = item === null || item === void 0 ? void 0 : item.eel;
                                newItem.Observações = item === null || item === void 0 ? void 0 : item.comments;
                                newItem.CountNT = newItem.countNT;
                                newItem.NpeQT = newItem.npeQT;
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
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Tratamentos");
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
                            XLSX.writeFile(workBook, "Tratamentos-genótipo.xlsx");
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
    }
    function handlePagination() {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // const skip = currentPage * Number(take);
                    // let parametersFilter;
                    // if (orderType) {
                    //   parametersFilter = `skip=${skip}&take=${take}&status=${"SORTEADO"}&orderBy=${orderBy}&typeOrder=${orderType}`;
                    // } else {
                    //   parametersFilter = `skip=${skip}&take=${take}&status=${"SORTEADO"}`;
                    // }
                    // if (filter) {
                    //   parametersFilter = `${parametersFilter}&${filter}`;
                    // }
                    // await experimentService
                    //   .getAll(parametersFilter)
                    //   .then(({ status, response }: IReturnObject) => {
                    //     if (status === 200) {
                    //       setExperiments(response);
                    //     }
                    //   });
                    return [4 /*yield*/, callingApi(filter)];
                    case 1:
                        // const skip = currentPage * Number(take);
                        // let parametersFilter;
                        // if (orderType) {
                        //   parametersFilter = `skip=${skip}&take=${take}&status=${"SORTEADO"}&orderBy=${orderBy}&typeOrder=${orderType}`;
                        // } else {
                        //   parametersFilter = `skip=${skip}&take=${take}&status=${"SORTEADO"}`;
                        // }
                        // if (filter) {
                        //   parametersFilter = `${parametersFilter}&${filter}`;
                        // }
                        // await experimentService
                        //   .getAll(parametersFilter)
                        //   .then(({ status, response }: IReturnObject) => {
                        //     if (status === 200) {
                        //       setExperiments(response);
                        //     }
                        //   });
                        _a.sent(); // handle pagination globly
                        return [2 /*return*/];
                }
            });
        });
    }
    function filterFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-2" },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { type: "text", placeholder: name, id: title, name: title, onChange: formik.handleChange })));
    }
    function handleSubmit() {
        return __awaiter(this, void 0, void 0, function () {
            var experimentsSelected, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        experimentsSelected = rowsSelected.map(function (item) { return item.id; });
                        return [4 /*yield*/, services_1.experimentService.update({
                                idList: experimentsSelected,
                                experimentGroupId: Number(experimentGroupId)
                            })];
                    case 1:
                        status = (_a.sent()).status;
                        if (status !== 200) {
                            sweetalert2_1["default"].fire("Erro ao associar experimentos");
                        }
                        else {
                            router.back();
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    react_2.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(head_1["default"], null,
            react_1["default"].createElement("title", null, "Listagem de gen\u00F3tipos do ensaio")),
        react_1["default"].createElement(components_1.ModalConfirmation, { isOpen: isOpenModal, text: "Voc\u00EA tem certeza de que quer associar " + (rowsSelected === null || rowsSelected === void 0 ? void 0 : rowsSelected.length) + " experimentos a esse grupo?", onPress: handleSubmit, onCancel: function () { return setIsOpenModal(false); } }),
        react_1["default"].createElement(components_1.Content, { contentHeader: tabsEtiquetagemMenu, moduloActive: "operacao" },
            react_1["default"].createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                react_1["default"].createElement(components_1.AccordionFilter, { title: "Filtrar dados de etiquetagem" },
                    react_1["default"].createElement("div", { className: "w-full flex gap-2" },
                        react_1["default"].createElement("form", { className: "flex flex-col\n                                    w-full\n                                    items-center\n                                    px-4\n                                    bg-white\n                                    ", onSubmit: formik.handleSubmit },
                            react_1["default"].createElement("div", { className: "w-full h-full\n                                        flex\n                                        justify-center\n                                        pb-8\n                                        " },
                                filterFieldFactory("filterFoco", "Foco"),
                                filterFieldFactory("filterTypeAssay", "Ensaio"),
                                filterFieldFactory("filterGli", "GLI"),
                                filterFieldFactory("filterExperimentName", "Nome Experimento"),
                                filterFieldFactory("filterCod", "Cód. Tecnologia")),
                            react_1["default"].createElement("div", { className: "w-full h-full\n                                        flex\n                                        justify-center\n                                        pb-2\n                                        " },
                                filterFieldFactory("filterTecnologia", "Nome Tecnologia"),
                                filterFieldFactory("filterPeriod", "Epoca"),
                                filterFieldFactory("filterDelineamento", "Delineamento"),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Repeti\u00E7\u00E3o"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterRepetitionFrom", name: "filterRepetitionFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterRepetitionTo", name: "filterRepetitionTo", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status EXP."),
                                    react_1["default"].createElement(components_1.SelectMultiple, { data: statusFilter.map(function (i) { return i.title; }), values: statusFilterSelected, onChange: function (e) { return setStatusFilterSelected(e); } })),
                                react_1["default"].createElement(components_1.FieldItemsPerPage, { selected: take, onChange: setTake }),
                                react_1["default"].createElement("div", { style: { width: 40 } }),
                                react_1["default"].createElement("div", { className: "h-7 w-32 mt-6" },
                                    react_1["default"].createElement(components_1.Button, { type: "submit", onClick: function () { }, value: "Filtrar", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                react_1["default"].createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    react_1["default"].createElement(material_table_1["default"], { tableRef: tableRef, style: { background: "#f9fafb" }, columns: columns, data: experiments, options: {
                            selection: true,
                            showTitle: false,
                            headerStyle: {
                                zIndex: 0
                            },
                            rowStyle: { background: "#f9fafb", height: 35 },
                            search: false,
                            filtering: false,
                            pageSize: Number(take)
                        }, localization: {
                            body: {
                                emptyDataSourceMessage: tableMessage
                                    ? "Nenhum experimento encontrado!"
                                    : "ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS."
                            }
                        }, onChangeRowsPerPage: function () { }, onSelectionChange: setRowsSelected, components: {
                            Toolbar: function () { return (react_1["default"].createElement("div", { className: "w-full max-h-96\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                react_1["default"].createElement("div", { className: "h-12 w-74 ml-0" },
                                    react_1["default"].createElement(components_1.Button, { title: "Salvar grupo de experimento", value: "Salvar grupo de experimento", textColor: "white", onClick: function () {
                                            setIsOpenModal(true);
                                        }, bgColor: "bg-blue-600", icon: react_1["default"].createElement(ri_1.RiArrowUpDownLine, { size: 20 }) })),
                                react_1["default"].createElement("strong", { className: "text-blue-600" },
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
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages })));
                            }
                        } }))))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res, query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, lastPageServer, pageBeforeEdit, filterBeforeEdit, typeOrderServer, orderByserver, token, idCulture, idSafra, experimentGroupId, publicRuntimeConfig, baseUrlExperimento, filterApplication, param, urlParametersExperiment, requestOptions, _b, _c, allExperiments, _d, totalItems;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_f = (_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.response[0]) === null || _f === void 0 ? void 0 : _f.itens_per_page)];
                case 2:
                    itensPerPage = _g.sent();
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
                        : "";
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : 'desc';
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : 'assay_list.foco.name';
                    token = req.cookies.token;
                    idCulture = req.cookies.cultureId;
                    idSafra = req.cookies.safraId;
                    experimentGroupId = query.experimentGroupId;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrlExperimento = publicRuntimeConfig.apiUrl + "/experiment";
                    filterApplication = req.cookies.filterBeforeEdit ||
                        "&id_culture=" + idCulture + "&id_safra=" + idSafra;
                    cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                    cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                    param = "&id_culture=" + idCulture + "&id_safra=" + idSafra + "&status=" + "SORTEADO";
                    urlParametersExperiment = new URL(baseUrlExperimento);
                    urlParametersExperiment.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: "GET",
                        credentials: "include",
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParametersExperiment.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _g.sent(), _c = _b.response, allExperiments = _c === void 0 ? [] : _c, _d = _b.total, totalItems = _d === void 0 ? 0 : _d;
                    return [2 /*return*/, {
                            props: {
                                allExperiments: allExperiments,
                                totalItems: totalItems,
                                experimentGroupId: experimentGroupId,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                idSafra: idSafra,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit,
                                idCulture: idCulture,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer
                            }
                        }];
            }
        });
    });
};
