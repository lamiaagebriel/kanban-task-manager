import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Validation, validations } from './projects.validations';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  // Helper to sanitize (serialize) the user in the project object
  private sanitizeProject(project: Project | null) {
    if (!project) return null;
    const { owner, ...projectRest } = project;
    let safeOwner: Omit<User, 'password'> | null = null;
    if (!!owner) {
      const { password, ...safeUser } = owner;
      safeOwner = safeUser;
    }

    return {
      ...projectRest,
      ownerId: safeOwner?.id,
    };
  }

  async findAll(props: Validation['target-project-by-ownerId']) {
    const { ownerId } = validations['target-project-by-ownerId'].parse(props);

    const projects = await this.projectsRepository.find({
      where: { owner: { id: ownerId } },
      order: {
        createdAt: 'DESC',
      },
      relations: ['owner'],
    });

    return projects.map((p) => this.sanitizeProject(p));
  }

  async findOne(props: Validation['target-project-by-id+ownerId']) {
    const { id, ownerId } =
      validations['target-project-by-id+ownerId'].parse(props);
    const project = await this.projectsRepository.findOne({
      where: { id, owner: { id: ownerId } },
      relations: ['owner'],
    });
    return this.sanitizeProject(project);
  }

  async create(
    props: Validation['create-project'] &
      Validation['target-project-by-ownerId'],
  ) {
    const { ownerId, ...parsed } = validations['create-project']
      .and(validations['target-project-by-ownerId'])
      .parse(props);

    const project = this.projectsRepository.create({
      ...parsed,
      owner: { id: ownerId },
    });
    const savedProject = await this.projectsRepository.save(project);

    // Get the project with owner relation for serialization
    const projectWithOwner = await this.projectsRepository.findOne({
      where: { id: savedProject.id },
      relations: ['owner'],
    });

    return this.sanitizeProject(projectWithOwner);
  }

  async update(
    props: Validation['update-project'] &
      Validation['target-project-by-id+ownerId'],
  ) {
    const { id, ownerId, ...parsed } = validations['update-project']
      .and(validations['target-project-by-id+ownerId'])
      .parse(props);

    await this.projectsRepository.update(id, parsed);

    const updatedProject = await this.projectsRepository.findOne({
      where: { id, owner: { id: ownerId } },
      relations: ['owner'],
    });

    return this.sanitizeProject(updatedProject);
  }

  async remove(props: Validation['target-project-by-id+ownerId']) {
    const { id, ownerId } =
      validations['target-project-by-id+ownerId'].parse(props);

    const result = await this.projectsRepository.delete({
      id,
      owner: { id: ownerId },
    });
    const deleted = !!result?.affected && result.affected > 0;
    if (!deleted) throw new Error('There is no project with this id');
  }
}
