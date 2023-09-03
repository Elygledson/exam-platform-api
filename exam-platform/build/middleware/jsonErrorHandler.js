"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonErrorHandler = void 0;
var jsonErrorHandler = function (err, req, res, next) {
    res.status(500).json({ success: false, message: err.message, error: err });
};
exports.jsonErrorHandler = jsonErrorHandler;
//# sourceMappingURL=jsonErrorHandler.js.map