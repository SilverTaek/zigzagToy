import { Field, ObjectType } from '@nestjs/graphql';

import { TodoStatus } from 'src/enum/Todo.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UpdateTodoDto } from '../dto/RequestUpdateTodoDto';
@ObjectType()
@Entity()
export class Todo {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column({ nullable: false })
  title: string;
  @Field()
  @Column({ nullable: false, default: 'TODO' })
  status: TodoStatus;
  @Field()
  @Column({ nullable: false })
  priority: number;
  @Field()
  @Column({ nullable: true })
  deadline: Date;
  @Field()
  @CreateDateColumn({
    nullable: false,
    type: 'timestamp',
  })
  date_created: Date;
  @Field()
  @UpdateDateColumn({
    nullable: false,
    type: 'timestamp',
  })
  date_updated: Date;
  @Field()
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
    deadline: string,
  ): Todo {
    const todo = new Todo();
    todo.title = title;
    todo.status = status;
    todo.priority = priority;
    todo.deadline = deadline && new Date(deadline);

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
    if (todoDto.status === 'DONE') {
      todo.date_completed = new Date();
    }

    return todo;
  }
}
