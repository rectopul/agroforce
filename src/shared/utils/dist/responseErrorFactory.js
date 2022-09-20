"use strict";
exports.__esModule = true;
exports.responseGenericFactory = exports.responseDoesNotExist = exports.responsePositiveNumericFactory = exports.responseDiffFactory = exports.responseNullFactory = void 0;
function responseNullFactory(column, row, header) {
    return "<li style=\"text-align:left\"> A " + column + "\u00BA coluna da " + row + "\u00BA linha est\u00E1 incorreta, o campo " + header + " \u00E9 obrigat\u00F3rio. </li> <br>";
}
exports.responseNullFactory = responseNullFactory;
function responseDiffFactory(column, row, header) {
    return "<li style=\"text-align:left\"> A " + column + "\u00BA coluna da " + row + "\u00BA linha est\u00E1 incorreta, o campo " + header + " \u00E9 diferente do relacionado ao tipo de experiment. </li> <br>";
}
exports.responseDiffFactory = responseDiffFactory;
function responsePositiveNumericFactory(column, row, header) {
    return "<li style=\"text-align:left\"> A " + column + "\u00BA coluna da " + row + "\u00BA linha est\u00E1 incorreta, o campo " + header + " deve ser num\u00E9rico e positivo. </li> <br>";
}
exports.responsePositiveNumericFactory = responsePositiveNumericFactory;
function responseDoesNotExist(column, row, header) {
    return "<li style=\"text-align:left\"> A " + column + "\u00BA coluna da " + row + "\u00BA linha est\u00E1 incorreta, o campo " + header + " n\u00E3o existe no sistema. </li> <br>";
}
exports.responseDoesNotExist = responseDoesNotExist;
function responseGenericFactory(column, row, header, message) {
    return "<li style=\"text-align:left\"> A " + column + "\u00BA coluna da " + row + "\u00BA linha est\u00E1 incorreta, o campo " + header + " " + message + ". </li> <br>";
}
exports.responseGenericFactory = responseGenericFactory;
