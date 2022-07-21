import { PartialType } from '@nestjs/mapped-types';

import { RequestTodoDto } from './RequestTodoDto';

export class UpdateTodoDto extends PartialType(RequestTodoDto) {}
