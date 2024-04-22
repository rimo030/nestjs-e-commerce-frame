import { HttpException, HttpStatus } from '@nestjs/common';

export class CartNotFoundException extends HttpException {
  constructor() {
    super(`Can't find cart`, HttpStatus.NOT_FOUND);
  }
}

export class CartIntercnalServerErrorException extends HttpException {
  constructor() {
    super(`Cart update error`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class CartDeliveryTypeNotFoundException extends HttpException {
  constructor() {
    super(`Can't find delivery type`, HttpStatus.NOT_FOUND);
  }
}
