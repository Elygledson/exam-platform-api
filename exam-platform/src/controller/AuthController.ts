import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

export class AuthController {
  static async login(req: Request, res: Response) {
    // verifica presenca de email e senha na request
    let { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .send({ success: false, message: "Email e senha necessários" });
    }

    // procura user com email
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("email = :email", { email: email })
        .getOneOrFail();
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .send({ success: false, message: "Usuário não encontrado" });
    }

    // valida senha
    if (!user.checkPassword(password)) {
      return res
        .status(401)
        .send({ success: false, message: "Credenciais inválidas" });
    }

    // JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "30d" }
    );

    delete user.password;
    return res.send({
      success: true,
      message: "Login realizado com sucesso",
      data: { token, user },
    });
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    const id = res.locals.jwtPayload.userId;

    let { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      return res
        .status(400)
        .send({ success: false, message: "Email e senha necessários" });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .send({ success: false, message: "Usuário não encontrado" });
    }

    if (!user.checkPassword(oldPassword)) {
      return res
        .status(401)
        .send({ success: false, message: "Credenciais inválidas" });
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      return res
        .status(400)
        .send({ success: false, message: "Erro de validação", data: errors });
    }

    user.hashPassword();
    userRepository.save(user);

    return res.send({ success: true, message: "Senha alterada com sucesso" });
  }
}
