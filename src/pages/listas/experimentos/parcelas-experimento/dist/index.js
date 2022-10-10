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
var bs_1 = require("react-icons/bs");
var ri_1 = require("react-icons/ri");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var react_modal_1 = require("react-modal");
var XLSX = require("xlsx");
var sweetalert2_1 = require("sweetalert2");
var read_excel_file_1 = require("read-excel-file");
var experiment_genotipe_service_1 = require("src/services/experiment-genotipe.service");
var components_1 = require("../../../../components");
var user_preference_controller_1 = require("../../../../controllers/user-preference.controller");
var services_1 = require("../../../../services");
var ITabs = require("../../../../shared/utils/dropdown");
var helpers_1 = require("../../../../helpers");
function Listagem(_a) {
    var _this = this;
    var 
    // assaySelect,
    genotypeSelect = _a.genotypeSelect, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, idSafra = _a.idSafra, filterBeforeEdit = _a.filterBeforeEdit, typeOrderServer = _a.typeOrderServer, orderByserver = _a.orderByserver;
    var TabsDropDowns = ITabs["default"].TabsDropDowns;
    var _b = react_2.useState(false), isOpenModal = _b[0], setIsOpenModal = _b[1];
    var tableRef = react_1.useRef(null);
    var tabsDropDowns = TabsDropDowns("listas");
    tabsDropDowns.map(function (tab) {
        return tab.titleTab === "EXPERIMENTOS"
            ? (tab.statusTab = true)
            : (tab.statusTab = false);
    });
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.genotypeTreatment || {
        id: 0,
        table_preferences: "id,foco,type_assay,tecnologia,gli,experiment,culture,rep,status,nt,npe,genotipo,nca"
    };
    var _c = react_2.useState(preferences.table_preferences), camposGerenciados = _c[0], setCamposGerenciados = _c[1];
    var _d = react_2.useState([]), treatments = _d[0], setTreatments = _d[1];
    var _e = react_2.useState(false), tableMessage = _e[0], setMessage = _e[1];
    var _f = react_2.useState(0), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = react_2.useState(1), orderList = _g[0], setOrder = _g[1];
    var _h = react_2.useState(false), afterFilter = _h[0], setAfterFilter = _h[1];
    var _j = react_2.useState(filterBeforeEdit), filtersParams = _j[0], setFiltersParams = _j[1];
    var _k = react_2.useState(filterApplication), filter = _k[0], setFilter = _k[1];
    var _l = react_2.useState(0), itemsTotal = _l[0], setTotalItems = _l[1];
    var _m = react_2.useState(""), arrowOrder = _m[0], setArrowOrder = _m[1];
    var _o = react_2.useState(function () { return [
        // {
        //   name: 'CamposGerenciados[]',
        //   title: 'CheckBox ',
        //   value: 'id',
        //   defaultChecked: () => camposGerenciados.includes('id'),
        // },
        {
            name: "CamposGerenciados[]",
            title: "Foco",
            value: "foco",
            defaultChecked: function () { return camposGerenciados.includes("foco"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Ensaio",
            value: "type_assay",
            defaultChecked: function () { return camposGerenciados.includes("type_assay"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Tecnologia",
            value: "tecnologia",
            defaultChecked: function () { return camposGerenciados.includes("tecnologia"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "GLI",
            value: "gli",
            defaultChecked: function () { return camposGerenciados.includes("gli"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Experimento",
            value: "experiment",
            defaultChecked: function () { return camposGerenciados.includes("experiment"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Lugar plantio",
            value: "culture",
            defaultChecked: function () { return camposGerenciados.includes("culture"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "REP.",
            value: "rep",
            defaultChecked: function () { return camposGerenciados.includes("rep"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Status EXP.",
            value: "status",
            defaultChecked: function () { return camposGerenciados.includes("status"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "NT",
            value: "nt",
            defaultChecked: function () { return camposGerenciados.includes("nt"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "NPE",
            value: "npe",
            defaultChecked: function () { return camposGerenciados.includes("npe"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Nome genótipo",
            value: "genotipo",
            defaultChecked: function () { return camposGerenciados.includes("genotipo"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "NCA",
            value: "nca",
            defaultChecked: function () { return camposGerenciados.includes("nca"); }
        },
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
        {
            name: "StatusCheckbox",
            title: "ETIQ. NÃO INICIADA",
            value: "ETIQ. NÃO INICIADA",
            defaultChecked: function () { return camposGerenciados.includes("ETIQ. NÃO INICIADA"); }
        },
        {
            name: "StatusCheckbox",
            title: "ETIQ. EM ANDAMENTO",
            value: "ETIQ. EM ANDAMENTO",
            defaultChecked: function () { return camposGerenciados.includes("ETIQ. EM ANDAMENTO"); }
        },
        {
            name: "StatusCheckbox",
            title: "ETIQ. FINALIZADA",
            value: "ETIQ. FINALIZADA",
            defaultChecked: function () { return camposGerenciados.includes("ETIQ. FINALIZADA"); }
        },
    ]; }), statusFilter = _p[0], setStatusFilter = _p[1];
    var _q = react_2.useState([]), statusFilterSelected = _q[0], setStatusFilterSelected = _q[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _r = react_2.useState(""), orderType = _r[0], setOrderType = _r[1];
    var router = router_1.useRouter();
    var _s = react_2.useState(false), statusAccordion = _s[0], setStatusAccordion = _s[1];
    // const take: number = itensPerPage;
    var _t = react_2.useState(itensPerPage), take = _t[0], setTake = _t[1];
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _u = react_2.useState(orderByserver), orderBy = _u[0], setOrderBy = _u[1]; // RR
    var _v = react_2.useState(typeOrderServer), typeOrder = _v[0], setTypeOrder = _v[1]; // RR
    // const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${
    //   orderBy == "tecnologia" ? "genotipo.tecnologia.cod_tec" : orderBy
    // }&typeOrder=${typeOrder}`; // RR
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + (orderBy == "tecnologia" ? "tecnologia.cod_tec" : orderBy) + "&typeOrder=" + typeOrder; // RR
    var _w = react_2.useState(false), nccIsValid = _w[0], setNccIsValid = _w[1];
    var _x = react_2.useState(false), genotypeIsValid = _x[0], setGenotypeIsValid = _x[1];
    var _y = react_2.useState([]), rowsSelected = _y[0], setRowsSelected = _y[1];
    var formik = formik_1.useFormik({
        initialValues: {
            filterFoco: "",
            filterTypeAssay: "",
            filterTechnology: "",
            filterGli: "",
            filterBgm: "",
            filterTreatmentsNumber: "",
            filterStatus: "",
            filterStatusAssay: "",
            filterGenotypeName: "",
            filterNca: "",
            orderBy: "",
            typeOrder: "",
            filterBgmTo: "",
            filterBgmFrom: "",
            filterNtTo: "",
            filterNtFrom: "",
            filterNpeTo: "",
            filterNpeFrom: "",
            filterRepTo: "",
            filterRepFrom: "",
            filterStatusT: "",
            filterCodTec: "",
            filterExperimentName: "",
            filterPlacingPlace: ""
        },
        onSubmit: function (_a) {
            var filterFoco = _a.filterFoco, filterTypeAssay = _a.filterTypeAssay, filterTechnology = _a.filterTechnology, filterGli = _a.filterGli, filterBgm = _a.filterBgm, filterTreatmentsNumber = _a.filterTreatmentsNumber, filterStatusAssay = _a.filterStatusAssay, filterGenotypeName = _a.filterGenotypeName, filterNca = _a.filterNca, filterBgmTo = _a.filterBgmTo, filterBgmFrom = _a.filterBgmFrom, filterNtTo = _a.filterNtTo, filterNtFrom = _a.filterNtFrom, filterNpeTo = _a.filterNpeTo, filterNpeFrom = _a.filterNpeFrom, filterRepTo = _a.filterRepTo, filterRepFrom = _a.filterRepFrom, filterCodTec = _a.filterCodTec, filterExperimentName = _a.filterExperimentName, filterPlacingPlace = _a.filterPlacingPlace;
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
                            parametersFilter = "&filterFoco=" + filterFoco + "&filterTypeAssay=" + filterTypeAssay + "&filterTechnology=" + filterTechnology + "&filterGli=" + filterGli + "&filterBgm=" + filterBgm + "&filterTreatmentsNumber=" + filterTreatmentsNumber + "&filterStatus=" + filterStatus + "&filterStatusAssay=" + filterStatusAssay + "&filterGenotypeName=" + filterGenotypeName + "&filterNca=" + filterNca + "&id_safra=" + idSafra + "&filterBgmTo=" + filterBgmTo + "&filterBgmFrom=" + filterBgmFrom + "&filterNtTo=" + filterNtTo + "&filterNtFrom=" + filterNtFrom;
                            // setFiltersParams(parametersFilter);
                            // setCookies('filterBeforeEdit', filtersParams);
                            // await genotypeTreatmentService
                            //     .getAll(`${parametersFilter}`)
                            //     .then(({ response, total: allTotal }) => {
                            //         setFilter(parametersFilter);
                            //         setTreatments(response);
                            //         setTotalItems(allTotal);
                            //         setAfterFilter(true);
                            //         setCurrentPage(0);
                            //         setMessage(true);
                            //         tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
                            //     });
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
                        cookies_next_1.setCookies("filterBeforeEdit", parametersFilter);
                        cookies_next_1.setCookies("filterBeforeEditTypeOrder", typeOrder);
                        cookies_next_1.setCookies("filterBeforeEditOrderBy", orderBy);
                        parametersFilter = parametersFilter + "&" + pathExtra;
                        setFiltersParams(parametersFilter);
                        cookies_next_1.setCookies("filtersParams", parametersFilter);
                        return [4 /*yield*/, experiment_genotipe_service_1.experimentGenotipeService
                                .getAll(parametersFilter)
                                .then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setTreatments(response.response);
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
    function headerTableFactory(name, title, style) {
        if (style === void 0) { style = false; }
        return {
            title: (react_1["default"].createElement("div", { className: "flex items-center" },
                react_1["default"].createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: true,
            cellStyle: style ? { color: "#039be5", fontWeight: "bold" } : {}
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
                react_1["default"].createElement("div", null, rowData.experiment.assay_list.tecnologia.cod_tec + " " + rowData.experiment.assay_list.tecnologia.name))); }
        };
    }
    function orderColumns(columnsOrder) {
        var columnOrder = columnsOrder.split(",");
        var tableFields = [];
        Object.keys(columnOrder).forEach(function (item) {
            if (columnOrder[item] === "foco") {
                tableFields.push(
                // headerTableFactory("Foco", "experiment.assay_list.foco.name")
                headerTableFactory("Foco", "foco.name"));
            }
            if (columnOrder[item] === "type_assay") {
                tableFields.push(headerTableFactory("Ensaio", "experiment.assay_list.type_assay.name"));
            }
            if (columnOrder[item] === "tecnologia") {
                tableFields.push(tecnologiaHeaderFactory("Tecnologia", "tecnologia"));
            }
            if (columnOrder[item] === "gli") {
                // tableFields.push(
                //   headerTableFactory("GLI", "experiment.assay_list.gli")
                // );
                tableFields.push(headerTableFactory("GLI", "experiment.assay_list.gli"));
            }
            if (columnOrder[item] === "experiment") {
                tableFields.push(headerTableFactory("Experimento", "experiment.experimentName"));
            }
            if (columnOrder[item] === "culture") {
                tableFields.push(headerTableFactory("Lugar plantio", "experiment.local.name_local_culture"));
            }
            if (columnOrder[item] === "rep") {
                tableFields.push(headerTableFactory("REP.", "rep"));
            }
            if (columnOrder[item] === "status") {
                tableFields.push(headerTableFactory("Status EXP.", "experiment.status"));
            }
            if (columnOrder[item] === "nt") {
                tableFields.push(headerTableFactory("NT.", "nt"));
            }
            if (columnOrder[item] === "npe") {
                tableFields.push(headerTableFactory("NPE.", "npe"));
            }
            if (columnOrder[item] === "genotipo") {
                tableFields.push(headerTableFactory("Nome genótipo", "genotipo.name_genotipo", true));
            }
            if (columnOrder[item] === "nca") {
                tableFields.push(headerTableFactory("NCA", "nca", true));
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
                                module_id: 30
                            })
                                .then(function (response) {
                                userLogado.preferences.parcelas = {
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
                        userLogado.preferences.parcelas = {
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
                case 0: return [4 /*yield*/, experiment_genotipe_service_1.experimentGenotipeService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var newItem = {};
                                newItem.SAFRA = item.safra.safraName;
                                newItem.FOCO = item.foco.name;
                                newItem.ENSAIO = item.type_assay.name;
                                newItem.TECNOLOGIA = item.tecnologia.name;
                                newItem.GLI = item.gli;
                                newItem.EXPERIMENTO = item.experiment.experimentName;
                                newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
                                newItem.DELINEAMENTO = item.experiment.delineamento.name;
                                newItem.REP = item.rep;
                                newItem.NT = item.nt;
                                newItem.NPE = item.npe;
                                newItem.STATUS_T = item.status_t;
                                newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
                                newItem.NCA = item.nca;
                                newItem.STATUS_EXP = item.experiment.status;
                                delete newItem.id;
                                return newItem;
                            });
                            var workSheet = XLSX.utils.json_to_sheet(newData);
                            var workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Parcelas");
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
                            XLSX.writeFile(workBook, "Parcelas.xlsx");
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var replacementExcel = function () { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, experiment_genotipe_service_1.experimentGenotipeService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var newItem = {};
                                newItem.SAFRA = item.safra.safraName;
                                newItem.FOCO = item.foco.name;
                                newItem.ENSAIO = item.type_assay.name;
                                newItem.TECNOLOGIA = item.tecnologia.name;
                                newItem.GLI = item.gli;
                                newItem.EXPERIMENTO = item.experiment.experimentName;
                                newItem.LUGAR_DE_PLANTIO = item.experiment.local.name_local_culture;
                                newItem.DELINEAMENTO = item.experiment.delineamento.name;
                                newItem.REP = item.rep;
                                newItem.NT = item.nt;
                                newItem.NPE = item.npe;
                                newItem.STATUS_T = item.status_t;
                                newItem.NOME_DO_GENÓTIPO = item.genotipo.name_genotipo;
                                newItem.NCA = item.nca;
                                newItem.NOVO_GENOTIPO = "";
                                newItem.NOVO_STATUS = "";
                                newItem.NOVO_NCA = "";
                                delete newItem.id;
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
                            XLSX.writeFile(workBook, "Substituição-genótipos.xlsx");
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
                    //   parametersFilter = `skip=${skip}&take=${take}`;
                    // } else {
                    //   parametersFilter = `skip=${skip}&take=${take}`;
                    // }
                    // if (filter) {
                    //   parametersFilter = `${parametersFilter}&${filter}`;
                    // }
                    // // await genotypeTreatmentService
                    // //     .getAll(parametersFilter)
                    // //     .then(({ status, response }) => {
                    // //         if (status === 200) {
                    // //             setTreatments(response);
                    // //         }
                    // //     });
                    // await experimentGenotipeService.getAll(parametersFilter).then(({ response, total: allTotal }) => {
                    //   setTreatments(response);
                    //   setTotalItems(allTotal);
                    // });
                    return [4 /*yield*/, callingApi(filter)];
                    case 1:
                        // const skip = currentPage * Number(take);
                        // let parametersFilter;
                        // if (orderType) {
                        //   parametersFilter = `skip=${skip}&take=${take}`;
                        // } else {
                        //   parametersFilter = `skip=${skip}&take=${take}`;
                        // }
                        // if (filter) {
                        //   parametersFilter = `${parametersFilter}&${filter}`;
                        // }
                        // // await genotypeTreatmentService
                        // //     .getAll(parametersFilter)
                        // //     .then(({ status, response }) => {
                        // //         if (status === 200) {
                        // //             setTreatments(response);
                        // //         }
                        // //     });
                        // await experimentGenotipeService.getAll(parametersFilter).then(({ response, total: allTotal }) => {
                        //   setTreatments(response);
                        //   setTotalItems(allTotal);
                        // });
                        _a.sent(); // handle pagination globly
                        return [2 /*return*/];
                }
            });
        });
    }
    function filterFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-2" },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { type: "text", placeholder: name, id: title, name: title, defaultValue: checkValue(title), onChange: formik.handleChange })));
    }
    // Checking defualt values
    function checkValue(value) {
        var parameter = helpers_1.tableGlobalFunctions.getValuesForFilter(value, filtersParams);
        return parameter;
    }
    function readExcel(value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                read_excel_file_1["default"](value[0]).then(function (rows) {
                    services_1.importService
                        .validate({
                        table: "REPLACEMENT_GENOTYPE ",
                        spreadSheet: rows,
                        moduleId: 27,
                        idSafra: userLogado.safras.safra_selecionada,
                        created_by: userLogado.id
                    })
                        .then(function (_a) {
                        var status = _a.status, message = _a.message;
                        sweetalert2_1["default"].fire({
                            html: message,
                            width: "800"
                        });
                        if (status != 400 && status == 200) {
                            handlePagination();
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    }
    function handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var genotypeButton, ncaButton, inputFile, checkedTreatments, checkedTreatmentsLocal, checkedTreatments, checkedTreatmentsLocal, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        genotypeButton = document.querySelector("input[id='genotipo']:checked");
                        ncaButton = document.querySelector("input[id='nca']:checked");
                        inputFile = document.getElementById("import");
                        event.preventDefault();
                        if (!genotypeButton) return [3 /*break*/, 1];
                        checkedTreatments = rowsSelected.map(function (item) { return ({
                            id: item.id,
                            idGenotipo: item.idGenotipo,
                            idLote: item.idLote
                        }); });
                        checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
                        localStorage.setItem("checkedTreatments", checkedTreatmentsLocal);
                        localStorage.setItem("treatmentsOptionSelected", JSON.stringify("genotipo"));
                        router.push("/listas/ensaios/genotipos-ensaio/substituicao?value=experiment"
                        //"/listas/ensaios/tratamento-genotipo/substituicao?value=experiment"
                        );
                        return [3 /*break*/, 5];
                    case 1:
                        if (!ncaButton) return [3 /*break*/, 2];
                        checkedTreatments = rowsSelected.map(function (item) { return ({
                            id: item.id,
                            genotipo: item.name_genotipo,
                            idGenotipo: item.idGenotipo,
                            idLote: item.idLote
                        }); });
                        checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
                        localStorage.setItem("checkedTreatments", checkedTreatmentsLocal);
                        localStorage.setItem("treatmentsOptionSelected", JSON.stringify("nca"));
                        router.push("/listas/ensaios/genotipos-ensaio/substituicao?value=experiment");
                        return [3 /*break*/, 5];
                    case 2:
                        if (!((inputFile === null || inputFile === void 0 ? void 0 : inputFile.files.length) !== 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, readExcel(inputFile.files)];
                    case 3:
                        value = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        sweetalert2_1["default"].fire("Selecione alguma opção ou import");
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function setRadioStatus() {
        return __awaiter(this, void 0, void 0, function () {
            var selectedGenotype, checkedLength;
            return __generator(this, function (_a) {
                selectedGenotype = {};
                rowsSelected.forEach(function (item) {
                    selectedGenotype[item.name_genotipo] = true;
                });
                checkedLength = Object.getOwnPropertyNames(selectedGenotype);
                if (checkedLength.length > 1) {
                    setNccIsValid(true);
                }
                if (rowsSelected.length <= 0) {
                    setNccIsValid(true);
                    setGenotypeIsValid(true);
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
            react_1["default"].createElement("title", null, "Listagem de gen\u00F3tipos do ensaio")),
        react_1["default"].createElement(react_modal_1["default"], { isOpen: isOpenModal, shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, onRequestClose: function () {
                setIsOpenModal(!isOpenModal);
            }, overlayClassName: "fixed inset-0 flex bg-transparent justify-center items-center bg-white/75", className: "flex\n          flex-col\n          w-full\n          h-64\n          max-w-xl\n          bg-gray-50\n          rounded-tl-2xl\n          rounded-tr-2xl\n          rounded-br-2xl\n          rounded-bl-2xl\n          pt-2\n          pb-4\n          px-8\n          relative\n          shadow-lg\n          shadow-gray-900/50" },
            react_1["default"].createElement("form", { className: "flex flex-col" },
                react_1["default"].createElement("button", { type: "button", className: "flex absolute top-4 right-3 justify-end", onClick: function () {
                        setIsOpenModal(!isOpenModal);
                        setNccIsValid(false);
                        setGenotypeIsValid(false);
                    } },
                    react_1["default"].createElement(ri_1.RiCloseCircleFill, { size: 35, className: "fill-red-600 hover:fill-red-800" })),
                react_1["default"].createElement("div", { className: "flex px-4  justify-between" },
                    react_1["default"].createElement("header", { className: "flex flex-col mt-2" },
                        react_1["default"].createElement("h2", { className: "mb-2 text-blue-600 text-xl font-medium" }, "A\u00E7\u00E3o"),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("div", { className: "border-l-8 border-l-blue-600 mt-4" },
                                react_1["default"].createElement("h2", { className: "mb-2 font-normal text-xl ml-2 text-gray-900" }, "Substituir")),
                            react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                                react_1["default"].createElement("input", { type: "radio", name: "substituir", id: "genotipo", disabled: genotypeIsValid }),
                                react_1["default"].createElement("label", { htmlFor: "genotipo", className: "font-normal text-base" }, "Nome do gen\u00F3tipo"))),
                        react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                            react_1["default"].createElement("input", { type: "radio", name: "substituir", id: "nca", disabled: nccIsValid }),
                            react_1["default"].createElement("label", { htmlFor: "nca", className: "font-normal text-base" }, "NCA"))),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "mb-2 text-blue-600 text-xl mt-2 font-medium" },
                            react_1["default"].createElement("h2", null,
                                "Total selecionados: ", rowsSelected === null || rowsSelected === void 0 ? void 0 :
                                rowsSelected.length)),
                        react_1["default"].createElement("div", { className: "border-l-8 border-l-blue-600" },
                            react_1["default"].createElement("h2", { className: "mb-2 font-normal text-xl ml-2 text-gray-900 mt-6" }, "Importa Arquivo:")),
                        react_1["default"].createElement("h2", null, "Excel"),
                        react_1["default"].createElement(components_1.Input, { id: "import", type: "file", className: "\n              shadow\n              appearance-none\n              bg-white bg-no-repeat\n              border border-solid border-gray-300\n              rounded\n              w-full\n              py-1 px-1\n              text-gray-900\n              leading-tight\n              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none\n        " }))),
                react_1["default"].createElement("div", { className: "flex justify-end py-0" },
                    react_1["default"].createElement("div", { className: "h-10 w-40" },
                        react_1["default"].createElement("button", { type: "submit", value: "Cadastrar", className: "w-full h-full ml-auto mt-6 bg-green-600 text-white px-8 rounded-lg text-sm hover:bg-green-800", onClick: function (e) { return handleSubmit(e); } }, "Confirmar"))))),
        react_1["default"].createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "listas" },
            react_1["default"].createElement("main", { className: "h-full w-full\n          flex flex-col\n          items-start\n          gap-4\n        " },
                react_1["default"].createElement(components_1.AccordionFilter, { title: "Filtrar parcelas experimento" },
                    react_1["default"].createElement("div", { className: "w-full flex gap-2" },
                        react_1["default"].createElement("form", { className: "flex flex-col\n                  w-full\n                  items-center\n                  px-1\n                  bg-white\n                ", onSubmit: formik.handleSubmit },
                            react_1["default"].createElement("div", { className: "w-full h-full\n                  flex\n                  justify-center\n                  pb-8\n                " },
                                filterFieldFactory("filterFoco", "Foco"),
                                filterFieldFactory("filterTypeAssay", "Ensaio"),
                                filterFieldFactory("filterCodTec", "Cód. Tecnologia"),
                                filterFieldFactory("filterTechnology", "Nome da Tecnologia"),
                                filterFieldFactory("filterGli", "GLI"),
                                filterFieldFactory("filterExperimentName", "Experimento"),
                                filterFieldFactory("filterPlacingPlace", "Lugar plantio")),
                            react_1["default"].createElement("div", { className: "w-full h-full\n                  flex\n                  justify-center\n                  pt-2\n                  pb-3\n                  " },
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "REP"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterRepFrom", name: "filterRepFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterRepTo", name: "filterRepTo", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status EXP."),
                                    react_1["default"].createElement(components_1.SelectMultiple, { data: statusFilter.map(function (i) { return i.title; }), values: statusFilterSelected, onChange: function (e) { return setStatusFilterSelected(e); } })),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "NT"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterNtFrom", name: "filterNtFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterNtTo", name: "filterNtTo", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "NPE."),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterNpeFrom", name: "filterNpeFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterNpeTo", name: "filterNpeTo", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Nome gen\u00F3tipo"),
                                    react_1["default"].createElement(components_1.Select, { values: __spreadArrays([
                                            { id: "", name: "Selecione" }
                                        ], genotypeSelect), id: "filterGenotypeName", name: "filterGenotypeName", onChange: formik.handleChange, selected: false })),
                                filterFieldFactory("filterNca", "NCA"),
                                react_1["default"].createElement(components_1.FieldItemsPerPage, { selected: take, onChange: setTake, widthClass: "w-1/2" }),
                                react_1["default"].createElement("div", { style: { width: 40 } }),
                                react_1["default"].createElement("div", { className: "h-7 w-32 mt-6" },
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { }, value: "Filtrar", type: "submit", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                react_1["default"].createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    react_1["default"].createElement(material_table_1["default"], { tableRef: tableRef, style: { background: "#f9fafb" }, columns: columns, data: treatments, options: {
                            selection: true,
                            selectionProps: function (rowData) {
                                return isOpenModal && { disabled: rowData };
                            },
                            showTitle: false,
                            headerStyle: {
                                zIndex: 0
                            },
                            rowStyle: { background: "#f9fafb", height: 35 },
                            search: false,
                            filtering: false,
                            // pageSize: itensPerPage,
                            pageSize: Number(take)
                        }, localization: {
                            body: {
                                emptyDataSourceMessage: tableMessage
                                    ? "Nenhum Trat. Genótipo encontrado!"
                                    : ""
                            }
                        }, onChangeRowsPerPage: function (e) { }, onSelectionChange: setRowsSelected, components: {
                            Toolbar: function () { return (react_1["default"].createElement("div", { className: "w-full max-h-96\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                react_1["default"].createElement("div", { className: "h-12 w-32 ml-0" },
                                    react_1["default"].createElement(components_1.Button, { title: "Substituir", value: "Substituir", textColor: "white", onClick: function () {
                                            setRadioStatus();
                                            setIsOpenModal(!isOpenModal);
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
                                        react_1["default"].createElement(components_1.Button, { title: "Exportar planilha para substitui\u00E7\u00E3o", icon: react_1["default"].createElement(bs_1.BsDownload, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                replacementExcel();
                                            } })),
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
    var req = _a.req, res = _a.res;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, pageBeforeEdit, lastPageServer, filterBeforeEdit, token, idCulture, idSafra, publicRuntimeConfig, baseUrlTreatment, baseUrlAssay, filterApplication, typeOrderServer, orderByserver, param, urlParametersAssay, urlParametersTreatment, requestOptions, _b, _c, allExpTreatments, _d, totalItems, allAssay, genotypeSelect;
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
                    lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";
                    if (lastPageServer == undefined || lastPageServer == "No") {
                        cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                        cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditTypeOrder", { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditOrderBy", { req: req, res: res });
                        cookies_next_1.removeCookies("lastPage", { req: req, res: res });
                    }
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "";
                    token = req.cookies.token;
                    idCulture = req.cookies.cultureId;
                    idSafra = req.cookies.safraId;
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrlTreatment = publicRuntimeConfig.apiUrl + "/experiment-genotipe";
                    baseUrlAssay = publicRuntimeConfig.apiUrl + "/experiment";
                    filterApplication = req.cookies.filterBeforeEdit ||
                        "&id_culture=" + idCulture + "&id_safra=" + idSafra;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : "desc";
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : "gli";
                    cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                    cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                    cookies_next_1.removeCookies("filterBeforeEditTypeOrder", { req: req, res: res });
                    cookies_next_1.removeCookies("filterBeforeEditOrderBy", { req: req, res: res });
                    cookies_next_1.removeCookies("lastPage", { req: req, res: res });
                    param = "&id_culture=" + idCulture + "&id_safra=" + idSafra;
                    urlParametersAssay = new URL(baseUrlAssay);
                    urlParametersTreatment = new URL(baseUrlTreatment);
                    urlParametersTreatment.search = new URLSearchParams(param).toString();
                    requestOptions = {
                        method: "GET",
                        credentials: "include",
                        headers: { Authorization: "Bearer " + token }
                    };
                    return [4 /*yield*/, fetch(urlParametersTreatment.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    _b = _g.sent(), _c = _b.response, allExpTreatments = _c === void 0 ? [] : _c, _d = _b.total, totalItems = _d === void 0 ? 0 : _d;
                    return [4 /*yield*/, fetch(urlParametersAssay.toString(), requestOptions).then(function (response) { return response.json(); })];
                case 4:
                    allAssay = (_g.sent()).response;
                    genotypeSelect = allExpTreatments === null || allExpTreatments === void 0 ? void 0 : allExpTreatments.map(function (item) {
                        var newItem = {};
                        newItem.id = item.genotipo.name_genotipo;
                        newItem.name = item.genotipo.name_genotipo;
                        return newItem;
                    });
                    return [2 /*return*/, {
                            props: {
                                allExpTreatments: allExpTreatments,
                                // assaySelect,
                                genotypeSelect: genotypeSelect,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                idCulture: idCulture,
                                idSafra: idSafra,
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
