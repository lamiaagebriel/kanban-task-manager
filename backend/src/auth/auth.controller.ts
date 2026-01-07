import { Controller, Post, UseGuards } from '@nestjs/common';
import { ZodBody } from '../validations/decorators/zod.decorator';
import { AuthService } from './auth.service';
import { Validation, validations } from './auth.validations';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login-with-password')
  async loginWithPassword(
    @ZodBody(validations['login-with-password'])
    body: Validation['login-with-password'],
  ) {
    const result = await this.authService.login(body);

    return {
      ok: true,
      data: result,
    };
  }

  @Public()
  @Post('register-with-password')
  async registerWithPassword(
    @ZodBody(validations['register-with-password'])
    body: Validation['register-with-password'],
  ) {
    const result = await this.authService.register(body);

    return {
      ok: true,
      data: result,
    };
  }
}
