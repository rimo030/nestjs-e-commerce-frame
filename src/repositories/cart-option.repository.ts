import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartOptionEntity } from 'src/entities/cart-option.entity';
import { CartOptionDto } from 'src/entities/dtos/cart-option.dto';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';

@Injectable()
export class CartOptionRepository {
  constructor(
    @InjectRepository(CartOptionEntity)
    private cartOptionRepository: Repository<CartOptionEntity>,
  ) {}

  /**
   * 장바구니에 선택 옵션들을 저장합니다.
   * @param cartId 저장할 장바구니의 아이디 입니다.
   * @param createCartOptionDtos 저장할 상품 선택 옵션들의 데이터 입니다.
   */
  async saveCartOptions(cartId: number, createCartOptionDtos: CreateCartOptionDto[]): Promise<CartOptionDto[]> {
    const dtos = createCartOptionDtos.map((c) => ({
      cartId,
      productOptionId: c.productOptionId,
      count: c.count,
    }));

    const cartOptions = await this.cartOptionRepository.save(dtos);
    return cartOptions.map((c) => ({ id: c.id, cartId: c.cartId, productOptionId: c.productOptionId, count: c.count }));
  }

  /**
   * 장바구니 선택 옵션의 수량을 갱신합니다.
   * 갱신에 성공했다면 아이디를 반환합니다.
   *
   * @param id 수정할 장바구니 선택 옵션의 아이디 입니다.
   * @param count 수정할 수량입니다.
   */
  async updateOptionsCount(id: number, count: number): Promise<number | null> {
    const updateResult = await this.cartOptionRepository.update(id, { count });
    return updateResult.affected ? id : null;
  }

  /**
   * 상품 선택 옵션들의 수량을 증가시킵니다.
   * 업데이트에 성공한 경우의 아이디들을 반환합니다.
   *
   * @param idWithCount 선택 옵션의 아이디와 증가시킬 수량으로 이루어진 객체 배열 입니다.
   */
  async updateOptionsCounts(idWithCount: { id: number; count: number }[]): Promise<number[]> {
    const updatedIds: number[] = [];

    await Promise.all(
      idWithCount.map(async (option) => {
        const updateResult = await this.cartOptionRepository.update({ id: option.id }, { count: option.count });
        if (updateResult.affected !== 0) {
          updatedIds.push(option.id);
        }
      }),
    );
    return updatedIds;
  }

  /**
   * 장바구니 선택 옵션을 조회합니다.
   * @param ids 조회할 선택 옵션의 아이디 입니다.
   */
  async getOption(id: number): Promise<CartOptionDto | null> {
    return await this.cartOptionRepository.findOne({
      select: {
        id: true,
        cartId: true,
        productOptionId: true,
        count: true,
      },
      where: { id },
    });
  }

  /**
   * 장바구니 선택 옵션들을 조회합니다.
   * @param ids 조회할 선택 옵션들의 아이디 배열입니다.
   */
  async getOptions(ids: number[]): Promise<CartOptionDto[]> {
    return await this.cartOptionRepository.find({
      select: {
        id: true,
        cartId: true,
        productOptionId: true,
        count: true,
      },
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 상품 선택 옵션의 수량을 증가시킵니다.
   * 각 id를 가진 선택 옵션을 count만큼 증가 시키고, 업데이트에 성공한 경우의 아이디들을 반환합니다.
   *
   * @param idWithCount 선택 옵션의 아이디와 증가시킬 수량으로 이루어진 객체 배열 입니다.
   */
  async increaseOptionsCount(idWithCount: { id: number; count: number }[]): Promise<number[]> {
    const updatedIds: number[] = [];

    await Promise.all(
      idWithCount.map(async (option) => {
        const updateResult = await this.cartOptionRepository.increment({ id: option.id }, 'count', option.count);
        if (updateResult.affected !== 0) {
          updatedIds.push(option.id);
        }
      }),
    );
    return updatedIds;
  }
}
