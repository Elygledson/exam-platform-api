"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
var msg = "Esta rota não foi encontrada!";
var notFound = function (req, res, next) {
    res.status(404).json({ success: false, mesage: msg, error: msg });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map