import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import {
  GraphQLTodoException,
  GraphQLTodoStatusException,
} from 'src/exception/GraphqlException';
import { TodoStatusType } from 'src/types/graphql';
import { Repository, Between, Like } from 'typeorm';
import { UpdateTodoDto } from './dto/RequestUpdateTodoDto';
import { ResponseTodoDto } from './dto/ResponseTodoDto';
import { TodoEntity } from './entity/Todo.entity';
import { OptionsType } from './type/OptionsType';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async registerTodo(createTodo: TodoEntity): Promise<TodoEntity> {
    return await this.todoRepository.save(createTodo);
  }

  async getTodos(
    responseTodoDto: ResponseTodoDto,
    is_query_empty: boolean,
  ): Promise<TodoEntity[]> {
    if (is_query_empty) {
      const todos = await this.todoRepository.find({
        order: {
          priority: 'ASC',
        },
      });
      return todos;
    }

    const page: number = responseTodoDto.page || 1;

    const take: number = responseTodoDto.take || 10;
    const options: OptionsType = TodoService.createWhere(responseTodoDto);

    const sort: string = responseTodoDto.sort;

    const result: TodoEntity[] = await this.todoRepository.find({
      where: options,
      take,
      skip: (page - 1) * take,
      order: {
        priority: sort === 'ASC' ? 'ASC' : 'DESC',
      },
    });

    return result;
  }

  async getTodoOne(id: number): Promise<TodoEntity> {
    const find_todo: TodoEntity | null = await this.todoRepository.findOne({
      where: { id },
    });

    if (find_todo === null) {
      throw new GraphQLTodoException(
        '유효하지 않는 ID입니다!',
        'Invalid Todo Id',
      );
    }
    return find_todo;
  }

  async modifyTodo(id: number, updateTodo: UpdateTodoDto): Promise<TodoEntity> {
    const find_todo: TodoEntity = await this.getTodoOne(id);
    if (find_todo.status === 'DONE') {
      throw new GraphQLTodoStatusException(
        'DONE 상태의 Todo를 수정/삭제할 수 없습니다.',
        'BadRequest',
      );
    }
    const todo: TodoEntity = TodoEntity.updateTodo(find_todo, updateTodo);
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: number): Promise<void> {
    const find_todo: TodoEntity = await this.getTodoOne(id);
    if (find_todo.status === 'DONE') {
      throw new GraphQLTodoStatusException(
        ' DONE 상태의 Todo를 수정/삭제할 수 없습니다.',
        'BadRequest',
      );
    }
    await this.todoRepository.delete(id);
  }
  static createWhere(responseTodoDto: ResponseTodoDto): OptionsType {
    const status: TodoStatusType = responseTodoDto.status;
    const title: string = responseTodoDto.title;
    const priority: number = responseTodoDto.priority;
    const request_deadline: string = responseTodoDto.deadline;
    const request_date_completed: string = responseTodoDto.date_completed;

    let options: OptionsType = {};
    if (status !== undefined) {
      options = {
        ...options,

        status,
      };
    }

    if (title) {
      options = {
        ...options,

        title: Like(`%${title}%`),
      };
    }

    if (priority !== undefined) {
      options = {
        ...options,

        priority,
      };
    }
    if (request_deadline !== undefined) {
      const start_date_moment = moment(request_deadline, 'YYYY-MM-DD', true);
      const start_date = start_date_moment.toDate();
      const end_date = start_date_moment.add(1, 'day').toDate();

      options = {
        ...options,

        deadline: Between(start_date, end_date),
      };
    }

    if (request_date_completed !== undefined) {
      const start_date_moment = moment(
        request_date_completed,
        'YYYY-MM-DD',
        true,
      );
      const start_date = start_date_moment.toDate();
      const end_date = start_date_moment.add(1, 'day').toDate();
      options = {
        ...options,

        date_completed: Between(start_date, end_date),
      };
    }
    return options;
  }
}
