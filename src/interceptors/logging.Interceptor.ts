import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    Logger.log(`Request to ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          Logger.log(
            `Response from ${method} ${url} ${context.getClass().name} ${
              Date.now() - now
            }ms \n response: ${JSON.stringify(data)}`,
          ),
        ),
      );
  }
}
