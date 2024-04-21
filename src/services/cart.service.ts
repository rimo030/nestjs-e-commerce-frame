import { Injectable } from '@nestjs/common';
import { CartEntity } from 'src/entities/cart.entity';
import { CartGroupByProductBundleDto } from 'src/entities/dtos/cart-group-by-product-bundle.dto';
import { CartProductDetailDto } from 'src/entities/dtos/cart-product-detail.dto';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { UpdateCartDto } from 'src/entities/dtos/update-cart.dto';
import { CartDeliveryTypeNotFoundException, CartIntercnalServerErrorException } from 'src/exceptions/cart.exception';
import { CartOptionRepository } from 'src/repositories/cart-option.repository';
import { CartRequiredOptionRepository } from 'src/repositories/cart-required-option.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { deliveryType } from 'src/types/enums/delivery-type.enum';
import { feeStandard } from 'src/types/enums/fee-standard.enum';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartRequiredOptionRepository: CartRequiredOptionRepository,
    private readonly cartOptionRepository: CartOptionRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 장바구니와 옵션을 생성한다.
   *
   * @param buyerId 구매자의 아이디
   * @param createCartDto 생성하려는 장바구니의 정보
   * @returns 성공 시 장바구니를 담은 Dto를 리턴한다.
   */
  async addCart(buyerId: number, createCartDto: CreateCartDto): Promise<CartDto | UpdateCartDto> {
    const cart = await this.cartRepository.findCart(buyerId, createCartDto.productId);
    if (!cart) {
      const newCart = await this.createCartWithOptions(buyerId, createCartDto);
      return newCart;
    } else {
      const updateCart = await this.updateCartWithOptions(cart, createCartDto);
      return updateCart;
    }
  }

  /**
   * 새로운 상품을 장바구니에 추가하려는 경우.
   * 새로운 장바구니를 생성 한다.
   * @param buyerId 구매자의 아이디
   * @param createCartDto 생성하려는 장바구니의 정보. 선택옵션은 존재하지 않을수 있다.
   * @returns CartDto : 생성한 장바구니의 정보를 담아 리턴한다.
   */
  private async createCartWithOptions(buyerId: number, createCartDto: CreateCartDto): Promise<CartDto> {
    const { productId, cartRequiredOptions, cartOptions } = createCartDto;
    const newCart = await this.cartRepository.saveCart(buyerId, productId);

    const savedCartRequriedOptions = await this.createCartRequiredOption(newCart.id, cartRequiredOptions);
    if (cartOptions.length) {
      const savedOptions = await this.createCartOption(newCart.id, cartOptions);
      return new CartDto(newCart, savedCartRequriedOptions, savedOptions);
    }
    return new CartDto(newCart, savedCartRequriedOptions, []);
  }

  /**
   * 이미 해당 상품이 장바구니에 저장되어 있는 경우
   * 새로운 옵션이라면 추가한다.
   * 이미 존재하는 옵션이라면 수량을 더해준다.
   *
   * @param cart 조회된 장바구니의 정보
   * @param createCartDto 생성하려는 장바구니의 정보. 선택옵션은 존재하지 않을수 있다.
   * @returns UpdateCartDto : 수정된 장바구니의 정보를 리턴한다.
   */
  private async updateCartWithOptions(cart: CartEntity, createCartDto: CreateCartDto): Promise<UpdateCartDto> {
    const { productId, cartRequiredOptions, cartOptions } = createCartDto;

    const existCartRequiredOptionCounts = this.findExistingCartRequiredOptionCounts(cart, cartRequiredOptions);
    const updateCartRequiredOptionIds =
      await this.cartRequiredOptionRepository.increaseRequiredOptionsCount(existCartRequiredOptionCounts);
    if (existCartRequiredOptionCounts.length !== updateCartRequiredOptionIds.length) {
      throw new CartIntercnalServerErrorException();
    }

    const notExistCartRequriedOptions = cartRequiredOptions.filter(
      (d) => !cart.cartRequiredOptions.some((c) => c.productRequiredOptionId === d.productRequiredOptionId),
    );
    const newCartRequiredOptions = await this.createCartRequiredOption(cart.id, notExistCartRequriedOptions);

    if (cartOptions.length) {
      const existCartOptionCounts = this.findExistingCartOptionCounts(cart, cartOptions);

      const updateCartOptionIds = await this.cartOptionRepository.increaseOptionsCount(existCartOptionCounts);
      if (existCartOptionCounts.length !== updateCartOptionIds.length) {
        throw new CartIntercnalServerErrorException();
      }

      const notExistCartOptions = cartOptions.filter(
        (d) => !cart.cartOptions.some((c) => c.productOptionId === d.productOptionId),
      );
      const newOptions = await this.createCartOption(cart.id, notExistCartOptions);
      return new UpdateCartDto({
        cart,
        updateCartRequiredOptionIds,
        cartRequiredOptions: newCartRequiredOptions,
        updateCartOptionIds,
        cartOptions: newOptions,
      });
    }
    return new UpdateCartDto({
      cart,
      updateCartRequiredOptionIds,
      cartRequiredOptions: newCartRequiredOptions,
      updateCartOptionIds: [],
      cartOptions: [],
    });
  }

  private async createCartRequiredOption(cartId: number, createCartRequiredOptionDto: CreateCartRequiredOptionDto[]) {
    return await this.cartRequiredOptionRepository.saveCartRequiredOptions(cartId, createCartRequiredOptionDto);
  }

  private async createCartOption(cartId: number, createCartOptionDto: CreateCartOptionDto[]) {
    return await this.cartOptionRepository.saveCartOptions(cartId, createCartOptionDto);
  }

  private findExistingCartRequiredOptionCounts(
    cart: CartEntity,
    createCartRequiredOptionDto: CreateCartRequiredOptionDto[],
  ): { id: number; count: number }[] {
    const counts: { id: number; count: number }[] = [];

    for (const requiredOptionDto of createCartRequiredOptionDto) {
      const existingOption = cart.cartRequiredOptions.find(
        (cart) => cart.productRequiredOptionId === requiredOptionDto.productRequiredOptionId,
      );

      if (existingOption) {
        counts.push({ id: existingOption.id, count: requiredOptionDto.count });
      }
    }
    return counts;
  }

  private findExistingCartOptionCounts(
    cart: CartEntity,
    createCartOptionDto: CreateCartOptionDto[],
  ): { id: number; count: number }[] {
    const counts: { id: number; count: number }[] = [];

    for (const optionDto of createCartOptionDto) {
      const existingOption = cart.cartOptions.find((cart) => cart.productOptionId === optionDto.productOptionId);

      if (existingOption) {
        counts.push({ id: existingOption.id, count: optionDto.count });
      }
    }

    return counts;
  }

  /**
   * 유저의 장바구니를 읽습니다.
   *
   * @param buyerId 구매자의 아이디
   * @returns 장바구니 정보와 총 배송비
   *
   */
  async readCarts(buyerId: number): Promise<{
    carts: CartGroupByProductBundleDto[];
    deliveryFee: number;
  }> {
    const carts = await this.cartRepository.findCartDetail(buyerId);
    const cartsGroupByProductBundle = await this.groupByProductBundle(carts);
    const deliveryFee = cartsGroupByProductBundle.map((el) => el.fixedDeliveryFee).reduce((acc, cur) => acc + cur, 0);
    return { carts: cartsGroupByProductBundle, deliveryFee };
  }

  /**
   * 장바구니, 상품, 상품옵션 정보를 묶음(bundle) 별로 배송비와 함께 그룹화 합니다.
   *
   * 묶음이 있는 경우라면 묶음별로, 묶음이 없다면 각 상품을 하나의 묶음으로 취급합니다.
   *
   * @param carts 장바구니 및 상품에 대한 모든 정보
   */

  async groupByProductBundle(carts: CartEntity[]): Promise<CartGroupByProductBundleDto[]> {
    const productIds = carts.map((c) => c.productId);
    const bundleGroup = await this.productRepository.getProductsByBundleGroup(productIds);
    const result: CartGroupByProductBundleDto[] = [];

    for (const bundle of bundleGroup) {
      const bundleCarts = carts.filter((c) => bundle.productIds.includes(c.productId));

      if (bundle.bundleId !== null) {
        const cartDetail = bundleCarts.map((b) => new CartProductDetailDto(b));
        const fixedDeliveryFee = this.productBundleFixDeliveryFee(bundle.chargeStandard, bundleCarts);

        result.push({
          bundleId: bundle.bundleId,
          chargeStandard: bundle.chargeStandard,
          fixedDeliveryFee: fixedDeliveryFee,
          cartDetail: cartDetail,
        });
      } else {
        for (const productId of bundle.productIds) {
          const productCarts = bundleCarts.filter((c) => c.productId === productId);
          const cartDetail = productCarts.map((b) => new CartProductDetailDto(b));
          const fixedDeliveryFee = cartDetail.reduce((acc, c) => acc + this.productFixDeliveryFee(c), 0);

          result.push({
            bundleId: null,
            chargeStandard: null,
            fixedDeliveryFee: fixedDeliveryFee,
            cartDetail: cartDetail,
          });
        }
      }
    }
    return result;
  }

  /**
   * 해당 번들과 내부 장바구니 상품들을 이용해 번들의 최종적인 배송비를 계산한다.
   *
   * @param chargeStandard 상품 묶음의 배송비 기준
   * @param carts 상품 묶음에 해당되는 장바구니 상품 목록
   *
   * @returns 상품 묶음의 최종 배송비
   */
  private productBundleFixDeliveryFee(chargeStandard: keyof typeof feeStandard, carts: CartEntity[]): number {
    const charges = carts.map((c) => c.product.deliveryCharge);
    if (chargeStandard === feeStandard.MIN) {
      return Math.min(...charges);
    } else {
      return Math.max(...charges);
    }
  }

  /**
   * 상품 묶음이 존재하지 않을 경우 배송비를 계산합니다.
   * product(상품)의 deliveryType(배송비)에 따라 배송비를 책정합니다.
   *
   * @param cart 장바구니에 담긴 상품의 정보
   * @returns 상품의 배송비
   */
  private productFixDeliveryFee(cart: CartProductDetailDto): number {
    const cartProduct = cart.product;
    const cartDeliveryType = cartProduct.deliveryType;
    const cartDeliveryFreeOver = cartProduct.deliveryFreeOver;

    if (cartDeliveryType === deliveryType.FREE) {
      return 0;
    } else if (cartDeliveryType === deliveryType.NOT_FREE) {
      return cartProduct.deliveryCharge;
    } else if (
      cartDeliveryType === deliveryType.COUNT_FREE &&
      cartDeliveryFreeOver !== null &&
      cartDeliveryFreeOver !== undefined
    ) {
      const count = cart.cartRequiredOptions.reduce((acc, requiredOption) => acc + requiredOption.count, 0);
      return count >= cartDeliveryFreeOver ? 0 : cartProduct.deliveryCharge;
    } else if (
      cartDeliveryType === deliveryType.PRICE_FREE &&
      cartDeliveryFreeOver !== null &&
      cartDeliveryFreeOver !== undefined
    ) {
      const price = cart.cartRequiredOptions.reduce((acc, ro) => acc + ro.count * ro.price, 0);
      return price >= cartDeliveryFreeOver ? 0 : cartProduct.deliveryCharge;
    }

    throw new CartDeliveryTypeNotFoundException();
  }

  /**
   * 이미 담긴 장바구니 상품의 수량을 변경한다.
   *
   * @param userId
   * @param cartId
   * @param cartOptionId
   * @param cartType
   * @param count
   */
  async updateCart(
    userId: number,
    cartId: number,
    cartOptionId: number,
    cartType: 'option' | 'requiredOption',
    count: number,
  ) {}

  /**
   * 장바구니에서 상품을 지웁니다.
   * 상품은 배열로 아이디를 전달해서 한 번에 지울 수 있습니다.
   * 장바구니에서 상품들을 체크박스로 체크해서 한꺼번에 지우는 걸 상상해주세요.
   * 장바구니는 soft-delete되어야 합니다.
   *
   * @param userId 상품을 지울 유저의 아이디
   * @param productIds 상품 아이디 배열
   */
  deleteCart(userId: number, productIds: number[]) {}

  /**
   * 장바구니 상품의 옵션만을 제거한다.
   * 제거할 때에는 반드시 필수 옵션이 1개 이상 남아 있어야 한다.
   *
   * @param userId
   * @param cartId
   * @param cartOptionId
   * @param cartType
   */
  deleteCartOption(userId: number, cartId: number, cartOptionId: number, cartType: 'option' | 'requiredOption') {}
}
