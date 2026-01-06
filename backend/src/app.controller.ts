import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('')
  checkHelth() {
    return { ok: true };
  }
}
