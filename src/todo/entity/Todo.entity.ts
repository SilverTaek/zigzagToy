import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TodoStatus } from "../../enum/Todo.enum";
import { UpdateTodoDto } from "../dto/RequestUpdateTodoDto";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, default: "TODO" })
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
  /**
   * Returns Todo
   *
   * @param title
   * @param status
   * @param priority
   * @param deadline
   * @returns The returns means insert from  RequestTodoDto to Todo
   */
  static createTodo(
    title: string,
    status: TodoStatus,
    priority: number,
    deadline: string
  ): Todo {
    const todo = new Todo();
    todo.title = title;
    todo.status = status;
    todo.priority = priority;
    todo.deadline = new Date(deadline);

    return todo;
  }
  /**
   * Returns Todo
   *
   * @param todo
   * @param todoDto
   * @returns The returns means insert from  UpdateTodoDto to Todo
   */
  static updateTodo(todo: Todo, todoDto: UpdateTodoDto): Todo {
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
