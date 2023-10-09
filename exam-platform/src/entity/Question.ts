import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IsNotEmpty, IsNumber } from "class-validator";
import { User } from "./User";
import { Exam } from "./Exam";

export enum Difficulty {
  EASY = "FÁCIL",
  MEDIUM = "MÉDIO",
  HARD = "DIFÍCIL",
}

export enum QuestionType {
  boolean = "BOOLEAN",
  mcq = "MCQ",
  open = "OPEN",
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column("simple-array", { nullable: true })
  options?: string[];

  @Column({ nullable: true })
  answer: string;

  @Column({
    type: "enum",
    enum: QuestionType,
    default: QuestionType.mcq,
  })
  type: QuestionType;

  @Column({
    type: "enum",
    enum: Difficulty,
    default: Difficulty.EASY,
  })
  difficulty: Difficulty;

  @Column()
  @IsNotEmpty()
  category: string;

  @Column({ type: "float", default: 1.0 })
  @IsNumber()
  score: number;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: "CASCADE" })
  author: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deleteAt: Date;
}
