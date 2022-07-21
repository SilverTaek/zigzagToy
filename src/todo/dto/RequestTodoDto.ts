import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TodoStatusType } from 'src/types/graphql';
import { TodoEntity } from '../entity/Todo.entity';

export class RequestTodoDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  readonly priority: number;

  @IsEnum(TodoStatusType)
  @IsOptional()
  readonly status: TodoStatusType;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  readonly deadline: string;

  toTodoEntity(): TodoEntity {
    return TodoEntity.createTodo(
      this.title,
      this.status,
      this.priority,
      this.deadline,
    );
  }
}
