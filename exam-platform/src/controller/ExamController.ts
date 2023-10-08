import { getRepository, In, Like } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { Exam } from "../entity/Exam";
import { Question } from "../entity/Question";

export class ExamController {
  static async getAllExams(req: Request, res: Response) {
    const acceptedFilters = [];
    const acceptedLikeFilters = ["author"];
    let filters = {};
    Object.keys(req.query).forEach((key) => {
      if (acceptedFilters.includes(key)) {
        filters[key] = req.query[key];
      } else if (acceptedLikeFilters.includes(key)) {
        filters[key] = Like("%" + req.query[key] + "%");
      }
    });
    const examRepository = getRepository(Exam);
    const exams = await examRepository.find({
      where: filters,
      take: req["take"],
      skip: req["skip"],
      relations: ["author", "questions"],
    });

    return res.send({ success: true, message: "", exams });
  }

  static async getExamById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const examRepository = getRepository(Exam);
    try {
      const exam = await examRepository.findOneOrFail({
        where: { id },
      });

      return res.send({ success: true, message: "", exam });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .send({ success: false, message: "exame não encontrado" });
    }
  }

  static async createExam(req: Request, res: Response) {
    try {
      const { name, questions } = req.body;
      const token = req.headers["auth"];
      const decoded = jwt.decode(token);
      const userRepository = getRepository(User);
      const examRepository = getRepository(Exam);
      const questionRepository = getRepository(Question);

      // Encontre o autor com base no token
      const author = await userRepository.findOneOrFail({
        where: { id: decoded.userId },
      });

      // Crie um novo exame
      const exam = new Exam();
      exam.name = name;
      exam.author = author;

      // Encontre as questões com base nos IDs fornecidos
      const selectedQuestions = await questionRepository.findByIds(questions);

      // Associe as questões ao exame por meio da tabela intermediária
      exam.questions = selectedQuestions;

      // Valide o exame
      const errors = await validate(exam);
      if (errors.length > 0) {
        return res.status(400).send({
          success: false,
          message: "Erros de validação",
          data: errors,
        });
      }

      // Salve o exame
      await examRepository.save(exam);

      return res.status(201).send({
        success: true,
        message: "Prova cadastrada com sucesso",
        exam,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Erro ao salvar a prova",
        error: error.message,
      });
    }
  }

  static async editExam(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    let { name, questions } = req.body;
    let exam: Exam;
    const examRepository = getRepository(Exam);
    try {
      exam = await examRepository.findOneOrFail({ where: { id } });
      console.log(exam);
    } catch (error) {
      console.log(error);
      res.status(404).send({ success: false, message: "Prova não encontrada" });
      return;
    }

    exam.name = name;
    exam.questions = questions;

    const errors = await validate(exam);

    if (errors.length > 0) {
      res
        .status(400)
        .send({ success: false, message: "Erros de validação", data: errors });
      return;
    }

    try {
      await examRepository.save(exam);
      return res.send({
        success: true,
        message: "Prova Alterada",
        exam,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: "Erro ao editar prova" });
    }
  }

  static async deleteExam(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const examRepository = getRepository(Exam);
    try {
      await examRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.log(error);
      res.status(404).send({ success: false, message: "Prova não encontrada" });
      return;
    }
    await examRepository.delete(id);
    return res.send({ success: true, message: "Prova Excluída" });
  }
}
