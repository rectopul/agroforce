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
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
var cookies_next_1 = require("cookies-next");
var formik_1 = require("formik");
var material_table_1 = require("material-table");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_1 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var ai_1 = require("react-icons/ai");
var bi_1 = require("react-icons/bi");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var io_1 = require("react-icons/io");
var sweetalert2_1 = require("sweetalert2");
var XLSX = require("xlsx");
var bs_1 = require("react-icons/bs");
var experiment_genotipe_service_1 = require("src/services/experiment-genotipe.service");
var user_preference_controller_1 = require("../../../../controllers/user-preference.controller");
var services_1 = require("../../../../services");
var experiment_service_1 = require("../../../../services/experiment.service");
var components_1 = require("../../../../components");
var Loading_1 = require("../../../../components/Loading");
var dropdown_1 = require("../../../../shared/utils/dropdown");
function Listagem(_a) {
    var _this = this;
    var itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, idSafra = _a.idSafra, pageBeforeEdit = _a.pageBeforeEdit, filterBeforeEdit = _a.filterBeforeEdit;
    var tabsOperation = dropdown_1["default"].tabsOperation;
    var tabsOperationMenu = tabsOperation.map(function (i) {
        return i.titleTab === "AMBIENTE" ? __assign(__assign({}, i), { statusTab: true }) : i;
    });
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.experimento || {
        id: 0,
        table_preferences: "id,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,countNT,npeQT"
    };
    var _b = react_1.useState(preferences.table_preferences), camposGerenciados = _b[0], setCamposGerenciados = _b[1];
    var router = router_1.useRouter();
    var _c = react_1.useState([]), experimentos = _c[0], setExperimento = _c[1];
    var _d = react_1.useState([]), experimentosNew = _d[0], setExperimentoNew = _d[1];
    var _e = react_1.useState(Number(pageBeforeEdit)), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = react_1.useState(filterBeforeEdit), filter = _f[0], setFilter = _f[1];
    var _g = react_1.useState(0), itemsTotal = _g[0], setTotalItems = _g[1];
    var _h = react_1.useState(1), orderList = _h[0], setOrder = _h[1];
    var _j = react_1.useState(0), lastExperimentNPE = _j[0], setLastExperimentNPE = _j[1];
    var _k = react_1.useState(""), arrowOrder = _k[0], setArrowOrder = _k[1];
    var _l = react_1.useState(false), SortearDisable = _l[0], setSortearDisable = _l[1];
    var _m = react_1.useState(false), statusAccordion = _m[0], setStatusAccordion = _m[1];
    var _o = react_1.useState(function () { return [
        // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
        { name: "CamposGerenciados[]", title: "GLI", value: "gli" },
        {
            name: "CamposGerenciados[]",
            title: "Nome do experimento",
            value: "experimentName"
        },
        { name: "CamposGerenciados[]", title: "Nome tec.", value: "tecnologia" },
        { name: "CamposGerenciados[]", title: "Época", value: "period" },
        {
            name: "CamposGerenciados[]",
            title: "Delineamento",
            value: "delineamento"
        },
        { name: "CamposGerenciados[]", title: "Rep.", value: "repetitionsNumber" },
        {
            name: "CamposGerenciados[]",
            title: "Number of treatment",
            value: "countNT"
        },
        {
            name: "CamposGerenciados[]",
            title: "NPE Inicial",
            value: "repetitionsNumber"
        },
        {
            name: "CamposGerenciados[]",
            title: "NPE Final",
            value: "repetitionsNumber"
        },
        { name: "CamposGerenciados[]", title: "QT. NPE", value: "npeQT" },
    ]; }), generatesProps = _o[0], setGeneratesProps = _o[1];
    var _p = react_1.useState(""), colorStar = _p[0], setColorStar = _p[1];
    var _q = react_1.useState(null), NPESelectedRow = _q[0], setNPESelectedRow = _q[1];
    var _r = react_1.useState(0), npeUsedFrom = _r[0], setNpeUsedFrom = _r[1];
    var _s = react_1.useState(false), isOpenModal = _s[0], setIsOpenModal = _s[1];
    var _t = react_1.useState(false), loading = _t[0], setLoading = _t[1];
    var take = itensPerPage;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _u = react_1.useState(JSON.parse(localStorage.getItem("selectedNPE"))), selectedNPE = _u[0], setSelectedNPE = _u[1];
    // let selectedNPE = JSON.parse(localStorage.getItem('selectedNPE') as string);
    var formik = formik_1.useFormik({
        initialValues: {
            filterFoco: "",
            filterTypeAssay: "",
            filterGli: "",
            filterExperimentName: "",
            filterTecnologia: "",
            filterPeriod: "",
            filterDelineamento: "",
            filterRepetition: "",
            orderBy: "",
            typeOrder: ""
        },
        onSubmit: function (_a) {
            var filterFoco = _a.filterFoco, filterTypeAssay = _a.filterTypeAssay, filterGli = _a.filterGli, filterExperimentName = _a.filterExperimentName, filterTecnologia = _a.filterTecnologia, filterPeriod = _a.filterPeriod, filterDelineamento = _a.filterDelineamento, filterRepetition = _a.filterRepetition;
            return __awaiter(_this, void 0, void 0, function () {
                var parametersFilter;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            parametersFilter = "filterFoco=" + filterFoco + "&filterTypeAssay=" + filterTypeAssay + "&filterGli=" + filterGli + "&filterExperimentName=" + filterExperimentName + "&filterTecnologia=" + filterTecnologia + "&filterPeriod=" + filterPeriod + "&filterRepetition=" + filterRepetition + "&filterDelineamento=" + filterDelineamento + "&idSafra=" + idSafra;
                            setFilter(parametersFilter);
                            cookies_next_1.setCookies("filterBeforeEdit", filter);
                            return [4 /*yield*/, experiment_service_1.experimentService
                                    .getAll(parametersFilter + "&skip=0&take=" + itensPerPage)
                                    .then(function (response) {
                                    setFilter(parametersFilter);
                                    setExperimento(response.response);
                                    setTotalItems(response.total);
                                    setCurrentPage(0);
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
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
                        return [4 /*yield*/, experiment_service_1.experimentService
                                .getAll(parametersFilter + "&skip=0&take=" + take)
                                .then(function (_a) {
                                var status = _a.status, response = _a.response;
                                if (status === 200) {
                                    setExperimento(response);
                                }
                            })];
                    case 1:
                        _a.sent();
                        if (orderList === 2) {
                            setOrder(0);
                            setArrowOrder(React.createElement(ai_1.AiOutlineArrowDown, null));
                        }
                        else {
                            setOrder(orderList + 1);
                            if (orderList === 1) {
                                setArrowOrder(React.createElement(ai_1.AiOutlineArrowUp, null));
                            }
                            else {
                                setArrowOrder("");
                            }
                        }
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
            sorting: false
        };
    }
    function idHeaderFactory() {
        return {
            title: React.createElement("div", { className: "flex items-center" }, arrowOrder),
            field: "id",
            width: 0,
            sorting: false,
            render: function () {
                return colorStar === "#eba417" ? (React.createElement("div", { className: "h-10 flex" },
                    React.createElement("div", null,
                        React.createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar(""); } },
                            React.createElement(ai_1.AiTwotoneStar, { size: 25, color: "#eba417" }))))) : (React.createElement("div", { className: "h-10 flex" },
                    React.createElement("div", null,
                        React.createElement("button", { type: "button", className: "w-full h-full flex items-center justify-center border-0", onClick: function () { return setColorStar("#eba417"); } },
                            React.createElement(ai_1.AiTwotoneStar, { size: 25 })))));
            }
        };
    }
    function deleteItem(id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, experiment_service_1.experimentService.deleted(id)];
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
    function statusHeaderFactory() {
        return {
            title: "Ações",
            field: "action",
            sorting: false,
            searchable: false,
            render: function (rowData) { return (React.createElement("div", { className: "h-10 flex" },
                React.createElement("div", { className: "h-10" },
                    React.createElement(components_1.Button, { icon: React.createElement(bi_1.BiEdit, { size: 16 }), title: "Atualizar " + rowData.experiment_name, onClick: function () {
                            cookies_next_1.setCookies("pageBeforeEdit", currentPage === null || currentPage === void 0 ? void 0 : currentPage.toString());
                            cookies_next_1.setCookies("filterBeforeEdit", filter);
                            router.push("/listas/experimentos/experimento/atualizar?id=" + rowData.id);
                        }, bgColor: "bg-blue-600", textColor: "white" })),
                React.createElement("div", null,
                    React.createElement(components_1.Button, { icon: React.createElement(bs_1.BsTrashFill, { size: 16 }), onClick: function () { return deleteItem(rowData.id); }, bgColor: "bg-red-600", textColor: "white" })))); }
        };
    }
    function columnsOrder(columnsCampos) {
        var columnCampos = columnsCampos.split(",");
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (_, index) {
            // if (columnCampos[index] === 'id') {
            //   tableFields.push(idHeaderFactory());
            // }
            if (columnCampos[index] === "gli") {
                tableFields.push(headerTableFactory("GLI", "assay_list.gli"));
            }
            if (columnCampos[index] === "tecnologia") {
                tableFields.push(headerTableFactory("Cód tec", "assay_list.tecnologia.name"));
            }
            if (columnCampos[index] === "experimentName") {
                tableFields.push(headerTableFactory("Nome experimento", "experimentName"));
            }
            if (columnCampos[index] === "period") {
                tableFields.push(headerTableFactory("Época", "period"));
            }
            if (columnCampos[index] === "delineamento") {
                tableFields.push(headerTableFactory("Delineamento", "delineamento.name"));
            }
            if (columnCampos[index] === "repetitionsNumber") {
                tableFields.push(headerTableFactory("Rep.", "repetitionsNumber"));
            }
        });
        tableFields.push(headerTableFactory("Number of Treatment", "countNT"));
        tableFields.push(headerTableFactory("NPE Inicial", "npei"));
        tableFields.push(headerTableFactory("NPE Final", "npef"));
        tableFields.push(headerTableFactory("QT. NPE", "npeQT"));
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
        var excelFilters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    excelFilters = filterApplication + "&paramSelect=" + camposGerenciados;
                    // if (!filterApplication.includes('paramSelect')) {
                    //   filterApplication +=
                    // }
                    return [4 /*yield*/, experiment_service_1.experimentService
                            .getAll(excelFilters)
                            .then(function (_a) {
                            var status = _a.status, response = _a.response, message = _a.message;
                            if (status === 200) {
                                response.map(function (item) {
                                    var newItem = item;
                                    if (item.assay_list) {
                                        newItem.gli = item.assay_list.gli;
                                        newItem.foco = item.assay_list.foco.name;
                                        newItem.type_assay = item.assay_list.type_assay.name;
                                        newItem.tecnologia = item.assay_list.tecnologia.name;
                                    }
                                    if (item.delineamento) {
                                        newItem.repeticao = item.delineamento.repeticao;
                                        newItem.delineamento = item.delineamento.name;
                                    }
                                    delete newItem.assay_list;
                                    return newItem;
                                });
                                var workSheet = XLSX.utils.json_to_sheet(response);
                                var workBook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(workBook, workSheet, "experimentos");
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
                            else {
                                sweetalert2_1["default"].fire(message);
                            }
                        })];
                case 1:
                    // if (!filterApplication.includes('paramSelect')) {
                    //   filterApplication +=
                    // }
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
            var skip;
            return __generator(this, function (_a) {
                if (NPESelectedRow) {
                    skip = currentPage * Number(take);
                    setExperimentoNew(experimentos.slice(skip, skip + take));
                }
                return [2 /*return*/];
            });
        });
    }
    react_1.useLayoutEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    function filterFieldFactory(title, name) {
        return (React.createElement("div", { className: "h-10 w-1/2 ml-4" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-2" }, name),
            React.createElement(components_1.Input, { type: "text", placeholder: name, max: "40", id: title, name: title, onChange: formik.handleChange })));
    }
    var columnNPE = [
        { title: "Local", field: "local.name_local_culture" },
        { title: "Safra", field: "safra.safraName" },
        { title: "Foco", field: "foco.name" },
        { title: "Ensaio", field: "type_assay.name" },
        { title: "Tecnologia", field: "tecnologia.name" },
        { title: "Epoca", field: "epoca" },
        { title: "NPE Inicial", field: "prox_npe" },
        { title: "NPE Final", field: "npef" },
        { title: "NPE Quantity", field: "npeQT" },
    ];
    var handleNPERowSelection = function (rowData) {
        if ((NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.tableData.id) !== rowData.tableData.id) {
            rowData.tableData.checked = false;
        }
        else {
            rowData.tableData.checked = true;
        }
    };
    function getExperiments() {
        return __awaiter(this, void 0, Promise, function () {
            var skip, parametersFilter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!NPESelectedRow) return [3 /*break*/, 2];
                        skip = currentPage * Number(take);
                        parametersFilter = "idSafra=" + (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.safraId) + "&Foco=" + (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.foco.id) + "&Epoca=" + (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.epoca) + "&Tecnologia=" + (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.tecnologia.cod_tec) + "&TypeAssay=" + (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.type_assay.id) + "&Status=IMPORTADO";
                        if (filter) {
                            parametersFilter = parametersFilter + "&" + filter;
                        }
                        return [4 /*yield*/, experiment_service_1.experimentService.getAll(parametersFilter).then(function (_a) {
                                var status = _a.status, response = _a.response, total = _a.total;
                                if (status === 200 || status === 400) {
                                    var i_1 = 0;
                                    response.length > 0 ? i_1 = NPESelectedRow.prox_npe : i_1 = NPESelectedRow.npef;
                                    response.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            item.seq_delineamento.map(function (it) {
                                                item.npei = i_1;
                                                item.npef = i_1 + item.npeQT - 1;
                                                i_1 = item.npef + 1;
                                                i_1 >= NPESelectedRow.nextNPE.npei_i && npeUsedFrom == 0 ? setNpeUsedFrom(NPESelectedRow.nextNPE.npei_i) : '';
                                            });
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    setExperimento(response);
                                    setTotalItems(total);
                                }
                            })];
                    case 1:
                        _a.sent();
                        setLoading(false);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function createExperimentGenotipe(_a) {
        var data = _a.data, total_consumed = _a.total_consumed, genotipo_treatment = _a.genotipo_treatment;
        return __awaiter(this, void 0, void 0, function () {
            var lastNpe_1, experimentObj_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(data.length > 0)) return [3 /*break*/, 3];
                        lastNpe_1 = data[Object.keys(data)[Object.keys(data).length - 1]].npe;
                        experimentObj_1 = [];
                        experimentos.map(function (item) {
                            var data = {};
                            data.id = Number(item.id);
                            data.status = "SORTEADO";
                            experimentObj_1.push(data);
                        });
                        if (!((NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.npeQT) == "N/A"
                            ? true
                            : (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.npeQT) - total_consumed > 0
                                && lastNpe_1 < (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.nextNPE.npei_i))) return [3 /*break*/, 2];
                        setLoading(true);
                        return [4 /*yield*/, experiment_genotipe_service_1.experimentGenotipeService
                                .create(data)
                                .then(function (_a) {
                                var status = _a.status, response = _a.response;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!(status === 200)) return [3 /*break*/, 2];
                                                genotipo_treatment.map(function (gt) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        services_1.genotypeTreatmentService
                                                            .update(gt)
                                                            .then(function (_a) {
                                                            var status = _a.status, message = _a.message;
                                                        });
                                                        return [2 /*return*/];
                                                    });
                                                }); });
                                                experimentObj_1.map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, experiment_service_1.experimentService
                                                                    .update(x)
                                                                    .then(function (_a) {
                                                                    var status = _a.status, response = _a.response;
                                                                })];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); });
                                                return [4 /*yield*/, services_1.npeService
                                                        .update({
                                                        id: NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.id,
                                                        npef: lastNpe_1,
                                                        npeQT: (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.npeQT) == "N/A"
                                                            ? null
                                                            : (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.npeQT) - total_consumed,
                                                        status: 3,
                                                        prox_npe: lastNpe_1 + 1
                                                    })
                                                        .then(function (_a) {
                                                        var status = _a.status, resposne = _a.resposne;
                                                        if (status === 200) {
                                                            router.push("/operacao/ambiente");
                                                        }
                                                    })];
                                            case 1:
                                                _b.sent();
                                                _b.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                    case 1:
                        _b.sent();
                        setLoading(false);
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        sweetalert2_1["default"].fire("Nenhum experimento para desenhar");
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function validateConsumedData() {
        if (!SortearDisable) {
            var experiment_genotipo_1 = [];
            var genotipo_treatment_1 = [];
            var npei_1 = Number(NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.npei_i);
            experimentos === null || experimentos === void 0 ? void 0 : experimentos.map(function (item) {
                item.assay_list.genotype_treatment.map(function (gt) {
                    console.log(" item  ", item.seq_delineamento);
                    item.seq_delineamento.map(function (sd) {
                        var data = {};
                        data.idSafra = gt.id_safra;
                        data.idFoco = item.assay_list.foco.id;
                        data.idTypeAssay = item.assay_list.type_assay.id;
                        data.idTecnologia = item.assay_list.tecnologia.id;
                        data.gli = item.assay_list.gli;
                        data.idExperiment = item.id;
                        data.rep = item.delineamento.repeticao;
                        data.nt = gt.treatments_number;
                        data.idLote = gt.id_lote;
                        data.npe = npei_1;
                        data.idLote = gt.genotipo.id_lote;
                        data.idGenotipo = gt.genotipo.id; // Added new field
                        data.id_seq_delineamento = sd.id;
                        data.nca = "";
                        experiment_genotipo_1.push(data);
                        npei_1++;
                    });
                    var gt_new = {};
                    gt_new.id = gt.id;
                    gt_new.status_experiment = "EXP. SORTEADO";
                    genotipo_treatment_1.push(gt_new);
                });
            });
            // console.log("data  ",experiment_genotipo);
            // return false;
            createExperimentGenotipe({
                data: experiment_genotipo_1,
                total_consumed: experiment_genotipo_1.length,
                genotipo_treatment: genotipo_treatment_1
            });
        }
        else {
            var temp = NPESelectedRow;
            sweetalert2_1["default"].fire({
                title: "NPE Já usado !!!",
                html: "Existem NPE usados \u200B\u200Bentre <b>" + npeUsedFrom + "</b> e <b>" + temp.npef + "</b><br><br>" +
                    ("Estes foram selecionados para : <br><div style='text-align: center'><p style='text-align:left; max-width:255px; margin:auto;'><b> Foco : " + temp.nextNPE.foco.name + "</b><br><b> Ensaio : " + temp.nextNPE.type_assay.name + "</b><br><b> Local : " + temp.nextNPE.local.name_local_culture + "</b><br><b>Epoca : " + temp.nextNPE.epoca + "</b><br><b>Tecnologia : " + temp.nextNPE.tecnologia.name + "</b></p><br>") +
                    ("O pr\u00F3ximo NPE dispon\u00EDvel \u00E9 <strong>" + temp.nextAvailableNPE + "</strong></div>"),
                icon: "warning",
                showCloseButton: true,
                closeButtonHtml: '<span style="background-color:#FF5349; color:#fff; width:35px; height:35px; border-radius:35px; font-size:23px;font-weight:600">x</span>',
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Acesse o NPE e atualize"
            }).then(function (result) {
                if (result.isConfirmed) {
                    router.push({
                        pathname: "/config/ambiente"
                    });
                }
            });
        }
    }
    react_1.useEffect(function () {
        getExperiments();
    }, [NPESelectedRow]);
    react_1.useEffect(function () {
        var count = 0;
        experimentos.map(function (item) {
            item.npei <= (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.nextNPE.npei_i)
                && item.npef >= (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.nextNPE.npei_i)
                && (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.nextNPE) != 0
                ? count++
                : "";
        });
        count > 0 ? setSortearDisable(true) : setSortearDisable(false);
        setExperimentoNew(experimentos.slice(0, 10));
        if (NPESelectedRow) {
            selectedNPE.filter(function (x) { return x == NPESelectedRow; })[0].npef = experimentos.length > 0 ? experimentos[experimentos.length - 1].npef : NPESelectedRow.npef;
        }
    }, [experimentos]);
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "Listagem de experimentos")),
        loading && React.createElement(Loading_1["default"], null),
        React.createElement(components_1.Content, { contentHeader: tabsOperationMenu, moduloActive: "operacao" },
            React.createElement("main", { className: "h-full w-full\n                        flex flex-col\n                        items-start\n                        gap-0\n                        " },
                React.createElement("div", { className: "w-full " + ((selectedNPE === null || selectedNPE === void 0 ? void 0 : selectedNPE.length) > 3 && 'max-h-40 overflow-y-scroll') + " mb-4" },
                    React.createElement(material_table_1["default"], { style: {
                            background: "#f9fafb",
                            paddingBottom: (selectedNPE === null || selectedNPE === void 0 ? void 0 : selectedNPE.length) > 3 ? 0 : "5px"
                        }, columns: columnNPE, data: selectedNPE, onRowClick: function (evt, selectedRow) {
                            setNPESelectedRow(selectedRow);
                            selectedRow.tableData.checked = true;
                        }, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20,
                                height: 40
                            },
                            rowStyle: function (rowData) {
                                var _a;
                                return ({
                                    backgroundColor: ((_a = NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.tableData) === null || _a === void 0 ? void 0 : _a.id) === rowData.tableData.id
                                        ? SortearDisable
                                            ? "#FF5349"
                                            : "#d3d3d3"
                                        : "#f9fafb",
                                    height: 40
                                });
                            },
                            search: false,
                            filtering: false,
                            selection: false,
                            showSelectAllCheckbox: false,
                            showTextRowsSelected: false,
                            paging: false
                        }, components: {
                            Toolbar: function () { return null; }
                        } })),
                NPESelectedRow ? (React.createElement("div", { className: "w-full h-full overflow-y-scroll" },
                    React.createElement(material_table_1["default"], { style: { background: "#f9fafb" }, columns: columns, data: experimentosNew, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20
                            },
                            rowStyle: function (rowData) { return ({
                                backgroundColor: rowData.npef >= (NPESelectedRow === null || NPESelectedRow === void 0 ? void 0 : NPESelectedRow.nextNPE.npei_i)
                                    && SortearDisable
                                    ? '#FF5349'
                                    : '#f9fafb',
                                height: 40
                            }); },
                            search: false,
                            filtering: false,
                            pageSize: itensPerPage
                        }, components: {
                            Toolbar: function () { return (React.createElement("div", { className: "w-full max-h-96\n                                                flex\n                                                items-center\n                                                justify-between\n                                                gap-4\n                                                bg-gray-50\n                                                py-2\n                                                px-5\n                                                border-solid border-b\n                                                border-gray-200\n                                            " },
                                React.createElement("div", { className: "flex flex-col items-center justify-center h-7 w-32" },
                                    React.createElement(components_1.Button, { type: "button", value: "Voltar", bgColor: "bg-red-600", textColor: "white", icon: React.createElement(io_1.IoMdArrowBack, { size: 18 }), onClick: function () {
                                            router.back();
                                        } })),
                                React.createElement("strong", { className: "text-600" }, "Experimentos"),
                                React.createElement("strong", { className: "text-blue-600" },
                                    "Total registrado: ", experimentos === null || experimentos === void 0 ? void 0 :
                                    experimentos.length),
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
                                        React.createElement(components_1.Button, { title: "Sortear", value: "Sortear", bgColor: SortearDisable ? "bg-gray-400" : "bg-blue-600", textColor: "white", onClick: validateConsumedData }))))); },
                            Pagination: function (props) {
                                return (React.createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 10); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage <= 1 }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                    Array(1)
                                        .fill("")
                                        .map(function (value, index) { return (React.createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white" })); }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 10); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages })));
                            }
                        } }))) : ("")))));
}
exports["default"] = Listagem;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, idSafra, pageBeforeEdit, filterBeforeEdit, filterApplication;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_c = (_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b.response[0]) === null || _c === void 0 ? void 0 : _c.itens_per_page)];
                case 2:
                    itensPerPage = (_d = (_e.sent())) !== null && _d !== void 0 ? _d : 10;
                    idSafra = Number(req.cookies.safraId);
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
                    filterBeforeEdit = "";
                    filterApplication = "";
                    cookies_next_1.removeCookies("filterBeforeEdit", { req: req, res: res });
                    cookies_next_1.removeCookies("pageBeforeEdit", { req: req, res: res });
                    return [2 /*return*/, {
                            props: {
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                idSafra: idSafra,
                                pageBeforeEdit: pageBeforeEdit,
                                filterBeforeEdit: filterBeforeEdit
                            }
                        }];
            }
        });
    });
};
