"use strict";
exports.__esModule = true;
function handleOrderForeign(orderBy, orderType) {
    var orderColumnForeign = orderBy.split('.');
    var foreignKey = orderColumnForeign[0];
    var foreignColumn = orderColumnForeign[1];
    if (orderColumnForeign.length > 2) {
        var foreignNextKey = orderColumnForeign[2];
        switch (foreignKey) {
            case 'assay_list':
                return "{ \"" + foreignKey + "\": { \"" + foreignColumn + "\": {\"" + foreignNextKey + "\": \"" + orderType + "\"} } }";
            case 'genotipo':
                return "{ \"" + foreignKey + "\": { \"" + foreignColumn + "\": {\"" + foreignNextKey + "\": \"" + orderType + "\"} } }";
            case 'experiment':
                return "{ \"" + foreignKey + "\": { \"" + foreignColumn + "\": {\"" + foreignNextKey + "\": \"" + orderType + "\"} } }";
            default:
                return '';
        }
    }
    else {
        switch (foreignKey) {
            case 'local':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'safra':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'foco':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'lote':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'type_assay':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'tecnologia':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'localPreparo':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'genotipo':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'ensaio':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'assay_list':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'user':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'delineamento':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            case 'experiment':
                return "{ \"" + foreignKey + "\": {\"" + foreignColumn + "\": \"" + orderType + "\" } }";
            default:
                return '';
        }
    }
}
exports["default"] = handleOrderForeign;
