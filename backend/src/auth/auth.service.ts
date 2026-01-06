import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Validation, validations } from './auth.validations';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async getSession(props: Validation['create-auth-session']) {
    const data = validations['create-auth-session'].parse(props);
    const payload = {
      email: data.email,
      sub: data.id,
      name: data.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    };
  }

  async validateUser(props: Validation['validate-credentials']) {
    return await this.usersService.validateCredentials(props);
  }

  async login(props: Validation['login-with-password']) {
    const data = validations['login-with-password'].parse(props);
    const user = await this.usersService.validateCredentials(data);

    return this.getSession(user);
  }

  async register(props: Validation['register-with-password']) {
    const data = validations['register-with-password'].parse(props);
    const user = await this.usersService.create(data);

    return this.getSession(user);
  }
}
