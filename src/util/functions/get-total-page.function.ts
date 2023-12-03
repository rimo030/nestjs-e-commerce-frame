/**
 * 페이지네이션에서 요소의 개수와 전체페이지 계산을 위한 함수
 * 한번에 읽어올 개수인 limit를 받는다.
 */
export const getTotalPage = (totalCount = 0, limit = 0): { totalResult: number; totalPage: number } => {
  const totalResult = totalCount;
  const totalPage = totalResult % limit === 0 ? totalResult / limit : Math.floor(totalResult / limit) + 1;
  return { totalResult, totalPage };
};
