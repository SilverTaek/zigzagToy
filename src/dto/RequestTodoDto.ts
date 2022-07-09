import { Request } from 'express';
import { Todo } from '../entity/Todo';

export class RequestTodoDto {
  private title: string;
  private status: string;
  private priority: number;
  private deadline: string;
  private date_completed: Date;

  toTodoEntity() {
    return Todo.from(this.title, this.status, this.priority, this.deadline, this.date_completed);
  }

  static from(req: Request) {
    const todoDto = new RequestTodoDto();
    todoDto.title = req.body.title;
    todoDto.status = req.body.status;
    todoDto.priority = req.body.priority;
    todoDto.deadline = req.body.deadline;

    return todoDto;
  }
}
