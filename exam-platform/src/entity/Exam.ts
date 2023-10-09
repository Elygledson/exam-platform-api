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
import { IsNotEmpty } from "class-validator";
import { User } from "./User";
import { Question } from "./Question";

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(() => User, (user) => user.exams)
  author: User;

  @ManyToMany(() => Question)
  @JoinTable({
    name: "exam_question",
    joinColumn: { name: "examId" },
    inverseJoinColumn: { name: "questionId" },
  })
  questions: Question[];

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
