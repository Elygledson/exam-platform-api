import { Router } from "express";
import { UserController } from "../controller/UserController";
import { UserRoles } from "../entity/User";
import { checkJwt } from "../middleware/checkJwt";
import { checkPagination } from "../middleware/checkPagination";
import { checkRole } from "../middleware/checkRole";
import { CourseController } from "../controller/CourseController";

const router = Router();

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
router.get("/", [checkJwt, checkPagination], CourseController.getAllCourses);

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
router.get("/:id", [checkJwt], CourseController.getCourseById);

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
router.post("/", CourseController.createCourse);
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
router.patch("/:id", [checkJwt], UserController.editUser);

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
router.delete(
  "/:id",
  [checkJwt, checkRole([UserRoles.ADMIN])],
  CourseController.deleteCourse
);
export default router;
