import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(exception.getResponse(), null, 2)}`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.getResponse(),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
