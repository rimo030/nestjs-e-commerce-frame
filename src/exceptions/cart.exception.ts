import { HttpException, HttpStatus } from '@nestjs/common';

export class CartNotFoundException extends HttpException {
  constructor() {
    super(`Can't find cart`, HttpStatus.NOT_FOUND);
  }
}

export class CartRequiredOptionNotFoundException extends HttpException {
  constructor() {
    super(`Can't find Cart Required Option`, HttpStatus.NOT_FOUND);
  }
}

export class CartOptionNotFoundException extends HttpException {
  constructor() {
    super(`Can't find Cart Option`, HttpStatus.NOT_FOUND);
  }
}

export class CartForbiddenException extends HttpException {
  constructor() {
    super(`Cart resource is forbidden.`, HttpStatus.FORBIDDEN);
  }
}

export class CartInternalServerErrorException extends HttpException {
  constructor() {
    super(`Cart update error`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class CartRequiredOptionInternalServerErrorException extends HttpException {
  constructor() {
    super(`Cart required option update error`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class CartOptionInternalServerErrorException extends HttpException {
  constructor() {
    super(`Cart option update error`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class CartDeliveryTypeNotFoundException extends HttpException {
  constructor() {
    super(`Can't find delivery type`, HttpStatus.NOT_FOUND);
  }
}

export class CartDeliveryFreeOverNotFoundException extends HttpException {
  constructor() {
    super(`Can't find delivery free over`, HttpStatus.NOT_FOUND);
  }
}
