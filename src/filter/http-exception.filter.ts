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

    const body = request.body;
    const params = request.params;
    const query = request.query;

    const paramMessage = Object.keys(params).length ? ` \n params: ${JSON.stringify(params, null, 2)}` : '';
    const queryMessage = Object.keys(query).length ? ` \n query: ${JSON.stringify(query, null, 2)}` : '';
    const bodyMessage = Object.keys(body).length ? ` \n body: ${JSON.stringify(body, null, 2)}` : '';

    let errorMessage: any = exception.getResponse();
    if (typeof errorMessage === 'object') {
      errorMessage = errorMessage.message;
    }

    this.logger.error(
      `Error to ${request.method} ${request.url} ${paramMessage} ${queryMessage} ${bodyMessage} 
      \n statusCode : ${status} 
      \n message : ${JSON.stringify(errorMessage, null, 2)}`,
    );

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
