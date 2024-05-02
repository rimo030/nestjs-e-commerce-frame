import { Company } from '@prisma/client';

export interface GetCompanyDto extends Pick<Company, 'id' | 'name'> {}
