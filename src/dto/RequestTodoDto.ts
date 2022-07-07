import { Request } from 'express';
import { Todo } from '../entity/Todo';

export class RequestTodoDto {
  private title: string;
  private status: string;
  private priority: number;
  private deadline: string;
  private date_created: Date;
  private date_updated: Date;
  private date_completed: Date;

  toTodoEntity() {
    return Todo.from(
      this.title,
      this.status,
      this.priority,
      this.deadline,
      this.date_created,
      this.date_updated,
      this.date_completed,
    );
  }

  static from(req: Request) {
    const todoDto = new RequestTodoDto();
    todoDto.title = req.body.title;
    todoDto.status = req.body.status;
    todoDto.priority = req.body.priority;
    todoDto.deadline = req.body.deadline;
    todoDto.date_created = new Date();
    todoDto.date_updated = new Date();
    return todoDto;
  }
}
