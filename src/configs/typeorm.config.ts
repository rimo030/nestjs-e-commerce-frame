import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'commerce',
  entities: [path.join(__dirname, '/../entities/*.entity.{js, ts}')],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
