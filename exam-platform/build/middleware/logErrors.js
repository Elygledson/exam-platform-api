"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrors = void 0;
var logErrors = function (err, req, res, next) {
    console.error(err.stack);
    next(err);
};
exports.logErrors = logErrors;
//# sourceMappingURL=logErrors.js.map