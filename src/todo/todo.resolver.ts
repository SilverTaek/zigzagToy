import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RequestTodoDto } from './dto/RequestTodoDto';
import { UpdateTodoDto } from './dto/RequestUpdateTodoDto';
import { ResponseTodoDto } from './dto/ResponseTodoDto';
import { Todo } from './entity/Todo.entity';
import { ResponseEntity } from './res/ResponseEntity';
import { TodoService } from './todo.service';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo, { name: 'createTodo' })
  async createTodo(
    @Args('createTodoInput') requestTodoDto: RequestTodoDto,
  ): Promise<Todo> {
    console.log(requestTodoDto.toTodoEntity());
    const todo: Todo = await this.todoService.registerTodo(
      requestTodoDto.toTodoEntity(),
    );

    return todo;
  }

  @Query(() => [Todo], { name: 'findAllTodo' })
  async selectTodos(
    @Args('responseTodo') responseTodoDto: ResponseTodoDto,
  ): Promise<ResponseEntity<ResponseType>> {
    const is_query_empty: boolean = Object.keys(responseTodoDto).length === 0;

    const todos: Todo[] = await this.todoService.getTodos(
      responseTodoDto,
      is_query_empty,
    );
    return ResponseEntity.OK_WITH({
      item_list: todos,
      total_count: todos.length,
    });
  }

  @Query(() => Todo, { name: 'findOneTodo' })
  async selectTodoOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ResponseEntity<string>> {
    const todo: Todo = await this.todoService.getTodoOne(id);
    return ResponseEntity.OK('Todo 호출에 성공했습니다.', todo);
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('updateTodoInput') updateTodoDto: UpdateTodoDto,
  ): Promise<ResponseEntity<string>> {
    const todo: Todo = await this.todoService.modifyTodo(
      updateTodoDto.id,
      updateTodoDto,
    );
    return ResponseEntity.OK('Todo 수정에 성공했습니다.', todo);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this.todoService.removeTodo(id);
  }
}
