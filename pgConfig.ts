import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://neondb_owner:npg_eKoAqP4OUu0m@ep-sweet-credit-a526j9rm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  type: 'postgres',
  port: 5432,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
