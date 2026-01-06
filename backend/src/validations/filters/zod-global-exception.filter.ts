import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from '../exceptions/zod.exception';
import { ZodResponseError } from '../types/zod-response.type';

@Catch()
export class ZodGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ZodResponseError;

    // Handle ZodValidationException (Zod errors)
    if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      errorResponse = {
        ok: false,
        zodIssues: exception.zodIssues,
      };
    }
    // Handle standard NestJS HttpExceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle class-validator errors (from ValidationPipe)
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const messages = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message;

        errorResponse = {
          ok: false,
          message: messages as string,
        };
      } else {
        errorResponse = {
          ok: false,
          message: exception.message,
        };
      }
    }
    // Handle unexpected errors
    else if (exception instanceof Error) {
      errorResponse = {
        ok: false,
        message: exception.message,
      };
    }
    // Handle unknown errors
    else {
      errorResponse = {
        ok: false,
        message: 'An unexpected error occurred',
      };
    }

    response.status(status).json(errorResponse);
  }
}
