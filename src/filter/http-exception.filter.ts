import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

type EntityName = string;

interface ErrorObject {
  type: `business.${EntityName}`;
  code: number;
  result: false;
  errorMessage: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const { type, code, result, errorMessage }: ErrorObject = exception.getResponse() as ErrorObject;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      type: type ?? null,
      code: code ?? null,
      result: result ?? null,
      errorMessage: errorMessage ?? null,
    });
  }
}
