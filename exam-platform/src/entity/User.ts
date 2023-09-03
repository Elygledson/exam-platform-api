import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Question } from "./Question";
import { Course } from "./Course";

export enum UserRoles {
  STANDARD = "STANDARD",
  ADMIN = "ADMIN",
  PROFESSOR = "PROFESSOR",
}

export enum UserApprovedStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Length(6, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.STANDARD,
  })
  role: UserRoles;

  @Column({
    type: "enum",
    enum: UserApprovedStatus,
    default: UserApprovedStatus.PENDING,
  })
  approved: UserApprovedStatus;

  @Column()
  @IsNotEmpty()
  institution: string; // Adicione este campo para a instituição do professor

  @OneToMany(() => Question, (question) => question.author)
  questions?: Question[]; // Questões criadas pelo usuário

  @OneToMany(() => Course, (course) => course.instructor)
  courses?: Course[]; // Cursos criados pelo usuário

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  registerToken: string;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password);
  }

  checkPassword(plainPass: string) {
    return bcrypt.compareSync(plainPass, this.password);
  }
}
