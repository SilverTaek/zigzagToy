import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
};
