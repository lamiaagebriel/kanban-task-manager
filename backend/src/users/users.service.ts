import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Validation, validations } from './users.validations';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Helper to remove password from returned user objects
  private sanitizeUser(user: User | null): Omit<User, 'password'> | null {
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser as Omit<User, 'password'>;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(props: Validation['tagret-user-by-id']) {
    const { id } = validations['tagret-user-by-id'].parse(props);
    const user = await this.usersRepository.findOneBy({ id });
    return this.sanitizeUser(user);
  }

  async create(props: Validation['create-user']) {
    const parsed = validations['create-user'].parse(props);

    // Check if the email already exists
    const existingUser = await this.usersRepository.findOneBy({
      email: parsed.email,
    });
    if (existingUser) throw new Error('A user with this email already exists.');

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const user = this.usersRepository.create({
      ...parsed,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser) as Omit<User, 'password'>;
  }

  async update(
    props: Validation['update-user'] & Validation['tagret-user-by-id'],
  ) {
    const { id, ...parsed } = validations['update-user']
      .and(validations['tagret-user-by-id'])
      .parse(props);

    // If password is being updated, hash it
    if (parsed.password)
      parsed.password = await bcrypt.hash(parsed.password, 10);

    await this.usersRepository.update(id, parsed);
    const user = await this.usersRepository.findOneBy({ id });
    return this.sanitizeUser(user);
  }

  async remove(props: Validation['tagret-user-by-id']) {
    const { id } = validations['tagret-user-by-id'].parse(props);

    const result = await this.usersRepository.delete(id);
    if (!(result?.affected !== undefined && !!result?.affected)) {
      throw new Error('There is no user with this id');
    }
  }
}
