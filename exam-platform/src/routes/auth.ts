import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

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
router.post("/login", AuthController.login);

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
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
