import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { ZodGlobalExceptionFilter } from './validations/filters/zod-global-exception.filter';
import { ZodResponseInterceptor } from './validations/interceptors/zod-response.interceptor';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ZodGlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodResponseInterceptor,
    },
  ],
})
export class AppModule {}
