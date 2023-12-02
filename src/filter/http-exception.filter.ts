import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';

type EntityName = string;

interface ErrorObject {
  type: `business.${EntityName}`;
  code: number;
  result: false;
  errorMessage: string;
}

interface SuccessCase {
  type: '';
  code: 2000;
  data: {};
  result: true;
}

export function ThrowBadRequestExceptionError(params: ErrorObject) {
  throw new BadRequestException(params);
}

export function IsErrorObjectTypeGuard(obj: any): obj is ErrorObject {
  if (typeof obj === 'object' && obj !== null) {
    if (
      typeof obj.type === 'string' &&
      typeof obj.code === 'number' &&
      typeof obj.result === 'boolean' &&
      typeof obj.errorMessage === 'string'
    ) {
      return true;
    }
  }
  return false;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorObject: string | object = exception.getResponse();
    if (IsErrorObjectTypeGuard(errorObject)) {
      const { type, code, result, errorMessage } = errorObject;
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        type: type,
        code: code,
        result: result,
        errorMessage: errorMessage,
      });
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      type: null,
      code: null,
      result: null,
      errorMessage: null,
    });
  }
}
