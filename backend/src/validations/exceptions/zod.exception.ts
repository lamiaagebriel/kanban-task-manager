import { HttpException, HttpStatus } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationException extends HttpException {
  constructor(public readonly zodIssues: z.ZodIssue[]) {
    super('Validation failed', HttpStatus.BAD_REQUEST);
  }
}
