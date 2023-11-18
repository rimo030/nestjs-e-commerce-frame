import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../types/enums/board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }
    return value;
  }
  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1; // 유효한 값만 리턴
  }
}
