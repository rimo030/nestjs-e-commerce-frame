import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const NODE_ENV = configService.get('NODE_ENV'); // LOCAL

  return {
    type: 'mysql',
    host: configService.get(`${NODE_ENV}_DB_HOST`) ?? 'localhost',
    port: Number(configService.get(`${NODE_ENV}_DB_PORT`)) ?? 3306,
    username: configService.get(`${NODE_ENV}_DB_USERNAME`) ?? 'root',
    password: configService.get(`${NODE_ENV}_DB_PASSWORD`) ?? 'password',
    database: configService.get(`${NODE_ENV}_DB_DATABASE`) ?? 'commerce',
    entities: [path.join(__dirname, '/../entities/*.entity.{js, ts}')],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
};
