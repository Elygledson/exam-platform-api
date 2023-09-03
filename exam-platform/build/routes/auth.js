"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = require("../controller/AuthController");
var checkJwt_1 = require("../middleware/checkJwt");
var router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz "login" na API
 *     description: Autentica usuário a partir de email e senha, retornando Token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 */
router.post("/login", AuthController_1.AuthController.login);
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Troca a senha do usuário
 *     description: Troca a senha após receber a antiga e a nova
 *     parameters:
 *     - in: header
 *       name: auth
 *       required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              oldPassword:
 *                type: string
 *              newPassword:
 *                type: string
 */
router.post("/change-password", [checkJwt_1.checkJwt], AuthController_1.AuthController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map