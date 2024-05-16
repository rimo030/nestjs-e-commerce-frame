import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartRequiredOptionEntity } from 'src/entities/cart-required-option.entity';
import { CartRequiredOptionDto } from 'src/entities/dtos/cart-required-option.dto';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';

@Injectable()
export class CartRequiredOptionRepository {
  constructor(
    @InjectRepository(CartRequiredOptionEntity)
    private cartRequiredOptionRepository: Repository<CartRequiredOptionEntity>,
  ) {}

  /**
   * 장바구니 필수 옵션들을 저장합니다.
   * @param cartId 저장할 장바구니의 아이디 입니다.
   * @param createCartRequiredOptionDtos 저장할 상품 필수 옵션들의 데이터 입니다.
   */
  async saveCartRequiredOptions(
    cartId: number,
    createCartRequiredOptionDtos: CreateCartRequiredOptionDto[],
  ): Promise<CartRequiredOptionDto[]> {
    const dtos = createCartRequiredOptionDtos.map((c) => ({
      cartId,
      productRequiredOptionId: c.productRequiredOptionId,
      count: c.count,
    }));

    const cartRequiredOptions = await this.cartRequiredOptionRepository.save(dtos);
    return cartRequiredOptions.map((c) => ({
      id: c.id,
      cartId: c.cartId,
      productRequiredOptionId: c.productRequiredOptionId,
      count: c.count,
    }));
  }

  /**
   * 장바구니 필수 옵션의 수량을 갱신합니다.
   * 갱신에 성공했다면 아이디를 반환합니다.
   *
   * @param id 수정할 장바구니 필수 옵션의 아이디 입니다.
   * @param count 수정할 수량입니다.
   */
  async updateRequiredOptionsCount(id: number, count: number): Promise<number | null> {
    const updateResult = await this.cartRequiredOptionRepository.update(id, { count });
    return updateResult.affected ? id : null;
  }

  /**
   * 상품 필수 옵션의 수량을 갱신 합니다.
   * 업데이트에 성공한 경우의 아이디들을 반환합니다.
   *
   * @param idWithCounts 필수 옵션의 아이디와 수정할 수량으로 이루어진 객체 배열 입니다.
   */
  async updateRequiredOptionsCounts(idWithCounts: { id: number; count: number }[]): Promise<number[]> {
    const updatedIds: number[] = [];

    await Promise.all(
      idWithCounts.map(async (i) => {
        const updateResult = await this.cartRequiredOptionRepository.update({ id: i.id }, { count: i.count });
        if (updateResult.affected !== 0) {
          updatedIds.push(i.id);
        }
      }),
    );
    return updatedIds;
  }

  /**
   * 장바구니 필수 옵션을 조회합니다.
   * @param ids 조회할 필수 옵션들의 아이디 입니다.
   */
  async getRequiredOption(id: number): Promise<CartRequiredOptionDto | null> {
    return await this.cartRequiredOptionRepository.findOne({
      select: {
        id: true,
        cartId: true,
        productRequiredOptionId: true,
        count: true,
      },
      where: { id },
    });
  }

  /**
   * 장바구니 필수 옵션들을 조회합니다.
   * @param ids 조회할 필수 옵션들의 아이디 배열입니다.
   */
  async getRequiredOptions(ids: number[]): Promise<CartRequiredOptionDto[]> {
    return await this.cartRequiredOptionRepository.find({
      select: {
        id: true,
        cartId: true,
        productRequiredOptionId: true,
        count: true,
      },
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 상품 필수 옵션의 수량을 증가시킵니다.
   * 각 id를 가진 필수 옵션을 count만큼 증가 시키고, 업데이트에 성공한 경우의 아이디들을 반환합니다.
   *
   * @param idWithCounts 필수 옵션의 아이디와 증가시킬 수량으로 이루어진 객체 배열 입니다.
   */
  async increaseRequiredOptionsCount(idWithCounts: { id: number; count: number }[]): Promise<number[]> {
    const updatedIds: number[] = [];

    await Promise.all(
      idWithCounts.map(async (i) => {
        const updateResult = await this.cartRequiredOptionRepository.increment({ id: i.id }, 'count', i.count);
        if (updateResult.affected !== 0) {
          updatedIds.push(i.id);
        }
      }),
    );
    return updatedIds;
  }
}
