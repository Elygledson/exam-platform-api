import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNotEmpty, IsNumber } from "class-validator";
import { User } from "./User";

export enum Difficulty {
  EASY = "FÁCIL",
  MEDIUM = "MÉDIO",
  HARD = "DIFÍCIL",
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  text: string;

  @Column("simple-array", { nullable: true })
  options?: string[];

  @Column({ nullable: true })
  correctAnswer: string;

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
}
