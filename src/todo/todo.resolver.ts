import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { GqlAuthGuard } from 'src/auth/gql.guard';
import { RequestTodoDto } from './dto/RequestTodoDto';
import { UpdateTodoDto } from './dto/RequestUpdateTodoDto';
import { ResponseTodoDto } from './dto/ResponseTodoDto';
import { Todo } from './entity/Todo.entity';
import { TodoService } from './todo.service';
import { TodoListType } from './type/TodoListType';

@Resolver(() => Todo)
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
  @Mutation(() => Todo, { name: 'createTodo' })
  async createTodo(
    @Args('createTodoInput') requestTodoDto: RequestTodoDto,
  ): Promise<Todo> {
    const todo: Todo = await this.todoService.registerTodo(
      requestTodoDto.toTodoEntity(),
    );

    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Todo], { name: 'todo_list' })
  async selectTodos(
    @Args('responseTodo') responseTodoDto: ResponseTodoDto,
  ): Promise<TodoListType> {
    const is_query_empty: boolean = Object.keys(responseTodoDto).length === 0;

    const todos: Todo[] = await this.todoService.getTodos(
      responseTodoDto,
      is_query_empty,
    );
    const todo_list: TodoListType = {
      total_count: todos.length,
      item_list: todos,
    };

    return todo_list;
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => Todo, { name: 'todo' })
  async selectTodoOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Todo> {
    const todo: Todo = await this.todoService.getTodoOne(id);
    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Todo, { name: 'updateTodo' })
  async updateTodo(
    @Args('id') id: number,
    @Args('updateTodoInput') updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    console.log(updateTodoDto);
    const todo: Todo = await this.todoService.modifyTodo(id, updateTodoDto);
    return todo;
  }
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async removeTodo(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.todoService.removeTodo(id);
    return true;
  }
}
