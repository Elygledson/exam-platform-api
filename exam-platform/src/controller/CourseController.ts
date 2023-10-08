import { getRepository, Like } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";
import { Course } from "../entity/Course";

export class CourseController {
  static async getAllCourses(req: Request, res: Response) {
    const acceptedFilters = ["instructor", "", "aproved"];
    const acceptedLikeFilters = ["email", "name"];
    let filters = {};
    Object.keys(req.query).forEach((key) => {
      if (acceptedFilters.includes(key)) {
        filters[key] = req.query[key];
      } else if (acceptedLikeFilters.includes(key)) {
        filters[key] = Like("%" + req.query[key] + "%");
      }
    });
    const courseRepository = getRepository(Course);
    const users = await courseRepository.find({
      where: filters,
      take: req["take"],
      skip: req["skip"],
    });

    return res.send({ success: true, message: "", data: users });
  }

  static async getCourseById(req: Request, res: Response) {
    const id = req.params.id;
    const courseRepository = getRepository(Course);
    try {
      const course = await courseRepository.findOneOrFail(id);

      return res.send({ success: true, message: "", data: course });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ success: false, message: "Curso não encontrado" });
    }
  }

  static async createCourse(req: Request, res: Response) {
    let { name } = req.body;

    let course = new Course();
    course.name = name;
    const errors = await validate(course);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    let savedCourse: Course;
    const courseRepository = getRepository(Course);
    try {
      savedCourse = await courseRepository.save(course);
    } catch (error) {
      console.log(error);
      return res
        .status(409)
        .send({ success: false, message: "Este curso já existe" });
    }

    return res.status(201).send({
      success: true,
      message: "Curso cadastrado com sucesso",
      data: course,
    });
  }

  static async editCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const token = <string>req.headers["auth"];
    let decoded = jwt.decode(token);

    console.log(decoded);
    if (decoded["userId"] != id) {
      return res
        .status(401)
        .send({ success: false, message: "Não autorizado." });
    }

    let { name, description } = req.body;

    let course: Course;

    const courseRepository = getRepository(Course);
    const userRepository = getRepository(User);
    try {
      course = await courseRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.log(error);
      res.status(404).send({ success: false, message: "Curso não encontrado" });
      return;
    }

    course.name = name;
    course.description = description;

    const errors = await validate(course);

    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    try {
      await courseRepository.save(course);
    } catch (error) {
      console.log(error);
      return res
        .status(409)
        .send({ success: false, message: "Email já utilizado" });
    }

    return res.send({ success: true, message: "Curso Alterado", data: course });
  }

  static async deleteCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const courseRepository = getRepository(Course);
    try {
      await courseRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.log(error);
      res.status(404).send({ success: false, message: "Curso não encontrado" });
      return;
    }

    await courseRepository.delete(id);

    return res.send({ success: true, message: "Curso Excluído" });
  }
}
