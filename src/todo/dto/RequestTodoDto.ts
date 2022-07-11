import { IsNotEmpty, IsNumber } from "class-validator";
import { TodoStatus } from "src/common/Todo.enum";
import { Todo } from "../entity/Todo.entity";

export class RequestTodoDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @IsNumber()
  priority: number;
  status: TodoStatus;
  deadline: string;

  toTodoEntity() {
    return Todo.from(this.title, this.status, this.priority, this.deadline);
  }

  static from(todo: RequestTodoDto) {
    const todoDto = new RequestTodoDto();
    todoDto.title = todo.title;
    todoDto.status = todo.status;
    todoDto.priority = todo.priority;
    todoDto.deadline = todo.deadline;

    return todoDto;
  }

  static updateEntity(todoDto: RequestTodoDto) {
    const new_todo_dto = new RequestTodoDto();
    new_todo_dto.title = todoDto.title;
    new_todo_dto.status = todoDto.status;
    new_todo_dto.priority = todoDto.priority;
    new_todo_dto.deadline = todoDto.deadline;
    return new_todo_dto;
  }
}
