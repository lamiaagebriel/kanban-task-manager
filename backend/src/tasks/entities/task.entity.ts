import { Project } from 'src/projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskStatus {
  TODO = 'todo',
  INPROGRESS = 'inprogress',
  REVIEW = 'review',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Stores the status as enum: "todo", "inprogress", "review", "done"
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;
}
