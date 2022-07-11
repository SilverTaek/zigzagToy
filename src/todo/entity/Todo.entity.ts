import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TodoStatus } from "../../common/Todo.enum";
import { RequestTodoDto } from "../dto/RequestTodoDto";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  status: TodoStatus;

  @Column({ nullable: false })
  priority: number;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn({
    nullable: false,
    type: "timestamp",
  })
  date_created: Date;

  @UpdateDateColumn({
    nullable: false,
    type: "timestamp",
  })
  date_updated: Date;

  @Column({
    nullable: true,
  })
  date_completed: Date;

  static from(
    title: string,
    status: TodoStatus,
    priority: number,
    deadline: string
  ) {
    const todo = new Todo();
    todo.title = title;
    todo.status = status;
    todo.priority = priority;
    todo.deadline = new Date(deadline);

    return todo;
  }

  static update(todo: Todo, todoDto: RequestTodoDto): Todo {
    todo.priority = todoDto.priority;
    todo.title = todoDto.title;
    todo.status = todoDto.status;
    todo.deadline = new Date(todoDto.deadline);
    if (todoDto.status === "DONE") {
      todo.date_completed = new Date();
    }

    return todo;
  }
}
