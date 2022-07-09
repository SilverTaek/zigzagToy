import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, default: 'TODO' })
  status: string;

  @Column({ nullable: false })
  priority: number;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  date_created: Date;

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamp',
  })
  date_updated: Date;

  @Column()
  date_completed: Date;

  static from(title: string, status: string, priority: number, deadline: string, date_completed: Date) {
    const todo = new Todo();
    todo.title = title;
    todo.status = status;
    todo.priority = priority;
    todo.deadline = new Date(deadline);
    todo.date_completed = date_completed;
    return todo;
  }

  autoUpdateDate(): void {
    this.date_updated = new Date();
  }
}
