import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { BuyerEntity } from '../buyer.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateBuyerDto extends AuthCredentialsDto implements Partial<BuyerEntity> {
  @ApiProperty({ description: '이름' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ description: '성별' })
  @IsNotEmptyNumber()
  gender!: number;

  @ApiProperty({ description: '나이' })
  @IsNotEmptyNumber()
  age!: number;

  @ApiProperty({ description: '휴대전화번호 ( - 는 포함하지 않습니다 )' })
  @IsNotEmptyString(11, 11)
  phone!: string;
}
