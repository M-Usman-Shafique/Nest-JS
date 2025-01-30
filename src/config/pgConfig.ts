import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default (): PostgresConnectionOptions => ({
  type: 'postgres',
  url: process.env.DB_URL,
  port: Number(process.env.DB_PORT) || 5432,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});
