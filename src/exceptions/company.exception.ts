import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNotFoundException extends HttpException {
  constructor() {
    super(`Can't find company`, HttpStatus.NOT_FOUND);
  }
}
