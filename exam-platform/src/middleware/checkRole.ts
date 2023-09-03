import { resolveSoa } from "dns";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;
    const userRepository = getRepository(User);
    console.log(id);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { id } });
      console.log("user", user);
    } catch (error) {
      console.log("dsadas", error);
      res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
