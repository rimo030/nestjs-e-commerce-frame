import { HttpException, HttpStatus } from '@nestjs/common';

export class CartNotFoundException extends HttpException {
  constructor() {
    super(`Can't find cart`, HttpStatus.NOT_FOUND);
  }
}
