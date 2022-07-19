import { InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';

import { RequestTodoDto } from './RequestTodoDto';
@InputType()
export class UpdateTodoDto extends PartialType(RequestTodoDto) {}
