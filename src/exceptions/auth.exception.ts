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

export class BuyerNotFoundException extends HttpException {
  constructor() {
    super('please double-check your email and password.', HttpStatus.NOT_FOUND);
  }
}

export class BuyerEmailNotFoundException extends HttpException {
  constructor() {
    super(`Can't find buyer email`, HttpStatus.NOT_FOUND);
  }
}

export class BuyerRefreshUnauthrizedException extends HttpException {
  constructor() {
    super(`Invalid or expired buyer refresh token`, HttpStatus.UNAUTHORIZED);
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

export class SellerNotFoundException extends HttpException {
  constructor() {
    super('please double-check your email and password.', HttpStatus.NOT_FOUND);
  }
}

export class SellerEmailNotFoundException extends HttpException {
  constructor() {
    super(`Can't find seller email`, HttpStatus.NOT_FOUND);
  }
}

export class SellerRefreshUnauthrizedException extends HttpException {
  constructor() {
    super(`Invalid or expired seller refresh token`, HttpStatus.UNAUTHORIZED);
  }
}
