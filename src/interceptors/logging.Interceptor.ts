import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;
    const params = request.params;
    const query = request.query;

    const paramMessage = Object.keys(params).length ? ` \n params: ${JSON.stringify(params, null, 2)}` : '';
    const queryMessage = Object.keys(query).length ? ` \n query: ${JSON.stringify(query, null, 2)}` : '';
    const bodyMessage = Object.keys(body).length ? ` \n body: ${JSON.stringify(body, null, 2)}` : '';

    this.logger.log(`Request to ${method} ${url} ${paramMessage} ${queryMessage} ${bodyMessage}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `Response from ${method} ${url} ${context.getClass().name} ${
              Date.now() - now
            }ms \n response: ${JSON.stringify(data, null, 2)}`,
          ),
        ),
      );
  }
}
