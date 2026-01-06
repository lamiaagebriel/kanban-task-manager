import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ZodBody, ZodParam } from 'src/validations/decorators/zod.decorator';
import { UsersService } from './users.service';
import { validations, type Validation } from './users.validations';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = (await this.usersService.findAll()).filter((u) => u !== null);

    return {
      ok: true,
      data: users,
    };
  }

  @Get(':id')
  async findOne(
    @ZodParam(validations['tagret-user-by-id'])
    params: Validation['tagret-user-by-id'],
  ) {
    const user = await this.usersService.findOne({
      id: params.id,
    });

    return {
      ok: true,
      data: user,
    };
  }

  @Post()
  async create(@Body() body: Validation['create-user']) {
    const user = await this.usersService.create(body);

    return {
      ok: true,
      data: user,
    };
  }

  @Put(':id')
  async update(
    @ZodParam(validations['tagret-user-by-id'])
    params: Validation['tagret-user-by-id'],

    @ZodBody(validations['update-user'])
    body: Validation['update-user'],
  ) {
    const updatedUser = await this.usersService.update({
      id: params.id,
      ...body,
    });
    return {
      ok: true,
      data: updatedUser,
    };
  }

  @Delete(':id')
  async remove(
    @ZodParam(validations['tagret-user-by-id'])
    params: Validation['tagret-user-by-id'],
  ) {
    await this.usersService.remove({ id: params.id });
    return { ok: true };
  }
}
