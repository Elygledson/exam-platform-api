import { Router } from "express";
import auth from "./auth";
import user from "./user";
import question from "./question";
import course from "./course";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/courses", course);
routes.use("/questions", question);

export default routes;
