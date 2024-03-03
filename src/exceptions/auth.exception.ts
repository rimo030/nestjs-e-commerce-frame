import { HttpException, HttpStatus } from '@nestjs/common';

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
