import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "./User"; // Importe a entidade User

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => User) // Relacionamento muitos-para-um com a entidade User
  @JoinColumn({ name: "instructorId" }) // Chave estrangeira para o instrutor do curso
  instructor: User;

  @Column({ type: "date", nullable: true })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
