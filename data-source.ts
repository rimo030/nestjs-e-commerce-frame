// ./data-source.ts
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const dbPort = process.env[`${NODE_ENV}_DB_PORT`];
const PORT = dbPort ? Number(dbPort) : 3306;

export default new DataSource({
  type: 'mysql',
  host: (process.env[`${NODE_ENV}_DB_HOST`] as string) ?? 'localhost',
  port: PORT,
  username: (process.env[`${NODE_ENV}_DB_USERNAME`] as string) ?? 'root',
  database: (process.env[`${NODE_ENV}_DB_DATABASE`] as string) ?? 'commerce',
  password: (process.env[`${NODE_ENV}_DB_PASSWORD`] as string) ?? 'password',
  entities: [path.join(__dirname, './src/entities/*.entity.ts'), path.join(__dirname, './src/entities/*.entity.js')],
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
