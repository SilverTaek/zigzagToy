import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Matches } from 'class-validator';
import { TodoStatus } from 'src/enum/Todo.enum';

@InputType()
export class ResponseTodoDto {
  @Field()
  @IsString()
  @IsOptional()
  readonly title: string;
  @Field()
  @IsOptional()
  status: TodoStatus;
  @Field()
  @IsOptional()
  priority: number;
  @Field()
  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  deadline: string;
  @Field()
  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  date_completed: string;
  @Field()
  @IsOptional()
  page: number;
  @Field()
  @IsOptional()
  take: number;
  @Field()
  @IsOptional()
  sort: string;
}
