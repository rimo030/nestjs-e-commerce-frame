/**
 * 페이지네이션에서 전체페이지 계산을 위한 함수
 *
 * totalCount : 전체 요소의 수
 * limit : 한번에 읽어올 요소의 수
 *
 */
export const getTotalPage = (totalCount = 0, limit = 0): number => {
  const totalPage = totalCount % limit === 0 ? totalCount / limit : Math.floor(totalCount / limit) + 1;
  return totalPage;
};
