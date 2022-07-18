import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TodoStatus } from 'src/enum/Todo.enum';
import { Todo } from '../entity/Todo.entity';

@InputType()
export class RequestTodoDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @Field()
  @IsNotEmpty()
  @IsNumber()
  readonly priority: number;
  @Field()
  @IsEnum(TodoStatus)
  @IsOptional()
  readonly status: TodoStatus;
  @Field()
  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  readonly deadline: string;

  toTodoEntity(): Todo {
    return Todo.createTodo(
      this.title,
      this.status,
      this.priority,
      this.deadline,
    );
  }
}
