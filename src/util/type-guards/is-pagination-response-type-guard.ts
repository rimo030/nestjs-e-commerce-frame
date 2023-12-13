import { GetResponse } from 'src/interfaces/get-response.interface';

export function isPaginationResponseTypeGuard(data: any): data is GetResponse<any> {
  if (typeof data === 'object' && data !== null) {
    if (data.list instanceof Array && typeof data.count === 'number' && typeof data.take === 'number') {
      return true;
    }
  }
  return false;
}
