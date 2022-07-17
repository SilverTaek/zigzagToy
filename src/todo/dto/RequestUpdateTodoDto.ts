import { RequestTodoDto } from "./RequestTodoDto";
import { PartialType } from "@nestjs/mapped-types";
export class UpdateTodoDto extends PartialType(RequestTodoDto) {}
