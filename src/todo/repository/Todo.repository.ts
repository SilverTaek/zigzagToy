import { throws } from "assert";
import { TodoStatus } from "src/common/Todo.enum";
import { Todo } from "src/todo/entity/Todo.entity";
import { CustomRepository } from "src/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { RequestTodoDto } from "../dto/RequestTodoDto";

@CustomRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(todoDto: RequestTodoDto): Promise<Todo> {
    const todo_dto: RequestTodoDto = RequestTodoDto.from(todoDto);
    const todo = this.create(todo_dto.toTodoEntity());
    const result = await this.save(todo);
    return result;
  }

  async updateTodo(find_todo: Todo, todoDto: RequestTodoDto): Promise<Todo> {
    const new_todo_dto: RequestTodoDto = RequestTodoDto.updateEntity(todoDto);
    const update_todo: Todo = Todo.update(find_todo, new_todo_dto);
    return this.save(update_todo);
  }
}
