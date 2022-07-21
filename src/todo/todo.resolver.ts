import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { GqlAuthGuard } from 'src/auth/gql.guard';
import { Todo, TodoList } from 'src/types/graphql';
import { RequestTodoDto } from './dto/RequestTodoDto';
import { UpdateTodoDto } from './dto/RequestUpdateTodoDto';
import { ResponseTodoDto } from './dto/ResponseTodoDto';
import { TodoEntity } from './entity/Todo.entity';
import { TodoService } from './todo.service';

@Resolver(() => TodoEntity)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  @Mutation()
  createToken() {
    return this.authService.jwtCreate();
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoEntity, { name: 'createTodo' })
  async createTodo(
    @Args('createTodoInput') requestTodoDto: RequestTodoDto,
  ): Promise<Todo> {
    const todo: TodoEntity = await this.todoService.registerTodo(
      requestTodoDto.toTodoEntity(),
    );

    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Query()
  async todo_list(
    @Args('responseTodo') responseTodoDto: ResponseTodoDto,
  ): Promise<TodoList> {
    const is_query_empty: boolean = Object.keys(responseTodoDto).length === 0;

    const todos: TodoEntity[] = await this.todoService.getTodos(
      responseTodoDto,
      is_query_empty,
    );
    const todo_list: TodoList = {
      total_count: todos.length,
      item_list: todos,
    };

    return todo_list;
  }
  @UseGuards(GqlAuthGuard)
  @Query()
  async todo(@Args() id: number): Promise<TodoEntity> {
    const todo: TodoEntity = await this.todoService.getTodoOne(id);
    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async updateTodo(
    @Args() id: number,
    @Args() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo: Todo = await this.todoService.modifyTodo(id, updateTodoDto);
    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async removeTodo(@Args() id: number): Promise<boolean> {
    await this.todoService.removeTodo(id);
    return true;
  }
}
