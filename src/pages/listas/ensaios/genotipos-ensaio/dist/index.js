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
var react_modal_1 = require("react-modal");
var XLSX = require("xlsx");
var sweetalert2_1 = require("sweetalert2");
var read_excel_file_1 = require("read-excel-file");
var components_1 = require("../../../../../components");
var user_preference_controller_1 = require("../../../../../controllers/user-preference.controller");
var services_1 = require("../../../../../services");
var ITabs = require("../../../../../shared/utils/dropdown");
var helpers_1 = require("../../../../../helpers");
function Listagem(_a) {
    var _this = this;
    var _b;
    var assaySelect = _a.assaySelect, genotypeSelect = _a.genotypeSelect, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, idSafra = _a.idSafra, filterBeforeEdit = _a.filterBeforeEdit, typeOrderServer = _a.typeOrderServer, orderByserver = _a.orderByserver;
    var TabsDropDowns = ITabs["default"].TabsDropDowns;
    var _c = react_1.useState(false), isOpenModal = _c[0], setIsOpenModal = _c[1];
    var tableRef = react_1.useRef(null);
    var tabsDropDowns = TabsDropDowns("listas");
    tabsDropDowns.map(function (tab) {
        return tab.titleTab === "ENSAIO" ? (tab.statusTab = true) : (tab.statusTab = false);
    });
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.genotypeTreatment || {
        id: 0,
        table_preferences: "id,foco,type_assay,tecnologia,gli,bgm,treatments_number,status,statusAssay,genotipoName,nca"
    };
    var _d = react_1.useState(preferences.table_preferences), camposGerenciados = _d[0], setCamposGerenciados = _d[1];
    var _e = react_1.useState([]), treatments = _e[0], setTreatments = _e[1];
    var _f = react_1.useState(false), tableMessage = _f[0], setMessage = _f[1];
    var _g = react_1.useState(0), currentPage = _g[0], setCurrentPage = _g[1];
    var _h = react_1.useState(1), orderList = _h[0], setOrder = _h[1];
    var _j = react_1.useState(false), afterFilter = _j[0], setAfterFilter = _j[1];
    var _k = react_1.useState(filterBeforeEdit), filtersParams = _k[0], setFiltersParams = _k[1];
    var _l = react_1.useState(filterApplication), filter = _l[0], setFilter = _l[1];
    var _m = react_1.useState(0), itemsTotal = _m[0], setTotalItems = _m[1];
    var _o = react_1.useState(function () { return [
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
            title: "Nome da tecnologia",
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
            title: "BGM",
            value: "bgm",
            defaultChecked: function () { return camposGerenciados.includes("bgm"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "NT",
            value: "treatments_number",
            defaultChecked: function () { return camposGerenciados.includes("treatments_number"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Status T",
            value: "status",
            defaultChecked: function () { return camposGerenciados.includes("status"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Status do Ensaio",
            value: "statusAssay",
            defaultChecked: function () { return camposGerenciados.includes("statusAssay"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "Nome do genótipo",
            value: "genotipoName",
            defaultChecked: function () { return camposGerenciados.includes("genotipoName"); }
        },
        {
            name: "CamposGerenciados[]",
            title: "NCA",
            value: "nca",
            defaultChecked: function () { return camposGerenciados.includes("nca"); }
        },
    ]; }), generatesProps = _o[0], setGeneratesProps = _o[1];
    var _p = react_1.useState(function () { return [
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
    var _q = react_1.useState([]), statusFilterSelected = _q[0], setStatusFilterSelected = _q[1];
    // const [orderBy, setOrderBy] = useState<string>('');
    var _r = react_1.useState(""), orderType = _r[0], setOrderType = _r[1];
    var router = router_1.useRouter();
    var _s = react_1.useState(false), statusAccordion = _s[0], setStatusAccordion = _s[1];
    // const take: number = itensPerPage;
    var _t = react_1.useState(itensPerPage), take = _t[0], setTake = _t[1];
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _u = react_1.useState(false), nccIsValid = _u[0], setNccIsValid = _u[1];
    var _v = react_1.useState(false), genotypeIsValid = _v[0], setGenotypeIsValid = _v[1];
    var _w = react_1.useState([]), rowsSelected = _w[0], setRowsSelected = _w[1];
    var _x = react_1.useState(""), arrowOrder = _x[0], setArrowOrder = _x[1];
    var _y = react_1.useState(orderByserver), orderBy = _y[0], setOrderBy = _y[1];
    var _z = react_1.useState(typeOrderServer), typeOrder = _z[0], setTypeOrder = _z[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + (orderBy == "tecnologia" ? "genotipo.tecnologia.cod_tec" : orderBy) + "&typeOrder=" + typeOrder;
    var formik = formik_1.useFormik({
        initialValues: {
            filterFoco: checkValue("filterFoco"),
            filterTypeAssay: checkValue("filterTypeAssay"),
            filterTechnology: checkValue("filterTechnology"),
            filterGli: checkValue("filterGli"),
            filterBgm: checkValue("filterBgm"),
            filterTreatmentsNumber: checkValue("filterTreatmentsNumber"),
            filterStatus: checkValue("filterStatus"),
            filterCodTec: checkValue("filterCodTec"),
            filterStatusAssay: checkValue("filterStatusAssay"),
            filterGenotypeName: checkValue("filterGenotypeName"),
            filterNca: checkValue("filterNca"),
            orderBy: "",
            typeOrder: "",
            filterBgmTo: checkValue("filterBgmTo"),
            filterBgmFrom: checkValue("filterBgmFrom"),
            filterNtTo: checkValue("filterNtTo"),
            filterNtFrom: checkValue("filterNtFrom"),
            filterStatusT: checkValue("filterStatusT")
        },
        onSubmit: function (_a) {
            var filterFoco = _a.filterFoco, filterTypeAssay = _a.filterTypeAssay, filterTechnology = _a.filterTechnology, filterGli = _a.filterGli, filterBgm = _a.filterBgm, filterTreatmentsNumber = _a.filterTreatmentsNumber, filterStatusAssay = _a.filterStatusAssay, filterGenotypeName = _a.filterGenotypeName, filterNca = _a.filterNca, filterBgmTo = _a.filterBgmTo, filterBgmFrom = _a.filterBgmFrom, filterNtTo = _a.filterNtTo, filterNtFrom = _a.filterNtFrom, filterStatusT = _a.filterStatusT, 
            //filterStatus,
            filterCodTec = _a.filterCodTec;
            return __awaiter(_this, void 0, void 0, function () {
                var allCheckBox, selecionados, i, filterStatus, parametersFilter;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            allCheckBox = document.querySelectorAll("input[name='StatusCheckbox']");
                            selecionados = "";
                            for (i = 0; i < allCheckBox.length; i += 1) {
                                if (allCheckBox[i].checked) {
                                    selecionados += allCheckBox[i].value + ",";
                                }
                            }
                            filterStatus = (_b = statusFilterSelected === null || statusFilterSelected === void 0 ? void 0 : statusFilterSelected.join(",")) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                            parametersFilter = "&filterFoco=" + filterFoco + "&filterTypeAssay=" + filterTypeAssay + "&filterTechnology=" + filterTechnology + "&filterGli=" + filterGli + "&filterBgm=" + filterBgm + "&filterTreatmentsNumber=" + filterTreatmentsNumber + "&filterStatus=" + filterStatus + "&filterStatusAssay=" + filterStatusAssay + "&filterGenotypeName=" + filterGenotypeName + "&filterNca=" + filterNca + "&id_safra=" + idSafra + "&filterBgmTo=" + filterBgmTo + "&filterBgmFrom=" + filterBgmFrom + "&filterNtTo=" + filterNtTo + "&filterNtFrom=" + filterNtFrom + "&filterStatusT=" + filterStatusT + "&filterCodTec=" + filterCodTec + "&status_experiment=" + "IMPORTADO";
                            // setFiltersParams(parametersFilter);
                            // setCookies('filterBeforeEdit', filtersParams);
                            // await genotypeTreatmentService
                            //   .getAll(`${parametersFilter}`)
                            //   .then(({ response, total: allTotal }) => {
                            //     setFilter(parametersFilter);
                            //     setTreatments(response);
                            //     setTotalItems(allTotal);
                            //     setAfterFilter(true);
                            //     setCurrentPage(0);
                            //     setMessage(true);
                            //     tableRef.current.dataManager.changePageSize(allTotal >= take ? take : allTotal);
                            //   });
                            setFilter(parametersFilter);
                            setCurrentPage(0);
                            return [4 /*yield*/, callingApi(parametersFilter)];
                        case 1:
                            _c.sent();
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
                        return [4 /*yield*/, services_1.genotypeTreatmentService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setTreatments(response.response);
                                    setTotalItems(response.total);
                                    setAfterFilter(true);
                                    setMessage(true);
                                    tableRef.current.dataManager.changePageSize(response.total >= take ? take : response.total);
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
                react_1["default"].createElement("div", null, rowData.assay_list.tecnologia.cod_tec + " " + rowData.assay_list.tecnologia.name))); }
        };
    }
    function orderColumns(columnsOrder) {
        var columnOrder = columnsOrder.split(",");
        var tableFields = [];
        Object.keys(columnOrder).forEach(function (item) {
            if (columnOrder[item] === "foco") {
                tableFields.push(headerTableFactory("Foco", "assay_list.foco.name"));
            }
            if (columnOrder[item] === "type_assay") {
                tableFields.push(headerTableFactory("Ensaio", "assay_list.type_assay.name"));
            }
            if (columnOrder[item] === "tecnologia") {
                tableFields.push(tecnologiaHeaderFactory("Tecnologia", "tecnologia"));
            }
            if (columnOrder[item] === "gli") {
                tableFields.push(headerTableFactory("GLI", "assay_list.gli"));
            }
            if (columnOrder[item] === "bgm") {
                tableFields.push(headerTableFactory("BGM", "assay_list.bgm"));
            }
            if (columnOrder[item] === "treatments_number") {
                tableFields.push(headerTableFactory("NT", "treatments_number"));
            }
            if (columnOrder[item] === "status") {
                tableFields.push(headerTableFactory("Status T", "status"));
            }
            if (columnOrder[item] === "statusAssay") {
                tableFields.push(headerTableFactory("Status do ensaio", "assay_list.status"));
            }
            if (columnOrder[item] === "genotipoName") {
                tableFields.push(headerTableFactory("Nome do genótipo", "genotipo.name_genotipo", true));
            }
            if (columnOrder[item] === "nca") {
                tableFields.push(headerTableFactory("NCA", "lote.ncc", true));
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
                case 0: return [4 /*yield*/, services_1.genotypeTreatmentService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var _a;
                                var newItem = {};
                                newItem.SAFRA = item.safra.safraName;
                                newItem.FOCO = item.assay_list.foco.name;
                                newItem.ENSAIO = item.assay_list.type_assay.name;
                                newItem.TECNOLOGIA = item.assay_list.tecnologia.cod_tec + " " + item.assay_list.tecnologia.name;
                                newItem.GLI = item.assay_list.gli;
                                newItem.BGM = item.assay_list.bgm;
                                newItem.NT = item.treatments_number;
                                newItem.STATUS_T = item.status;
                                newItem.STATUS_ENSAIO = item.assay_list.status;
                                newItem.GENOTIPO = item.genotipo.name_genotipo;
                                newItem.NCA = (_a = item === null || item === void 0 ? void 0 : item.lote) === null || _a === void 0 ? void 0 : _a.ncc;
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
    var replacementExcel = function () { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, services_1.genotypeTreatmentService
                        .getAll(filter)
                        .then(function (_a) {
                        var status = _a.status, response = _a.response;
                        if (status === 200) {
                            var newData = response.map(function (item) {
                                var _a, _b, _c, _d, _e, _f;
                                var newItem = {};
                                newItem.safra = item.safra.safraName;
                                newItem.foco = (_a = item.assay_list) === null || _a === void 0 ? void 0 : _a.foco.name;
                                newItem.ensaio = (_b = item.assay_list) === null || _b === void 0 ? void 0 : _b.type_assay.name;
                                newItem.tecnologia = (_c = item.assay_list) === null || _c === void 0 ? void 0 : _c.tecnologia.cod_tec;
                                newItem.gli = (_d = item.assay_list) === null || _d === void 0 ? void 0 : _d.gli;
                                newItem.bgm = (_e = item.assay_list) === null || _e === void 0 ? void 0 : _e.bgm;
                                newItem.nt = item.treatments_number;
                                newItem.status_t = item.status;
                                newItem.genotipo = item.genotipo.name_genotipo;
                                newItem.nca = (_f = item.lote) === null || _f === void 0 ? void 0 : _f.ncc;
                                newItem.novo_genotipo = "";
                                newItem.novo_status = "";
                                newItem.novo_nca = "";
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
                    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
                    // } else {
                    //   parametersFilter = `skip=${skip}&take=${take}`;
                    // }
                    // if (filter) {
                    //   parametersFilter = `${parametersFilter}&${filter}`;
                    // }
                    // await genotypeTreatmentService
                    //   .getAll(parametersFilter)
                    //   .then(({ status, response, total }) => {
                    //     if (status === 200) {
                    //       setTreatments(response);
                    //       setTotalItems(total);
                    //       setAfterFilter(true);
                    //       setCurrentPage(0);
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
                        // await genotypeTreatmentService
                        //   .getAll(parametersFilter)
                        //   .then(({ status, response, total }) => {
                        //     if (status === 200) {
                        //       setTreatments(response);
                        //       setTotalItems(total);
                        //       setAfterFilter(true);
                        //       setCurrentPage(0);
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
    function filterFieldFactory(title, name) {
        return (react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-2" },
            react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, name),
            react_1["default"].createElement(components_1.Input, { type: "text", placeholder: name, id: title, name: title, 
                // defaultValue={title}
                onChange: formik.handleChange })));
    }
    function readExcel(value) {
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
                var message = _a.message;
                sweetalert2_1["default"].fire({
                    html: message,
                    width: "800"
                });
            });
        });
    }
    function handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var genotypeButton, ncaButton, inputFile, checkedTreatments, checkedTreatmentsLocal, checkedTreatments, checkedTreatmentsLocal;
            return __generator(this, function (_a) {
                genotypeButton = document.querySelector("input[id='genotipo']:checked");
                ncaButton = document.querySelector("input[id='nca']:checked");
                inputFile = document.getElementById("import");
                event.preventDefault();
                if (genotypeButton) {
                    checkedTreatments = rowsSelected.map(function (item) { return ({
                        id: item.id,
                        idGenotipo: item.id_genotipo,
                        idLote: item.id_lote
                    }); });
                    checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
                    localStorage.setItem("checkedTreatments", checkedTreatmentsLocal);
                    localStorage.setItem("treatmentsOptionSelected", JSON.stringify("genotipo"));
                    cookies_next_1.setCookies("pageBeforeEdit", currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                    cookies_next_1.setCookies("filterBeforeEdit", filter);
                    cookies_next_1.setCookies("filterBeforeEditTypeOrder", typeOrder);
                    cookies_next_1.setCookies("filterBeforeEditOrderBy", orderBy);
                    cookies_next_1.setCookies("filtersParams", filtersParams);
                    cookies_next_1.setCookies("lastPage", "substituicao");
                    router.push("/listas/ensaios/genotipos-ensaio/substituicao?value=ensaios");
                }
                else if (ncaButton) {
                    checkedTreatments = rowsSelected.map(function (item) { return ({
                        id: item.id,
                        idGenotipo: item.id_genotipo,
                        idLote: item.id_lote
                    }); });
                    checkedTreatmentsLocal = JSON.stringify(checkedTreatments);
                    localStorage.setItem("checkedTreatments", checkedTreatmentsLocal);
                    localStorage.setItem("treatmentsOptionSelected", JSON.stringify("nca"));
                    cookies_next_1.setCookies("pageBeforeEdit", currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                    cookies_next_1.setCookies("filterBeforeEdit", filter);
                    cookies_next_1.setCookies("filterBeforeEditTypeOrder", typeOrder);
                    cookies_next_1.setCookies("filterBeforeEditOrderBy", orderBy);
                    cookies_next_1.setCookies("filtersParams", filtersParams);
                    cookies_next_1.setCookies("lastPage", "substituicao");
                    router.push("/listas/ensaios/genotipos-ensaio/substituicao?value=ensaios");
                }
                else if ((inputFile === null || inputFile === void 0 ? void 0 : inputFile.files.length) !== 0) {
                    readExcel(inputFile.files);
                }
                else {
                    sweetalert2_1["default"].fire("Selecione alguma opção ou import");
                }
                return [2 /*return*/];
            });
        });
    }
    function setRadioStatus() {
        return __awaiter(this, void 0, void 0, function () {
            var selectedGenotype, checkedLength;
            return __generator(this, function (_a) {
                selectedGenotype = {};
                rowsSelected.forEach(function (item) {
                    selectedGenotype[item.genotipo.name_genotipo] = true;
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
    react_1.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    function removeSameItems(data) {
        var newList = [];
        data === null || data === void 0 ? void 0 : data.map(function (i) {
            var item = newList === null || newList === void 0 ? void 0 : newList.filter(function (x) { return x.name == i.name; });
            if ((item === null || item === void 0 ? void 0 : item.length) <= 0)
                newList.push({ id: i.id, name: i.name });
        });
        var sortList = newList === null || newList === void 0 ? void 0 : newList.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
        return sortList;
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(head_1["default"], null,
            react_1["default"].createElement("title", null, "Listagem de gen\u00F3tipos do ensaio")),
        react_1["default"].createElement(react_modal_1["default"], { isOpen: isOpenModal, shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, onRequestClose: function () { return setIsOpenModal(!isOpenModal); }, overlayClassName: "fixed inset-0 flex bg-transparent justify-center items-center bg-white/75", className: "flex\n          flex-col\n          w-full\n          h-64\n          max-w-xl\n          bg-gray-50\n          rounded-tl-2xl\n          rounded-tr-2xl\n          rounded-br-2xl\n          rounded-bl-2xl\n          pt-2\n          pb-4\n          px-8\n          relative\n          shadow-lg\n          shadow-gray-900/50" },
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
                react_1["default"].createElement(components_1.AccordionFilter, { title: "Filtrar gen\u00F3tipos do ensaio" },
                    react_1["default"].createElement("div", { className: "w-full flex gap-2 z-1" },
                        react_1["default"].createElement("form", { className: "flex flex-col\n                  w-full\n                  items-center\n                  px-1\n                  bg-white\n                ", onSubmit: formik.handleSubmit },
                            react_1["default"].createElement("div", { className: "w-full h-full\n                  flex\n                  justify-center\n                  pb-6\n                " },
                                filterFieldFactory("filterFoco", "Foco"),
                                filterFieldFactory("filterTypeAssay", "Ensaio"),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "C\u00F3d. Tecnologia"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "C\u00F3d. Tecnologia", id: "filterCodTec", name: "filterCodTec", onChange: formik.handleChange }))),
                                filterFieldFactory("filterTechnology", "Nome da tecnologia"),
                                filterFieldFactory("filterGli", "GLI"),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "BGM"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterBgmFrom", name: "filterBgmFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterBgmTo", name: "filterBgmTo", onChange: formik.handleChange })))),
                            react_1["default"].createElement("div", { className: "w-full h-full\n                  flex\n                  justify-center\n                  pt-2\n                  pb-0\n                  " },
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "NT"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "De", id: "filterNtFrom", name: "filterNtFrom", onChange: formik.handleChange }),
                                        react_1["default"].createElement(components_1.Input, { style: { marginLeft: 8 }, placeholder: "At\u00E9", id: "filterNtTo", name: "filterNtTo", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-6 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status T"),
                                    react_1["default"].createElement("div", { className: "flex" },
                                        react_1["default"].createElement(components_1.Input, { placeholder: "Status T", id: "filterStatusT", name: "filterStatusT", onChange: formik.handleChange }))),
                                react_1["default"].createElement("div", { className: "h-10 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Status do Ensaio"),
                                    react_1["default"].createElement(components_1.SelectMultiple, { data: statusFilter.map(function (i) { return i.title; }), values: statusFilterSelected, onChange: function (e) { return setStatusFilterSelected(e); } })),
                                react_1["default"].createElement("div", { className: "h-7 w-1/2 ml-2" },
                                    react_1["default"].createElement("label", { className: "block text-gray-900 text-sm font-bold mb-1" }, "Nome do gen\u00F3tipo"),
                                    react_1["default"].createElement(components_1.SelectAutoComplete, { data: (_b = removeSameItems(genotypeSelect)) === null || _b === void 0 ? void 0 : _b.map(function (i) { return i.name; }), value: checkValue("filterGenotypeName"), onChange: function (e) {
                                            return formik.setFieldValue("filterGenotypeName", e);
                                        } })),
                                filterFieldFactory("filterNca", "NCA"),
                                react_1["default"].createElement(components_1.FieldItemsPerPage, { selected: take, onChange: setTake }),
                                react_1["default"].createElement("div", { style: { width: 40 } }),
                                react_1["default"].createElement("div", { className: "h-7 w-32 mt-6" },
                                    react_1["default"].createElement(components_1.Button, { onClick: function () { }, value: "Filtrar", type: "submit", bgColor: "bg-blue-600", textColor: "white", icon: react_1["default"].createElement(bi_1.BiFilterAlt, { size: 20 }) })))))),
                react_1["default"].createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    react_1["default"].createElement(material_table_1["default"], { tableRef: tableRef, style: { background: "#f9fafb" }, columns: columns, data: afterFilter ? treatments : [], options: {
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
                                    : "ATENÇÃO, VOCÊ PRECISA APLICAR O FILTRO PARA VER OS REGISTROS."
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
        var PreferencesControllers, itensPerPage, lastPageServer, pageBeforeEdit, filterBeforeEdit, token, idCulture, idSafra, typeOrderServer, orderByserver, publicRuntimeConfig, baseUrlTreatment, baseUrlAssay, filterApplication, param, urlParametersAssay, urlParametersTreatment, requestOptions, _b, _c, allTreatments, _d, totalItems, allAssay, assaySelect, genotypeSelect;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_f = (_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.response[0]) === null || _f === void 0 ? void 0 : _f.itens_per_page)];
                case 2:
                    itensPerPage = _g.sent();
                    lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : "No";
                    if (lastPageServer == undefined || lastPageServer == "No") {
                        cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                        cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditTypeOrder", { req: req, res: res });
                        cookies_next_1.removeCookies("filterBeforeEditOrderBy", { req: req, res: res });
                        cookies_next_1.removeCookies("lastPage", { req: req, res: res });
                    }
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
                    filterBeforeEdit = req.cookies.filterBeforeEdit
                        ? req.cookies.filterBeforeEdit
                        : "";
                    token = req.cookies.token;
                    idCulture = req.cookies.cultureId;
                    idSafra = req.cookies.safraId;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : "desc";
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : "assay_list.foco.name";
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    baseUrlTreatment = publicRuntimeConfig.apiUrl + "/genotype-treatment";
                    baseUrlAssay = publicRuntimeConfig.apiUrl + "/assay-list";
                    filterApplication = req.cookies.filterBeforeEdit ||
                        "&id_culture=" + idCulture + "&id_safra=" + idSafra + "&status_experiment=" + "IMPORTADO";
                    cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                    cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                    // RR
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
                    _b = _g.sent(), _c = _b.response, allTreatments = _c === void 0 ? [] : _c, _d = _b.total, totalItems = _d === void 0 ? 0 : _d;
                    return [4 /*yield*/, fetch(urlParametersAssay.toString() + "/?id_culture=" + idCulture + "&id_safra=" + idSafra, requestOptions).then(function (response) { return response.json(); })];
                case 4:
                    allAssay = (_g.sent()).response;
                    assaySelect = allAssay.map(function (item) {
                        var newItem = {};
                        newItem.id = item.gli;
                        newItem.name = item.gli;
                        return newItem;
                    });
                    genotypeSelect = allTreatments === null || allTreatments === void 0 ? void 0 : allTreatments.map(function (item) {
                        var newItem = {};
                        newItem.id = item.genotipo.name_genotipo;
                        newItem.name = item.genotipo.name_genotipo;
                        return newItem;
                    });
                    return [2 /*return*/, {
                            props: {
                                allTreatments: allTreatments,
                                assaySelect: assaySelect,
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
