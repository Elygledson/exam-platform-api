"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var checkJwt = function (req, res, next) {
    var token = req.headers["auth"];
    var jwtPayload;
    try {
        jwtPayload = jwt.verify(token, config_1.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (err) {
        console.log(err);
        res.status(401).send();
        return;
    }
    var userId = jwtPayload.userId, email = jwtPayload.email;
    var newToken = jwt.sign({ userId: userId, email: email }, config_1.default.jwtSecret, {
        expiresIn: "30d",
    });
    res.setHeader("token", newToken);
    next();
};
exports.checkJwt = checkJwt;
//# sourceMappingURL=checkJwt.js.map