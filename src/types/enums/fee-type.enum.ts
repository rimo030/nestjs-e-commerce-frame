// 순서대로, 무료, 무조건 유료, 몇 개 이상 무료, 개수 당 배송비 부과 방식을 의미한다.

export enum feeType {
  FREE = 'FREE',
  CHARGE = 'CHARGE',
  OVERFREE = 'OVERFREE',
  OVERQUANTITY = 'OVERQUANTITY',
  QUANTITY = 'QUANTITY',
}
