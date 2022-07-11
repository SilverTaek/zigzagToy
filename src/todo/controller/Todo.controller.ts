import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TodoSelectValidationPipe } from "src/common/pipes/Todo.select.validation";
import { TodoValidationPipe } from "src/common/pipes/Todo.create.validation";
import { RequestTodoDto } from "../dto/RequestTodoDto";
import { Todo } from "../entity/Todo.entity";
import { TodoService } from "../service/Todo.service";
import { TodoIdValidationPipe } from "src/common/pipes/Todo.id.validate";

@Controller("todos")
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createTodo(@Body(TodoValidationPipe) todoDto: RequestTodoDto): Promise<Todo> {
    return this.todoService.registerTodo(todoDto);
  }

  @Get()
  selectTodos(@Query(TodoSelectValidationPipe) query): Promise<Todo[]> {
    return this.todoService.getTodos(query);
  }

  @Get("/:id")
  selectTodoOne(@Param("id", TodoIdValidationPipe) id: number): Promise<Todo> {
    return this.todoService.getTodoOne(id);
  }

  @Put("/:id")
  updateTodo(
    @Param("id", TodoIdValidationPipe) id: number,
    @Body(TodoValidationPipe) todoDto: RequestTodoDto
  ): Promise<Todo> {
    return this.todoService.modifyTodo(id, todoDto);
  }

  @Delete("/:id")
  deleteTodo(@Param("id", TodoIdValidationPipe) id: number): Promise<void> {
    return this.todoService.removeTodo(id);
  }
}
