import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'board_app',
  entities: [__dirname + '/../**/*.entitiy.{js, ts}'],
  synchronize: true,
};
