import { Company } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';

export class CreateCompanyDto implements Pick<Company, 'name'> {
  @ApiProperty({ type: String, description: '이름', required: true, example: 'mycompany' })
  @IsNotEmptyString(1, 128)
  name!: string;
}
