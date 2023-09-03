"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var routes = (0, express_1.Router)();
routes.use("/auth", auth_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map