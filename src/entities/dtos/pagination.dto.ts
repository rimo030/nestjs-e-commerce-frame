import { IsInt, IsNotEmpty } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsNotEmpty()
  page!: number;

  @IsInt()
  @IsNotEmpty()
  limit!: number;
}
