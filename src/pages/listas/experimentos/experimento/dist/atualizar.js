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
var formik_1 = require("formik");
var material_table_1 = require("material-table");
var config_1 = require("next/config");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_1 = require("react");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var bi_1 = require("react-icons/bi");
var io_1 = require("react-icons/io");
var io5_1 = require("react-icons/io5");
var md_1 = require("react-icons/md");
var ri_1 = require("react-icons/ri");
var sweetalert2_1 = require("sweetalert2");
var experiment_genotipe_service_1 = require("src/services/experiment-genotipe.service");
var services_1 = require("../../../../services");
var user_preference_controller_1 = require("../../../../controllers/user-preference.controller");
var components_1 = require("../../../../components");
var cookies_next_1 = require("cookies-next");
var ITabs = require("../../../../shared/utils/dropdown");
var helpers_1 = require("../../../../helpers");
function AtualizarLocal(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var experimento = _a.experimento, allItens = _a.allItens, totalItems = _a.totalItems, itensPerPage = _a.itensPerPage, filterApplication = _a.filterApplication, idExperiment = _a.idExperiment, pageBeforeEdit = _a.pageBeforeEdit, typeOrderServer = _a.typeOrderServer, // RR
    orderByserver = _a.orderByserver;
    var TabsDropDowns = ITabs["default"].TabsDropDowns;
    var tabsDropDowns = TabsDropDowns("listas");
    tabsDropDowns.map(function (tab) {
        return tab.titleTab === "EXPERIMENTOS"
            ? (tab.statusTab = true)
            : (tab.statusTab = false);
    });
    var router = router_1.useRouter();
    var userLogado = JSON.parse(localStorage.getItem("user"));
    var preferences = userLogado.preferences.materiais || {
        id: 0,
        table_preferences: "repetitionExperience,genotipo,gmr,bgm,fase,tecnologia,nt,rep,status,nca,npe,sequence,block,experiment"
    };
    var _u = react_1.useState(preferences.table_preferences), camposGerenciados = _u[0], setCamposGerenciados = _u[1];
    var _v = react_1.useState(function () { return allItens; }), materiais = _v[0], setMateriais = _v[1];
    var _w = react_1.useState([]), treatments = _w[0], setTreatments = _w[1];
    var _x = react_1.useState(Number(pageBeforeEdit)), currentPage = _x[0], setCurrentPage = _x[1];
    var _y = react_1.useState(totalItems), itemsTotal = _y[0], setTotaItems = _y[1];
    var _z = react_1.useState(1), orderList = _z[0], setOrder = _z[1];
    // const [setArrowOrder] = useState<any>("");
    var _0 = react_1.useState(false), statusAccordion = _0[0], setStatusAccordion = _0[1];
    var _1 = react_1.useState(filterApplication), filter = _1[0], setFilter = _1[1];
    var _2 = react_1.useState(''), arrowOrder = _2[0], setArrowOrder = _2[1];
    var _3 = react_1.useState(""), filtersParams = _3[0], setFiltersParams = _3[1]; // Set filter Parameter
    // const [colorStar, setColorStar] = useState<string>('');
    var _4 = react_1.useState(function () { return [
        {
            name: "CamposGerenciados[]",
            title: "Rep. Exp",
            value: "repetitionExperience"
        },
        {
            name: "CamposGerenciados[]",
            title: "Nome do genotipo",
            value: "genotipo"
        },
        { name: "CamposGerenciados[]", title: "GMR", value: "gmr" },
        { name: "CamposGerenciados[]", title: "BGM", value: "bgm" },
        { name: "CamposGerenciados[]", title: "Fase", value: "fase" },
        { name: "CamposGerenciados[]", title: "Tecnologia", value: "tecnologia" },
        { name: "CamposGerenciados[]", title: "NT", value: "nt" },
        { name: "CamposGerenciados[]", title: "Rep. trat.", value: "rep" },
        { name: "CamposGerenciados[]", title: "T", value: "status" },
        { name: "CamposGerenciados[]", title: "NCA", value: "nca" },
        { name: "CamposGerenciados[]", title: "NPE", value: "npe" },
        { name: "CamposGerenciados[]", title: "Seq.", value: "sorteio" },
        { name: "CamposGerenciados[]", title: "Bloco", value: "bloco" },
        { name: "CamposGerenciados[]", title: "Status parc.", value: "experiment" },
    ]; }), generatesProps = _4[0], setGeneratesProps = _4[1];
    var take = itensPerPage;
    var total = itemsTotal <= 0 ? 1 : itemsTotal;
    var pages = Math.ceil(total / take);
    var _5 = react_1.useState(orderByserver), orderBy = _5[0], setOrderBy = _5[1];
    var _6 = react_1.useState(typeOrderServer), typeOrder = _6[0], setTypeOrder = _6[1];
    var pathExtra = "skip=" + currentPage * Number(take) + "&take=" + take + "&orderBy=" + orderBy + "&typeOrder=" + typeOrder;
    var formik = formik_1.useFormik({
        initialValues: {
            id: experimento.id,
            foco: (_b = experimento.assay_list) === null || _b === void 0 ? void 0 : _b.foco.name,
            ensaio: (_c = experimento.assay_list) === null || _c === void 0 ? void 0 : _c.type_assay.name,
            tecnologia: ((_d = experimento.assay_list) === null || _d === void 0 ? void 0 : _d.tecnologia.cod_tec) + " " + ((_e = experimento.assay_list) === null || _e === void 0 ? void 0 : _e.tecnologia.name),
            gli: (_f = experimento.assay_list) === null || _f === void 0 ? void 0 : _f.gli,
            experimentName: experimento === null || experimento === void 0 ? void 0 : experimento.experimentName,
            bgm: experimento === null || experimento === void 0 ? void 0 : experimento.bgm,
            local: (_g = experimento.local) === null || _g === void 0 ? void 0 : _g.name_local_culture,
            delineamento: (_h = experimento.delineamento) === null || _h === void 0 ? void 0 : _h.name,
            repetition: experimento.repetition,
            density: experimento.density,
            drawOrder: experimento.drawOrder,
            status: experimento.status,
            nlp: experimento.nlp,
            eel: (_j = parseFloat(experimento.eel)) === null || _j === void 0 ? void 0 : _j.toFixed(2),
            clp: (_k = parseFloat(experimento.clp)) === null || _k === void 0 ? void 0 : _k.toFixed(2),
            comments: experimento.comments
        },
        onSubmit: function (values) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, services_1.experimentService
                            .update({
                            id: Number(values.id),
                            nlp: Number(values.nlp),
                            eel: values.eel,
                            clp: values.clp,
                            comments: values.comments
                        })
                            .then(function (response) {
                            if (response.status === 200) {
                                sweetalert2_1["default"].fire("Experimento atualizado com sucesso!");
                                router.back();
                            }
                            else {
                                sweetalert2_1["default"].fire(response.message);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    });
    // Calling common API
    function getTreatments(parametersFilter) {
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
                        return [4 /*yield*/, experiment_genotipe_service_1.experimentGenotipeService.getAll(parametersFilter).then(function (response) {
                                if (response.status === 200 || response.status === 400) {
                                    setTreatments(response.response);
                                    setTotaItems(response.total);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        var value = "idExperiment=" + idExperiment;
        getTreatments(value);
    }, [idExperiment]);
    // Call that function when change type order value.
    react_1.useEffect(function () {
        getTreatments(filter);
    }, [typeOrder]);
    // async function getTreatments() {
    //   await experimentGenotipeService
    //     .getAll(`&idExperiment=${idExperiment}`)
    //     .then(({ response, total: allTotal }) => {
    //       setTreatments(response);
    //     });
    // }
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
            title: (React.createElement("div", { className: "flex items-center" },
                React.createElement("button", { type: "button", className: "font-medium text-gray-900", onClick: function () { return handleOrder(title, orderList); } }, name))),
            field: title,
            sorting: false,
            cellStyle: style ? { color: "#039be5", fontWeight: "bold" } : {}
        };
    }
    function columnsOrder(columnsCampos) {
        var columnCampos = columnsCampos.split(",");
        var tableFields = [];
        Object.keys(columnCampos).forEach(function (item, index) {
            if (columnCampos[index] === "repetitionExperience") {
                tableFields.push(headerTableFactory("Rep. Exp", "rep"));
            }
            if (columnCampos[index] === "genotipo") {
                tableFields.push(headerTableFactory("Nome do genotipo", "genotipo.name_genotipo", true));
            }
            if (columnCampos[index] === "gmr") {
                tableFields.push(headerTableFactory("GMR", "genotipo.gmr"));
            }
            if (columnCampos[index] === "bgm") {
                tableFields.push(headerTableFactory("BGM", "genotipo.bgm"));
            }
            if (columnCampos[index] === "fase") {
                tableFields.push(headerTableFactory("Fase", "genotipo.lote[0].fase"));
            }
            if (columnCampos[index] === "tecnologia") {
                tableFields.push(headerTableFactory("Tecnologia", "tecnologia.cod_tec"));
            }
            if (columnCampos[index] === "nt") {
                tableFields.push(headerTableFactory("NT", "nt"));
            }
            if (columnCampos[index] === "treatments_number") {
                tableFields.push(headerTableFactory("Rep. trat.", "rep"));
            }
            if (columnCampos[index] === "status") {
                tableFields.push(headerTableFactory("T", "status"));
            }
            if (columnCampos[index] === "nca") {
                tableFields.push(headerTableFactory("NCA", "nca", true));
            }
            if (columnCampos[index] === "npe") {
                tableFields.push(headerTableFactory("NPE", "npe"));
            }
            if (columnCampos[index] === "sequence") {
                tableFields.push(headerTableFactory("Sequence", "sequencia_delineamento.sorteio"));
            }
            if (columnCampos[index] === "block") {
                tableFields.push(headerTableFactory("Bloco", "sequencia_delineamento.bloco"));
            }
            if (columnCampos[index] === "experiment") {
                tableFields.push(headerTableFactory("Status parc.", "experiment.status"));
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
                                module_id: 23
                            })
                                .then(function (response) {
                                userLogado.preferences.materiais = {
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
                        userLogado.preferences.materiais = {
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
            if (!filterApplication.includes("paramSelect")) {
                filterApplication += "&paramSelect=" + camposGerenciados + "&id_experimento=" + idExperiment;
            }
            return [2 /*return*/];
        });
    }); };
    // function handleTotalPages(): void {
    //   if (currentPage < 0) {
    //     setCurrentPage(0);
    //   } else if (currentPage >= pages) {
    //     setCurrentPage(pages - 1);
    //   }
    // }
    // async function handlePagination(): Promise<void> {
    //   const skip = currentPage * Number(take);
    //   let parametersFilter = `skip=${skip}&take=${take}`;
    //   if (filter) {
    //     parametersFilter = `${parametersFilter}&${filter}`;
    //   }
    //   // await materiaisService.getAll(parametersFilter).then((response) => {
    //   //   if (response.status === 200) {
    //   //     setMateriais(response.response);
    //   //   }
    //   // });
    // }
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
                    case 0: return [4 /*yield*/, getTreatments(filter)];
                    case 1:
                        _a.sent(); // handle pagination globly
                        return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);
    function fieldsFactory(name, title, values) {
        return (React.createElement("div", { className: "w-full h-7" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-0" }, name),
            React.createElement(components_1.Input, { style: { background: "#e5e7eb" }, disabled: true, required: true, id: title, name: title, value: values })));
    }
    function updateFieldsFactory(name, title, values, type) {
        if (type === void 0) { type = "text"; }
        return (React.createElement("div", { className: "w-1/4 h-7 mt-7" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-0" }, name),
            React.createElement(components_1.Input, { id: title, name: title, type: type, onChange: formik.handleChange, value: values })));
    }
    function updateFieldMoney(name, title, values) {
        return (React.createElement("div", { className: "w-1/4 h-7 mt-7" },
            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-0" }, name),
            React.createElement(components_1.InputMoney, { id: title, name: title, onChange: function (e) { return formik.setFieldValue(title, e); }, value: values })));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "Dados do experimento")),
        React.createElement(components_1.Content, { contentHeader: tabsDropDowns, moduloActive: "listas" },
            React.createElement("form", { className: "w-full bg-white shadow-md rounded px-4 pt-3 pb-3 mt-0", onSubmit: formik.handleSubmit },
                React.createElement("div", { className: "w-full flex justify-between items-start" },
                    React.createElement("h1", { className: "text-xl" }, "Atualizar Lista de Experimento")),
                React.createElement("div", { className: "w-full\n            flex\n            justify-around\n            gap-0\n            mt-0\n            mb-4\n          " },
                    React.createElement("div", { className: "w-full flex justify-between items-start gap-5 mt-1" },
                        fieldsFactory("Foco", "foco", (_l = experimento.assay_list) === null || _l === void 0 ? void 0 : _l.foco.name),
                        fieldsFactory("Ensaio", "type_assay", (_m = experimento.assay_list) === null || _m === void 0 ? void 0 : _m.type_assay.name),
                        fieldsFactory("Tecnologia", "tecnologia", ((_o = experimento.assay_list) === null || _o === void 0 ? void 0 : _o.tecnologia.cod_tec) + " " + ((_p = experimento.assay_list) === null || _p === void 0 ? void 0 : _p.tecnologia.name)),
                        fieldsFactory("GLI", "gli", (_q = experimento.assay_list) === null || _q === void 0 ? void 0 : _q.gli),
                        fieldsFactory("Experimento", "experimentName", experimento.experimentName),
                        fieldsFactory("BGM", "bgm", experimento === null || experimento === void 0 ? void 0 : experimento.bgm),
                        fieldsFactory("Status do ensaio", "status", (_r = experimento.assay_list) === null || _r === void 0 ? void 0 : _r.status))),
                React.createElement("div", { className: "w-full\n            flex\n            justify-around\n            gap-0\n            mt-0\n            mb-0\n          " },
                    React.createElement("div", { className: "w-full flex justify-between items-start gap-5 mt-3" },
                        fieldsFactory("Lugar plantio", "local", (_s = experimento.local) === null || _s === void 0 ? void 0 : _s.name_local_culture),
                        fieldsFactory("Delineamento", "delineamento", (_t = experimento.delineamento) === null || _t === void 0 ? void 0 : _t.name),
                        fieldsFactory("Repetições", "repetitionsNumber", experimento.repetitionsNumber),
                        fieldsFactory("Densidade", "density", experimento.density),
                        fieldsFactory("Ordem de sorteio", "orderDraw", experimento.orderDraw),
                        fieldsFactory("Status do experimento", "status", experimento.status))),
                React.createElement("div", { className: "rounded border-inherit", style: { marginTop: 25 } },
                    React.createElement("span", null, "Caracter\u00EDsticas da quadra"),
                    React.createElement("hr", null)),
                React.createElement("div", { className: "w-full\n            flex\n            justify-around\n            gap-6\n            mt-2\n            mb-0\n          " },
                    React.createElement("div", { className: "w-full h-f10 flex justify-between items-start gap-5" },
                        updateFieldsFactory("NLP", "nlp", formik.values.nlp, "number"),
                        updateFieldMoney("CLP", "clp", formik.values.clp),
                        React.createElement("div", { className: "w-full flex flex-col h-20" },
                            React.createElement("label", { className: "block text-gray-900 text-sm font-bold mb-0" }, "Observa\u00E7\u00F5es"),
                            React.createElement("textarea", { className: "shadow\n                              appearance-none\n                              bg-white bg-no-repeat\n                              border border-solid border-gray-300\n                              rounded\n                              w-full\n                              py-1 px-2\n                              text-gray-900\n                              text-xs\n                              leading-tight\n                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none", rows: 3, id: "comments", name: "comments", onChange: formik.handleChange, value: formik.values.comments })),
                        React.createElement("div", { className: "\n            h-7 w-full\n            flex\n            gap-3\n            justify-end\n            mt-12\n          " },
                            React.createElement("div", { className: "w-40" },
                                React.createElement(components_1.Button, { type: "button", value: "Voltar", bgColor: "bg-red-600", textColor: "white", icon: React.createElement(io_1.IoMdArrowBack, { size: 18 }), onClick: function () {
                                        router.back();
                                    } })),
                            React.createElement("div", { className: "w-40" },
                                React.createElement(components_1.Button, { type: "submit", value: "Atualizar", bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(ri_1.RiOrganizationChart, { size: 18 }), onClick: function () { } })))))),
            React.createElement("main", { className: "h-4/6 w-full\n          flex flex-col\n          items-start\n          gap-8\n        " },
                React.createElement("div", { style: { marginTop: "1%" }, className: "w-full h-auto overflow-y-scroll" },
                    React.createElement(material_table_1["default"], { style: { background: "#f9fafb" }, columns: columns, data: treatments, options: {
                            showTitle: false,
                            headerStyle: {
                                zIndex: 20
                            },
                            search: false,
                            filtering: false,
                            pageSize: itensPerPage
                        }, components: {
                            Toolbar: function () { return (React.createElement("div", { className: "w-full max-h-96\n                    flex\n                    items-center\n                    justify-between\n                    gap-4\n                    bg-gray-50\n                    py-2\n                    px-5\n                    border-solid border-b\n                    border-gray-200\n                  " },
                                React.createElement("strong", { className: "text-blue-600" },
                                    "Total registrado:   ",
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
                                                                React.createElement(components_1.CheckBox, { name: generate.name, title: (_a = generate.title) === null || _a === void 0 ? void 0 : _a.toString(), value: generate.value, defaultChecked: camposGerenciados.includes(generate.value) })));
                                                        })); }),
                                                        provided.placeholder)); }))))),
                                    React.createElement("div", { className: "h-12 flex items-center justify-center w-full" },
                                        React.createElement(components_1.Button, { title: "Exportar planilha de materiais", icon: React.createElement(ri_1.RiFileExcel2Line, { size: 20 }), bgColor: "bg-blue-600", textColor: "white", onClick: function () {
                                                downloadExcel();
                                            } }))))); },
                            Pagination: function (props) {
                                return (React.createElement("div", __assign({ className: "flex\n                      h-20\n                      gap-2\n                      pr-2\n                      py-5\n                      bg-gray-50\n                    " }, props),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(0); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdFirstPage, { size: 18 }), disabled: currentPage < 1 }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiLeftArrow, { size: 15 }), disabled: currentPage <= 0 }),
                                    Array(1)
                                        .fill("")
                                        .map(function (value, index) { return (React.createElement(components_1.Button, { key: index, onClick: function () { return setCurrentPage(index); }, value: "" + (currentPage + 1), bgColor: "bg-blue-600", textColor: "white", disabled: true })); }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(currentPage + 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(bi_1.BiRightArrow, { size: 15 }), disabled: currentPage + 1 >= pages }),
                                    React.createElement(components_1.Button, { onClick: function () { return setCurrentPage(pages - 1); }, bgColor: "bg-blue-600", textColor: "white", icon: React.createElement(md_1.MdLastPage, { size: 18 }), disabled: currentPage + 1 >= pages })));
                            }
                        } }))))));
}
exports["default"] = AtualizarLocal;
exports.getServerSideProps = function (_a) {
    var req = _a.req, res = _a.res, query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var PreferencesControllers, itensPerPage, token, pageBeforeEdit, requestOptions, idExperiment, publicRuntimeConfig, filterApplication, typeOrderServer, orderByserver, baseUrlShow, experimento, allItens, totalItems;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    PreferencesControllers = new user_preference_controller_1.UserPreferenceController();
                    return [4 /*yield*/, PreferencesControllers.getConfigGerais()];
                case 1: return [4 /*yield*/, ((_c = (_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b.response[0]) === null || _c === void 0 ? void 0 : _c.itens_per_page)];
                case 2:
                    itensPerPage = (_d = (_e.sent())) !== null && _d !== void 0 ? _d : 5;
                    token = req.cookies.token;
                    pageBeforeEdit = req.cookies.pageBeforeEdit
                        ? req.cookies.pageBeforeEdit
                        : 0;
                    requestOptions = {
                        method: "GET",
                        credentials: "include",
                        headers: { Authorization: "Bearer " + token }
                    };
                    idExperiment = Number(query.id);
                    publicRuntimeConfig = config_1["default"]().publicRuntimeConfig;
                    filterApplication = "idExperiment=" + idExperiment;
                    typeOrderServer = req.cookies.filterBeforeEditTypeOrder
                        ? req.cookies.filterBeforeEditTypeOrder
                        : '';
                    orderByserver = req.cookies.filterBeforeEditOrderBy
                        ? req.cookies.filterBeforeEditOrderBy
                        : '';
                    cookies_next_1.removeCookies('filterBeforeEdit', { req: req, res: res });
                    cookies_next_1.removeCookies('pageBeforeEdit', { req: req, res: res });
                    // RR
                    cookies_next_1.removeCookies('filterBeforeEditTypeOrder', { req: req, res: res });
                    cookies_next_1.removeCookies('filterBeforeEditOrderBy', { req: req, res: res });
                    cookies_next_1.removeCookies('lastPage', { req: req, res: res });
                    baseUrlShow = publicRuntimeConfig.apiUrl + "/experiment";
                    return [4 /*yield*/, fetch(baseUrlShow + "/" + idExperiment, requestOptions).then(function (response) { return response.json(); })];
                case 3:
                    experimento = _e.sent();
                    allItens = [];
                    totalItems = 0;
                    return [2 /*return*/, {
                            props: {
                                allItens: allItens,
                                totalItems: totalItems,
                                itensPerPage: itensPerPage,
                                filterApplication: filterApplication,
                                idExperiment: idExperiment,
                                experimento: experimento,
                                pageBeforeEdit: pageBeforeEdit,
                                orderByserver: orderByserver,
                                typeOrderServer: typeOrderServer
                            }
                        }];
            }
        });
    });
};
