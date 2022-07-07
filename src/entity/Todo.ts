import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column()
  priority: number;

  @Column({ nullable: true })
  deadline: Date;

  @Column()
  date_created: Date;

  @Column()
  date_updated: Date;

  @Column({ nullable: true })
  date_completed: Date;

  static from(
    title: string,
    status: string,
    priority: number,
    deadline: string,
    date_created: Date,
    date_updated: Date,
  ) {
    const todo = new Todo();
    todo.title = title;
    todo.status = status;
    todo.priority = priority;
    todo.deadline = new Date(deadline);
    todo.date_created = date_created;
    todo.date_updated = date_updated;
    return todo;
  }
}
