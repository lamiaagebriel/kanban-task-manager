import { createParamDecorator } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationException } from '../exceptions/zod.exception';

export const ZodBody = (schema: z.ZodSchema) => {
  return createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    const result = schema.safeParse(body);

    if (!result.success) throw new ZodValidationException(result.error.issues);

    return result.data;
  })();
};

export const ZodQuery = (schema: z.ZodSchema) => {
  return createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const result = schema.safeParse(query);

    if (!result.success) throw new ZodValidationException(result.error.issues);

    return result.data;
  })();
};

export const ZodParam = (schema: z.ZodSchema) => {
  return createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.params;

    const result = schema.safeParse(params);

    if (!result.success) throw new ZodValidationException(result.error.issues);

    return result.data;
  })();
};
