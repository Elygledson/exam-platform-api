import { Router } from "express";
import auth from "./auth";
import user from "./user";
import question from "./question";
import course from "./course";
import exams from "./exams";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/courses", course);
routes.use("/questions", question);
routes.use("/exams", exams);

export default routes;
