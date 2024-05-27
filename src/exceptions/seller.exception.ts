import { HttpException, HttpStatus } from '@nestjs/common';

export class SellerNotFoundException extends HttpException {
  constructor() {
    super(`Can't find seller`, HttpStatus.NOT_FOUND);
  }
}

export class ProductBundleNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product Bundle`, HttpStatus.NOT_FOUND);
  }
}

export class ProductNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product`, HttpStatus.NOT_FOUND);
  }
}

export class ProductUnauthrizedException extends HttpException {
  constructor() {
    super(`You are not seller of this product.`, HttpStatus.UNAUTHORIZED);
  }
}
