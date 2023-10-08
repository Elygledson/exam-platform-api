import { getRepository, Like } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Question } from "../entity/Question";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

export class QuestionController {
  static async getAllQuestions(req: Request, res: Response) {
    const acceptedFilters = ["category", "difficulty"];
    const acceptedLikeFilters = ["author"];
    let filters = {};
    Object.keys(req.query).forEach((key) => {
      if (acceptedFilters.includes(key)) {
        filters[key] = req.query[key];
      } else if (acceptedLikeFilters.includes(key)) {
        filters[key] = Like("%" + req.query[key] + "%");
      }
    });
    const questionRepository = getRepository(Question);
    const questions = await questionRepository.find({
      where: filters,
      take: req["take"],
      skip: req["skip"],
    });

    return res.send({ success: true, message: "", questions });
  }

  static async getQuestionById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const questionRepository = getRepository(Question);
    try {
      const question = await questionRepository.findOneOrFail({
        where: { id },
      });

      return res.send({ success: true, message: "", question });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ success: false, message: "Questão não encontrada" });
    }
  }

  static async createQuestion(req: Request, res: Response) {
    let { description, options, answer, difficulty, score, category } =
      req.body;
    const token = <string>req.headers["auth"];
    let decoded = jwt.decode(token);
    const userRepository = getRepository(User);
    let question = new Question();
    question.description = description;
    question.options = options;
    question.answer = answer;
    question.difficulty = difficulty;
    question.score = score;
    question.category = category;
    question.author = await userRepository.findOneOrFail({
      where: { id: decoded["userId"] },
    });
    const errors = await validate(question);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }
    const questionRepository = getRepository(Question);
    try {
      question = await questionRepository.save(question);
      return res.status(201).send({
        success: true,
        message: "Questão cadastrada com sucesso",
        question,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Error ao salvar questão" });
    }
  }

  static async editQuestion(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    let { description, difficulty, category, score } = req.body;
    let question: Question;
    const questionRepository = getRepository(Question);
    try {
      question = await questionRepository.findOneOrFail({ where: { id } });
      console.log(question);
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ success: false, message: "Questão não encontrada" });
      return;
    }

    question.description = description;
    question.difficulty = difficulty;
    question.category = category;
    question.score = score;

    const errors = await validate(question);

    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    try {
      await questionRepository.save(question);
      return res.send({
        success: true,
        message: "Questão Alterada",
        question,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Erro ao editar questão" });
    }
  }

  static async deleteQuestion(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const questionRepository = getRepository(Question);
    try {
      await questionRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .send({ success: false, message: "Questão não encontrada" });
      return;
    }
    await questionRepository.delete(id);
    return res.send({ success: true, message: "Questão Excluída" });
  }
}
