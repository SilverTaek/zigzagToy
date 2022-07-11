import { Module } from "@nestjs/common";
import { TypeOrmExModule } from "src/typeorm-ex.module";
import { TodoController } from "./controller/Todo.controller";
import { TodoRepository } from "./repository/Todo.repository";
import { TodoService } from "./service/Todo.service";

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TodoRepository])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
