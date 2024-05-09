import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthForbiddenException extends HttpException {
  constructor() {
    super(`Auth resource is forbidden.`, HttpStatus.FORBIDDEN);
  }
}

/**
 * Buyer
 */
export class BuyerUnauthrizedException extends HttpException {
  constructor() {
    super('this email already exists.', HttpStatus.UNAUTHORIZED);
  }
}

export class BuyerNotfoundException extends HttpException {
  constructor() {
    super('please double-check your email and password.', HttpStatus.NOT_FOUND);
  }
}

export class BuyerEmailNotfoundException extends HttpException {
  constructor() {
    super(`Can't find buyer email`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Seller
 */
export class SellerUnauthrizedException extends HttpException {
  constructor() {
    super('this email already exists.', HttpStatus.UNAUTHORIZED);
  }
}

export class SellerNotfoundException extends HttpException {
  constructor() {
    super('please double-check your email and password.', HttpStatus.NOT_FOUND);
  }
}

export class SellerEmailNotfoundException extends HttpException {
  constructor() {
    super(`Can't find seller email`, HttpStatus.NOT_FOUND);
  }
}
