import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductBundleNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product`, HttpStatus.NOT_FOUND);
  }
}

export class ProductNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product`, HttpStatus.NOT_FOUND);
  }
}

export class ProductsNotFoundException extends HttpException {
  constructor() {
    super(`Can't find Products`, HttpStatus.NOT_FOUND);
  }
}

export class ProductRequiredOptionNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product required option`, HttpStatus.NOT_FOUND);
  }
}

export class ProductRequiredOptionsNotFoundException extends HttpException {
  constructor() {
    super(`There is no required option for product`, HttpStatus.NOT_FOUND);
  }
}

export class ProductOptionNotFoundException extends HttpException {
  constructor() {
    super(`Can't find product option`, HttpStatus.NOT_FOUND);
  }
}
