import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodResponseSuccess } from '../types/zod-response.type';

@Injectable()
export class ZodResponseInterceptor<T> implements NestInterceptor<
  T,
  ZodResponseSuccess<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ZodResponseSuccess<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the controller returns null/undefined, return void
        if (data === null || data === undefined) {
          return undefined;
        }

        // If the controller already returns our format, use it
        if (data && typeof data === 'object' && 'ok' in data) {
          return data;
        }

        // Otherwise, wrap the data in our success format
        return {
          ok: true,
          data,
        };
      }),
    );
  }
}
