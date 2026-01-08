import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Validation, validations } from './tasks.validations';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Helper to sanitize (serialize) the task object
  private sanitizeTask(task: Task | null) {
    if (!task) return null;

    const { project, ...taskRest } = task;
    let safeProject = project ?? null;

    return {
      ...taskRest,
      projectId: safeProject?.id,
    };
  }

  async findAll(props: Validation['target-task-by-projectId+ownerId']) {
    const { projectId, ownerId } =
      validations['target-task-by-projectId+ownerId'].parse(props);
    const tasks = await this.tasksRepository.find({
      where: {
        project: {
          id: projectId,
          owner: { id: ownerId },
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['project', 'project.owner'],
    });

    return tasks.map((t) => this.sanitizeTask(t));
  }

  async findOne(props: Validation['target-task-by-id+projectId+ownerId']) {
    const { id, projectId, ownerId } =
      validations['target-task-by-id+projectId+ownerId'].parse(props);

    const task = await this.tasksRepository.findOne({
      where: {
        id,
        project: {
          id: projectId,
          owner: { id: ownerId },
        },
      },
      relations: ['project', 'project.owner'],
    });
    return this.sanitizeTask(task);
  }

  async create(
    props: Validation['create-task'] & Validation['target-task-by-projectId'],
  ) {
    const { projectId, ...parsed } = validations['create-task']
      .and(validations['target-task-by-projectId'])
      .parse(props);
    const task = this.tasksRepository.create({
      ...parsed,
      project: { id: projectId },
    });
    const savedTask = await this.tasksRepository.save(task);

    const taskWithProject = await this.tasksRepository.findOne({
      where: { id: savedTask.id, project: { id: projectId } },
      relations: ['project', 'project.owner'],
    });

    return this.sanitizeTask(taskWithProject);
  }

  async update(
    props: Validation['update-task'] & Validation['target-task-by-id+ownerId'],
  ) {
    const { id, ownerId, ...parsed } = validations['update-task']
      .and(validations['target-task-by-id+ownerId'])
      .parse(props);

    const task = await this.tasksRepository.findOne({
      where: {
        id,
        project: { owner: { id: ownerId } },
      },
      relations: ['project', 'project.owner'],
    });
    if (!task) throw new Error('Task not found or access denied');

    await this.tasksRepository.update(id, parsed);
    const updatedTask = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'project.owner'],
    });

    return this.sanitizeTask(updatedTask);
  }

  async remove(props: Validation['target-task-by-id+ownerId']) {
    const { id, ownerId } =
      validations['target-task-by-id+ownerId'].parse(props);

    // Only delete if owned by ownerId
    const task = await this.tasksRepository.findOne({
      where: { id, project: { owner: { id: ownerId } } },
      relations: ['project', 'project.owner'],
    });
    if (!task) throw new Error('There is no task with this id');

    const result = await this.tasksRepository.delete(id);
    const deleted = !!result?.affected && result.affected > 0;
    if (!deleted) throw new Error('There is no task with this id');
  }
}
