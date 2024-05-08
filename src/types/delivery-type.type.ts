/**
 * 배송비 종류
 *  - FREE : 무료
 *  - NOT_FREE : 유료
 *  - COUNT_FREE : 몇 개 이상 무료 (deliveryFreeOver에 기준 수량 입력)
 *  - PRICE_FREE : 가격 이상 무료 (deliveryFreeOver에 기준 가격 입력)
 */

export type DeliveryType = 'FREE' | 'NOT_FREE' | 'COUNT_FREE' | 'PRICE_FREE';
