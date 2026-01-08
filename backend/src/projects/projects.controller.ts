import { Controller, Delete, Get, Post, Put, Request } from '@nestjs/common';
import { ZodBody, ZodParam } from 'src/validations/decorators/zod.decorator';
import { ProjectsService } from './projects.service';
import { validations, type Validation } from './projects.validations';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req) {
    const projects = (
      await this.projectsService.findAll({ ownerId: req?.user?.id })
    ).filter((p) => p !== null);
    return {
      ok: true,
      data: { projects },
    };
  }

  @Get(':id')
  async findOne(
    @ZodParam(validations['target-project-by-id'])
    params: Validation['target-project-by-id'],
    @Request() req,
  ) {
    const project = await this.projectsService.findOne({
      id: params.id,
      ownerId: req?.user?.id,
    });
    return {
      ok: true,
      data: { project },
    };
  }

  @Post()
  async create(
    @ZodBody(validations['create-project'])
    body: Validation['create-project'],
    @Request() req,
  ) {
    const project = await this.projectsService.create({
      ...body,
      ownerId: req?.user?.id,
    });
    return {
      ok: true,
      data: { project },
    };
  }

  @Put(':id')
  async update(
    @ZodParam(validations['target-project-by-id'])
    params: Validation['target-project-by-id'],
    @ZodBody(validations['update-project'])
    body: Validation['update-project'],
    @Request() req,
  ) {
    const updatedProject = await this.projectsService.update({
      id: params.id,
      ownerId: req?.user?.id,
      ...body,
    });
    return {
      ok: true,
      data: { project: updatedProject },
    };
  }

  @Delete(':id')
  async remove(
    @ZodParam(validations['target-project-by-id'])
    params: Validation['target-project-by-id'],
    @Request() req,
  ) {
    await this.projectsService.remove({
      id: params.id,
      ownerId: req?.user?.id,
    });
  }
}
