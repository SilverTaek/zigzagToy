import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoModule } from "./todo/todo.module";
import { typeORMConfig } from "./config/environment";

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), TodoModule],
})
export class AppModule {}
