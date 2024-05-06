import { Injectable } from '@nestjs/common';
import { CartGroupByProductBundleDto } from 'src/entities/dtos/cart-group-by-product-bundle.dto';
import { CartOptionDto } from 'src/entities/dtos/cart-option.dto';
import { CartProductDetailDto } from 'src/entities/dtos/cart-product-detail.dto';
import { CartRequiredOptionDto } from 'src/entities/dtos/cart-required-option.dto';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { UpdateCartOptionCountDto } from 'src/entities/dtos/update-cart-option-count.dto';
import { UpdateCartDto } from 'src/entities/dtos/update-cart.dto';
import {
  CartForbiddenException,
  CartDeliveryTypeNotFoundException,
  CartNotFoundException,
  CartRequiredOptionNotFoundException,
  CartOptionNotFoundException,
} from 'src/exceptions/cart.exception';
import { CartOptionRepository } from 'src/repositories/cart-option.repository';
import { CartRequiredOptionRepository } from 'src/repositories/cart-required-option.repository';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { chargeStandard } from 'src/types/charge-standard.type';
import { _deliveryType } from 'src/types/enums/delivery-type.enum';
import { PrismaService } from './prisma.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly cartRepository: CartRepository,
    private readonly cartRequiredOptionRepository: CartRequiredOptionRepository,
    private readonly cartOptionRepository: CartOptionRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 장바구니에 상품과 상품 옵션들을 저장합니다.
   * 이미 담겨있는 상품이라면 개수를 더해 반환합니다.
   *
   * @todo 상품 입력 옵션 추가
   *
   * @param buyerId 구매자의 아이디 입니다.
   * @param createCartDto 저장하려는 장바구니의 정보 입니다.
   */
  async addCart(buyerId: number, createCartDto: CreateCartDto): Promise<CartDto | UpdateCartDto> {
    const cart = await this.getCartByProductId(buyerId, createCartDto.productId);
    if (!cart) {
      const newCart = await this.createCartWithOptions(buyerId, createCartDto);
      return newCart;
    } else {
      const updateCart = await this.updateCartWithOptions(cart, createCartDto);
      return updateCart;
    }
  }

  /**
   * buyer의 장바구니에 해당 상품이 담겨있다면 조회된 데이터를 반환합니다.
   *
   * @param buyerId 조회할 buyer의 아이디 입니다.
   * @param productId 조회할 상품의 아이디 입니다.
   */
  async getCartByProductId(buyerId: number, productId: number): Promise<CartDto | null> {
    const cart = await this.prisma.cart.findFirst({
      select: {
        id: true,
        productId: true,
        buyerId: true,
        cartRequiredOptions: { select: { id: true, cartId: true, productRequiredOptionId: true, count: true } },
        cartOptions: { select: { id: true, cartId: true, productOptionId: true, count: true } },
      },
      orderBy: { id: 'asc' },
      where: { buyerId, productId },
    });

    return cart;
  }

  /**
   * 장바구니에 상품과 옵션을 새로 저장합니다.
   * 새로운 상품을 장바구니에 추가하려는 경우입니다.
   *
   * @param buyerId buyer의 아이디 입니다.
   * @param createCartDto 생성하려는 장바구니의 정보입니다. 선택 옵션은 존재하지 않을수 있습니다.
   *
   */
  private async createCartWithOptions(buyerId: number, createCartDto: CreateCartDto): Promise<CartDto> {
    const { productId, createCartRequiredOptionDtos, createCartOptionDtos } = createCartDto;

    const { id } = await this.prisma.cart.create({
      select: { id: true },
      data: { buyerId, productId },
    });

    const cartRequiredOptions = await this.createCartRequiredOptions(id, createCartRequiredOptionDtos);
    const cartOptions = await this.createCartOptions(id, createCartOptionDtos);

    return { id, buyerId, productId, cartRequiredOptions, cartOptions };
  }

  /**
   * 장바구니 필수 옵션들을 생성합니다.
   *
   * @param cartId 장바구니의 아이디 입니다.
   * @param cartRequiredOptionDtos 저장할 필수 옵션들의 정보입니다.
   */
  async createCartRequiredOptions(
    cartId: number,
    createCartRequiredOptionDtos: CreateCartRequiredOptionDto[],
  ): Promise<CartRequiredOptionDto[]> {
    const savedCartRequriedOptions = await this.prisma.$transaction(
      createCartRequiredOptionDtos.map((c) =>
        this.prisma.cartRequiredOption.create({
          select: { id: true, cartId: true, productRequiredOptionId: true, count: true },
          data: {
            cartId,
            productRequiredOptionId: c.productRequiredOptionId,
            count: c.count,
          },
        }),
      ),
    );

    return savedCartRequriedOptions;
  }

  /**
   * 장바구니 선택 옵션들을 생성합니다.
   *
   * @param cartId 장바구니의 아이디 입니다.
   * @param cartRequiredOptionDtos 저장할 선택 옵션들의 정보입니다.
   */
  async createCartOptions(cartId: number, createCartOptionDtos: CreateCartOptionDto[]): Promise<CartOptionDto[]> {
    const savedCartOptions = await this.prisma.$transaction(
      createCartOptionDtos.map((c) =>
        this.prisma.cartOption.create({
          select: { id: true, cartId: true, productOptionId: true, count: true },
          data: {
            cartId,
            productOptionId: c.productOptionId,
            count: c.count,
          },
        }),
      ),
    );
    return savedCartOptions;
  }

  /**
   * 이미 해당 상품이 장바구니에 저장되어 있는 경우입니다.
   * 새로운 옵션이라면 추가하고 이미 존재하는 옵션이라면 수량을 더해줍니다.
   *
   * @param cart 조회된 장바구니의 데이터 입니다.
   * @param createCartDto 추가하려는 장바구니의 데이터입니다.
   */
  private async updateCartWithOptions(cart: CartDto, createCartDto: CreateCartDto): Promise<UpdateCartDto> {
    const { id, buyerId, productId, cartRequiredOptions, cartOptions } = cart;

    const { existingRequiredOption, notExistingRequiredOption } = this.findExistingCartRequiredOptions(
      cartRequiredOptions,
      createCartDto.createCartRequiredOptionDtos,
    );
    const newCartRequiredOptions = await this.createCartRequiredOptions(cart.id, notExistingRequiredOption);
    const updateCartRequiredOptions = await this.increaseRequiredOptionsCount(existingRequiredOption);

    const { existingOption, notExistingOption } = this.findExistingCartOptions(
      cartOptions,
      createCartDto.createCartOptionDtos,
    );
    const newCartOptions = await this.createCartOptions(cart.id, notExistingOption);
    const updateCartOptions = await this.increaseOptionsCount(existingOption);

    return {
      id,
      buyerId,
      productId,
      cartRequiredOptions: newCartRequiredOptions,
      cartOptions: newCartOptions,
      updateCartRequiredOptions,
      updateCartOptions,
    };
  }

  /**
   * 이미 장바구니에 담겨있는 필수 옵션과 그렇지 않은 필수 옵션을 분류 합니다.
   *
   * 담겨 있는 경우 아이디(id)과 수량(count)를 반환합니다.
   * 담겨 있지 않은 경우 들어온 DTO(CreateCartRequiredOptionDto)를 반환합니다.
   *
   * @param savedCartRequiredOptions 저장되어있는 필수 옵션의 데이터 입니다.
   * @param createCartRequiredOptions 추가할 필수 옵션의 데이터 입니다.
   */
  private findExistingCartRequiredOptions(
    savedCartRequiredOptions: CartRequiredOptionDto[],
    createCartRequiredOptions: CreateCartRequiredOptionDto[],
  ) {
    const existingRequiredOption: { id: number; count: number }[] = [];
    const notExistingRequiredOption: CreateCartRequiredOptionDto[] = [];

    for (const c of createCartRequiredOptions) {
      const existOption = savedCartRequiredOptions.find((s) => s.productRequiredOptionId === c.productRequiredOptionId);
      if (existOption) {
        existingRequiredOption.push({ id: existOption.id, count: c.count });
      } else {
        notExistingRequiredOption.push(c);
      }
    }
    return { existingRequiredOption, notExistingRequiredOption };
  }

  /**
   * 이미 장바구니에 담겨있는 선택 옵션과 그렇지 않은 선택 옵션을 분류 합니다.
   *
   * 담겨 있는 경우 아이디(id)과 수량(count)를 반환합니다.
   * 담겨 있지 않은 경우 들어온 DTO(CreateCartOptionDto)를 반환합니다.
   *
   * @param savedCartOptions 저장되어있는 선택 옵션의 데이터 입니다.
   * @param createCartOptions 추가할 선택 옵션의 데이터 입니다.
   */
  private findExistingCartOptions(savedCartOptions: CartOptionDto[], createCartOptions: CreateCartOptionDto[]) {
    const existingOption: { id: number; count: number }[] = [];
    const notExistingOption: CreateCartOptionDto[] = [];

    for (const c of createCartOptions) {
      const existOption = savedCartOptions.find((s) => s.productOptionId === c.productOptionId);
      if (existOption) {
        existingOption.push({ id: existOption.id, count: c.count });
      } else {
        notExistingOption.push(c);
      }
    }
    return { existingOption, notExistingOption };
  }

  /**
   * 해당 id를 가진 필수 옵션의 count칼럼을 증가시킵니다.
   * 기존 수량에 count만큼 더합니다.
   *
   * @param idWithCount 필수 옵션의 아이디와 수량을 담은 객체로 이루어진 배열입니다.
   */
  async increaseRequiredOptionsCount(idWithCount: { id: number; count: number }[]): Promise<CartRequiredOptionDto[]> {
    const updateCartRequiredOptions = await this.prisma.$transaction(
      idWithCount.map((i) =>
        this.prisma.cartRequiredOption.update({
          select: { id: true, cartId: true, productRequiredOptionId: true, count: true },
          where: { id: i.id },
          data: {
            count: {
              increment: i.count,
            },
          },
        }),
      ),
    );
    return updateCartRequiredOptions;
  }

  /**
   * 해당 id를 가진 선택 옵션의 count칼럼을 증가시킵니다.
   * 기존 수량에 count만큼 더합니다.
   *
   * @param idWithCount 선택 옵션의 아이디와 수량을 담은 객체로 이루어진 배열입니다.
   */
  async increaseOptionsCount(idWithCount: { id: number; count: number }[]): Promise<CartOptionDto[]> {
    const updateCartOptions = await this.prisma.$transaction(
      idWithCount.map((i) =>
        this.prisma.cartOption.update({
          select: { id: true, cartId: true, productOptionId: true, count: true },
          where: { id: i.id },
          data: {
            count: {
              increment: i.count,
            },
          },
        }),
      ),
    );
    return updateCartOptions;
  }

  /**
   * 유저의 장바구니를 읽습니다.
   * 장바구니에 담긴 상품 묶음, 상품, 상품 필수 옵션, 선택 옵션의 데이터가 함께 조회되어야 합니다.
   * 상품 묶음을 고려해 배송비가 계산 되어야 합니다.
   *
   * @todo 상품 입력 옵션 추가
   *
   * @param buyerId 구매자의 아이디
   */
  async readCarts(buyerId: number): Promise<{
    carts: CartGroupByProductBundleDto[];
    deliveryFee: number;
  }> {
    const cartDetails = await this.getCartDetail(buyerId);
    const cartsGroupByProductBundle = await this.groupByProductBundle(cartDetails);
    const deliveryFee = cartsGroupByProductBundle.map((el) => el.bundleDeliveryFee).reduce((acc, cur) => acc + cur, 0);
    return { carts: cartsGroupByProductBundle, deliveryFee };
  }

  /**
   * 장바구니의 정보와 담긴 상품과 필수/선택옵션의 데이터도 함께 조회되어야 합니다.
   *
   * @param buyerId 조회할 buyer의 id입니다.
   */
  async getCartDetail(buyerId: number): Promise<CartProductDetailDto[]> {
    const cartDetails = await this.prisma.cart.findMany({
      select: {
        id: true,
        productId: true,
        buyerId: true,
        product: {
          select: {
            id: true,
            sellerId: true,
            bundleId: true,
            categoryId: true,
            companyId: true,
            isSale: true,
            name: true,
            description: true,
            deliveryType: true,
            deliveryFreeOver: true,
            deliveryCharge: true,
            img: true,
          },
        },
        cartRequiredOptions: {
          select: {
            id: true,
            cartId: true,
            productRequiredOptionId: true,
            count: true,
            productRequiredOption: {
              select: {
                id: true,
                productId: true,
                name: true,
                price: true,
                isSale: true,
              },
            },
          },
        },
        cartOptions: {
          select: {
            id: true,
            cartId: true,
            productOptionId: true,
            count: true,
            productOption: {
              select: {
                id: true,
                productId: true,
                name: true,
                price: true,
                isSale: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
      where: { buyerId },
    });

    return cartDetails;
  }

  /**
   * 장바구니, 상품, 상품옵션 정보를 묶음(bundle) 별로 배송비와 함께 그룹화 합니다.
   * 묶음이 있는 경우라면 묶음별로, 묶음이 없다면 각 상품을 하나의 묶음으로 취급합니다.
   *
   * @param cartDetails 장바구니 및 상품, 옵션들에 대한 모든 정보
   */
  async groupByProductBundle(cartDetails: CartProductDetailDto[]): Promise<CartGroupByProductBundleDto[]> {
    const productIds = cartDetails.map((c) => c.productId);
    const bundleGroup = await this.productRepository.getProductsByBundleGroup(productIds);
    const result: CartGroupByProductBundleDto[] = [];

    for (const bundle of bundleGroup) {
      const bundleCarts = cartDetails.filter((c) => bundle.productIds.includes(c.productId));

      if (bundle.bundleId !== null) {
        const bundleDeliveryFee = this.calculateBundleDeliveryFee(bundle.chargeStandard, bundleCarts);

        result.push({
          bundleId: bundle.bundleId,
          chargeStandard: bundle.chargeStandard,
          bundleDeliveryFee: bundleDeliveryFee,
          cartDetails: cartDetails,
        });
      } else {
        for (const productId of bundle.productIds) {
          const productCarts = bundleCarts.filter((c) => c.productId === productId);
          const bundleDeliveryFee = productCarts.reduce((acc, c) => acc + this.calculateProductDeliveryFee(c), 0);

          result.push({
            bundleId: null,
            chargeStandard: null,
            bundleDeliveryFee: bundleDeliveryFee,
            cartDetails: productCarts,
          });
        }
      }
    }
    return result;
  }

  /**
   * 해당 번들과 내부 장바구니 상품들을 이용해 번들의 최종적인 배송비를 계산한다.
   *
   * @param standard 상품 묶음의 배송비 기준
   * @param carts 상품 묶음에 해당되는 장바구니 상품 목록
   *
   * @returns 상품 묶음의 최종 배송비
   */
  private calculateBundleDeliveryFee(standard: chargeStandard, carts: CartProductDetailDto[]): number {
    const charges = carts.map((c) => c.product.deliveryCharge);
    if (standard === 'MIN') {
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
  private calculateProductDeliveryFee(cart: CartProductDetailDto): number {
    const cartProduct = cart.product;
    const cartDeliveryType = cartProduct.deliveryType;
    const cartDeliveryFreeOver = cartProduct.deliveryFreeOver;

    if (cartDeliveryType === _deliveryType.FREE) {
      return 0;
    } else if (cartDeliveryType === _deliveryType.NOT_FREE) {
      return cartProduct.deliveryCharge;
    } else if (
      cartDeliveryType === _deliveryType.COUNT_FREE &&
      cartDeliveryFreeOver !== null &&
      cartDeliveryFreeOver !== undefined
    ) {
      const count = cart.cartRequiredOptions.reduce((acc, requiredOption) => acc + requiredOption.count, 0);
      return count >= cartDeliveryFreeOver ? 0 : cartProduct.deliveryCharge;
    } else if (
      cartDeliveryType === _deliveryType.PRICE_FREE &&
      cartDeliveryFreeOver !== null &&
      cartDeliveryFreeOver !== undefined
    ) {
      const price = cart.cartRequiredOptions.reduce((acc, ro) => acc + ro.count * ro.productRequiredOption.price, 0);
      return price >= cartDeliveryFreeOver ? 0 : cartProduct.deliveryCharge;
    }

    throw new CartDeliveryTypeNotFoundException();
  }

  /**
   * 이미 담긴 장바구니 옵션의 상품의 수량을 변경합니다.
   *
   * @param buyerId 유저의 아이디
   * @param updateCartOptionCountDto 업데이트 할 장바구니와 옵션에 대한 정보
   *
   * @returns 변경된 결과 옵션의 id를 반환합니다.
   */
  async updateCartsOptionCount(buyerId: number, updateCartOptionCountDto: UpdateCartOptionCountDto): Promise<number> {
    const { id, cartId, cartOptionType, count } = updateCartOptionCountDto;
    const cart = await this.cartRepository.findCartWithOptions(cartId);

    if (!cart) {
      throw new CartNotFoundException();
    }

    if (cart.buyerId !== buyerId) {
      throw new CartForbiddenException();
    }

    if (cartOptionType == 'requiredOption') {
      const isCartRequiredOption = cart.cartRequiredOptions.filter((c) => c.id === id);
      if (isCartRequiredOption.length === 0) {
        throw new CartRequiredOptionNotFoundException();
      }
      const updateId = await this.cartRequiredOptionRepository.updateRequiredOptionsCount(id, count);

      if (!updateId) {
        throw new CartRequiredOptionNotFoundException();
      }

      return updateId;
    } else if (cartOptionType == 'option') {
      const isCartOption = cart.cartOptions.filter((c) => c.id === id);
      if (isCartOption.length === 0) {
        throw new CartOptionNotFoundException();
      }
      const updateId = await this.cartOptionRepository.updateOptionsCount(id, count);

      if (!updateId) {
        throw new CartOptionNotFoundException();
      }
      return updateId;
    } else {
      throw new CartForbiddenException();
    }
  }

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
