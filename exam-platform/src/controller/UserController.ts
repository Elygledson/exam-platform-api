import { getRepository, Like } from "typeorm";
import { Request, Response } from "express";
import { User, UserApprovedStatus, UserRoles } from "../entity/User";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const acceptedFilters = ["role", "institution", "approved"];
    const acceptedLikeFilters = ["email", "name"];
    let filters = {};
    Object.keys(req.query).forEach((key) => {
      if (acceptedFilters.includes(key)) {
        filters[key] = req.query[key];
      } else if (acceptedLikeFilters.includes(key)) {
        filters[key] = Like("%" + req.query[key] + "%");
      }
    });
    console.log(filters);
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      where: filters,
      take: req["take"],
      skip: req["skip"],
    });

    return res.send({ success: true, message: "", data: users });
  }

  static async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({ where: { id } });
      return res.send({ success: true, message: "", data: user });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ success: false, message: "Usuário não encontrado" });
    }
  }

  static async createUser(req: Request, res: Response) {
    let { email, name, role, password, institution } = req.body;

    let user = new User();
    user.email = email;
    user.name = name;
    user.password = password;
    user.role = role;
    user.institution = institution;
    if (role == UserRoles.ADMIN) user.approved = UserApprovedStatus.APPROVED;
    else user.approved = UserApprovedStatus.PENDING;

    const errors = await validate(user);

    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    user.hashPassword();
    let savedUser: User;
    const userRepository = getRepository(User);
    try {
      savedUser = await userRepository.save(user);
    } catch (error) {
      console.log(error);
      return res
        .status(409)
        .send({ success: false, message: "Email já utilizado" });
    }

    delete user.password;
    return res.status(201).send({
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: user,
    });
  }

  static async editUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const token = <string>req.headers["auth"];
    let decoded = jwt.decode(token);

    if (decoded["userId"] != id) {
      return res
        .status(401)
        .send({ success: false, message: "Não autorizado." });
    }

    let { email, name, role, institution } = req.body;

    let user: User;

    const userRepository = getRepository(User);
    try {
      user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.id = :id", { id: id })
        .getOneOrFail();
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ success: false, message: "Usuário não encontrado" });
      return;
    }

    user.email = email;
    user.name = name;
    user.role = role;
    user.institution = institution;

    const errors = await validate(user);

    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    try {
      await userRepository.save(user);
    } catch (error) {
      console.log(error);
      return res
        .status(409)
        .send({ success: false, message: "Email já utilizado" });
    }

    delete user.password;
    return res.send({ success: true, message: "Usuário Alterado", data: user });
  }

  static async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const userRepository = getRepository(User);
    try {
      await userRepository.delete(id);
      return res.send({ success: true, message: "Usuário Excluído" });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ success: false, message: "Usuário não encontrado" });
      return;
    }
  }

  static async setRegisterToken(req: Request, res: Response) {
    const id = req.params.id;
    const { token } = req.body;

    let user: User;
    const userRepository = getRepository(User);
    try {
      user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.id = :id", { id: id })
        .getOneOrFail();
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ success: false, message: "Usuário não encontrado" });
      return;
    }

    user.registerToken = token;
    try {
      await userRepository.save(user);
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ success: false, message: "Erro ao salvar token do usuário" });
      return;
    }

    return res.send({ success: true, message: "Token definido!" });
  }
}
