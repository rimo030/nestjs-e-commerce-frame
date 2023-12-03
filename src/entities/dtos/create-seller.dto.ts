import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { SellerEntity } from '../seller.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class CreateSellerDto extends AuthCredentialsDto implements Partial<SellerEntity> {
  @ApiProperty({ description: '이름' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ description: '대표번호 ( - 는 포함하지 않습니다 )' })
  @IsNotEmptyString(11, 11)
  phone!: string;

  @ApiProperty({ description: '사업자등록번호' })
  @IsNotEmptyString(1, 128)
  businessNumber!: string;
}
