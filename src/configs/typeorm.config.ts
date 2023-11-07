import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'board_app',
  entities: [__dirname + '/../**/*.entitiy.{js, ts}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
