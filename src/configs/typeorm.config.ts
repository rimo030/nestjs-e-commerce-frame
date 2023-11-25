import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const NODE_ENV = configService.get('NODE_ENV');
  const dbPort = process.env[`${NODE_ENV}_DB_PORT`];
  const PORT = dbPort ? Number(dbPort) : 3306;

  return {
    type: 'mysql',
    host: configService.get(`${NODE_ENV}_DB_HOST`) ?? 'localhost',
    port: PORT,
    username: configService.get(`${NODE_ENV}_DB_USERNAME`) ?? 'root',
    password: configService.get(`${NODE_ENV}_DB_PASSWORD`) ?? 'password',
    database: configService.get(`${NODE_ENV}_DB_DATABASE`) ?? 'commerce',
    entities: [path.join(__dirname, '/../entities/*.entity.{js, ts}')],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
};
