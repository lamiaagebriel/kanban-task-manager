import { Controller, Delete, Get, Post, Put, Request } from '@nestjs/common';
import { ZodBody, ZodParam } from 'src/validations/decorators/zod.decorator';
import { TasksService } from './tasks.service';
import { validations, type Validation } from './tasks.validations';

@Controller('api/projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @ZodParam(validations['target-task-by-projectId'])
    params: Validation['target-task-by-projectId'],
    @Request() req,
  ) {
    const tasks = (
      await this.tasksService.findAll({
        ownerId: req?.user?.id,
        projectId: params.projectId,
      })
    ).filter((t) => t !== null);

    return {
      ok: true,
      data: { tasks },
    };
  }

  @Get(':id')
  async findOne(
    @ZodParam(validations['target-task-by-id+projectId'])
    params: Validation['target-task-by-id+projectId'],
    @Request() req,
  ) {
    const task = await this.tasksService.findOne({
      id: params.id,
      ownerId: req?.user?.id,
      projectId: params.projectId,
    });
    return {
      ok: true,
      data: { task },
    };
  }

  @Post()
  async create(
    @ZodParam(validations['target-task-by-projectId'])
    params: Validation['target-task-by-projectId'],

    @ZodBody(validations['create-task'])
    body: Validation['create-task'],
    @Request() req,
  ) {
    const task = await this.tasksService.create({
      ...body,
      projectId: params.projectId,
      // ownerId: req?.user?.id,
    });
    return {
      ok: true,
      data: { task },
    };
  }

  @Put(':id')
  async update(
    @ZodParam(validations['target-task-by-id+projectId'])
    params: Validation['target-task-by-id+projectId'],

    @ZodBody(validations['update-task'])
    body: Validation['update-task'],
    @Request() req,
  ) {
    const updatedTask = await this.tasksService.update({
      id: params.id,
      ownerId: req?.user?.id,
      ...body,
    });
    return {
      ok: true,
      data: { task: updatedTask },
    };
  }

  @Delete(':id')
  async remove(
    @ZodParam(validations['target-task-by-id+projectId'])
    params: Validation['target-task-by-id+projectId'],

    @Request() req,
  ) {
    await this.tasksService.remove({
      id: params.id,
      ownerId: req?.user?.id,
    });
  }
}
