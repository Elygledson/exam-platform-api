"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controller/UserController");
var UserManagementController_1 = require("../controller/UserManagementController");
var User_1 = require("../entity/User");
var checkJwt_1 = require("../middleware/checkJwt");
var checkPagination_1 = require("../middleware/checkPagination");
var checkRole_1 = require("../middleware/checkRole");
var router = (0, express_1.Router)();
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Retorna todos os usuários
 *     parameters:
 *     - in: header
 *       name: auth
 *       required: true
 */
router.get("/", [checkJwt_1.checkJwt, checkPagination_1.checkPagination], UserController_1.UserController.getAllUsers);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna o usuário com o id especificado
 *     description: Retorna o usuário com o id especificado
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *     - in: header
 *       name: auth
 *       required: true
 */
router.get("/:id", [checkJwt_1.checkJwt], UserController_1.UserController.getUserById);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria usuário a partir dos dados passados no corpo da requisição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              name:
 *                type: string
 *              cpf:
 *                type: string
 *              phone:
 *                type: string
 *              affiliation:
 *                type: string
 *              course_sector:
 *                type: string
 *              role:
 *                type: string
 *              password:
 *                type: string
 */
router.post("/", UserController_1.UserController.createUser);
// router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.createUser);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Edita um usuário existente
 *     description: Edita usuário com o id especificado a partir dos dados no corpo da requisição
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
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
 *              email:
 *                type: string
 *              name:
 *                type: string
 *              cpf:
 *                type: string
 *              phone:
 *                type: string
 *              affiliation:
 *                type: string
 *              course_sector:
 *                type: string
 *              role:
 *                type: string
 */
router.patch("/:id", [checkJwt_1.checkJwt], UserController_1.UserController.editUser);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deleta o usuário com o id especificado
 *     description: Deleta o usuário com o id especificado
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *     - in: header
 *       name: auth
 *       required: true
 */
router.delete("/:id", [checkJwt_1.checkJwt, (0, checkRole_1.checkRole)([User_1.UserRoles.ADMIN])], UserController_1.UserController.deleteUser);
router.get("/manage/non-aproved", [checkJwt_1.checkJwt, (0, checkRole_1.checkRole)([User_1.UserRoles.ADMIN]), checkPagination_1.checkPagination], UserManagementController_1.UserManagementController.getNonAprovedUsers);
router.post("/manage/aprove", [checkJwt_1.checkJwt, (0, checkRole_1.checkRole)([User_1.UserRoles.ADMIN])], UserManagementController_1.UserManagementController.aproveUser);
router.post("/token/:id", [checkJwt_1.checkJwt], UserController_1.UserController.setRegisterToken);
exports.default = router;
//# sourceMappingURL=user.js.map