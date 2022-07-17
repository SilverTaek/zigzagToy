import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { TodoStatus } from "src/enum/Todo.enum";
import { Todo } from "../entity/Todo.entity";

export class RequestTodoDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  readonly priority: number;

  @IsEnum(TodoStatus)
  @IsOptional()
  readonly status: TodoStatus;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: "$property must be formatted as yyyy-mm-dd",
  })
  readonly deadline: string;

  toTodoEntity(): Todo {
    return Todo.createTodo(
      this.title,
      this.status,
      this.priority,
      this.deadline
    );
  }
}
