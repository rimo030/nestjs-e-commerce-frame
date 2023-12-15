import { ErrorObject } from 'src/interfaces/error-object.interface';

export function IsErrorObjectTypeGuard(obj: any): obj is ErrorObject {
  if (typeof obj === 'object' && obj !== null) {
    if (
      typeof obj.type === 'string' &&
      typeof obj.code === 'number' &&
      typeof obj.result === 'boolean' &&
      typeof obj.errorMessage === 'string'
    ) {
      return true;
    }
  }
  return false;
}
