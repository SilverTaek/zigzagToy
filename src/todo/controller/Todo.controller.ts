import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { RequestTodoDto } from "../dto/RequestTodoDto";
import { Todo } from "../entity/Todo.entity";
import { TodoService } from "../service/Todo.service";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";
import { ResponseEntity } from "../res/ResponseEntity";
import { ResponseTodoDto } from "../dto/ResponseTodoDto";
import { UpdateTodoDto } from "../dto/RequestUpdateTodoDto";
import { ResponseType } from "../type/ResponseType";

@Controller("todos")
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService
  ) {}

  /**
   * Returns created jwt tokent
   *
   * @returns The returns mean of response created jwt
   */
  @Get("/token")
  createToken() {
    return this.authService.jwtCreate();
  }

  /**
   * Returns create Success message and created Todo Entity
   *
   * @param requestTodoDto - Request Body
   * @returns The returns mean of message and created Todo Entity
   *
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTodo(
    @Body() requestTodoDto: RequestTodoDto
  ): Promise<ResponseEntity<string>> {
    const todo: Todo = await this.todoService.registerTodo(
      requestTodoDto.toTodoEntity()
    );
    return ResponseEntity.OK("Todo 생성에 성공하였습니다", todo);
  }
  /**
   * Returns select Todo[] Entity
   *
   * @param responseTodoDto - Request query string After ResponseTodoDto
   * @returns The returns mean of select Todo[]
   *
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async selectTodos(
    @Query() responseTodoDto: ResponseTodoDto
  ): Promise<ResponseEntity<ResponseType>> {
    const is_query_empty: boolean = Object.keys(responseTodoDto).length === 0;

    const todos: Todo[] = await this.todoService.getTodos(
      responseTodoDto,
      is_query_empty
    );

    return ResponseEntity.OK_WITH({
      item_list: todos,
      total_count: todos.length,
    });
  }
  /**
   * Returns select TodoOne
   *
   * @param id - Request Todo Id
   * @returns The returns mean of select TodoById
   *
   */
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async selectTodoOne(
    @Param("id") id: number
  ): Promise<ResponseEntity<string>> {
    const todo: Todo = await this.todoService.getTodoOne(id);
    return ResponseEntity.OK("Todo 호출에 성공했습니다.", todo);
  }
  /**
   * Returns updated Todo Entity
   *
   * @param id - Request Todo Id
   * @returns The returns mean of update Todo
   *
   */
  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async updateTodo(
    @Param("id") id: number,
    @Body() todoDto: UpdateTodoDto
  ): Promise<ResponseEntity<string>> {
    const todo: Todo = await this.todoService.modifyTodo(id, todoDto);
    return ResponseEntity.OK("Todo 수정에 성공했습니다.", todo);
  }
  /**
   * Returns delete void
   *
   * @param id - Request Todo Id
   * @returns void
   *
   */
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteTodo(@Param("id") id: number): Promise<void> {
    await this.todoService.removeTodo(id);
  }
}
