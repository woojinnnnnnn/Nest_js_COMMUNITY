import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// "typeorm-extension" 의 기능으로
// db:create 같은 명령어로 여기서 직접 데티어 베이스 만들 수 있음.

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});

export default dataSource;
