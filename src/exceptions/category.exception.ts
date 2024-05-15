import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super(`Can't find category`, HttpStatus.NOT_FOUND);
  }
}
