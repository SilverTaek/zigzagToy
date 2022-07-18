import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Between, Like } from 'typeorm';
import { Todo } from './entity/Todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseTodoDto } from './dto/ResponseTodoDto';
import { TodoStatus } from 'src/enum/Todo.enum';
import { OptionsType } from './type/OptionsType';
import moment from 'moment';
import { UpdateTodoDto } from './dto/RequestUpdateTodoDto';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async registerTodo(createTodo: Todo): Promise<Todo> {
    return await this.todoRepository.save(createTodo);
  }

  async getTodos(
    responseTodoDto: ResponseTodoDto,
    is_query_empty: boolean,
  ): Promise<Todo[]> {
    if (is_query_empty) {
      const todos = this.todoRepository.find({
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

    const result: Todo[] = await this.todoRepository.find({
      where: options,
      take,
      skip: (page - 1) * take,
      order: {
        priority: sort === 'ASC' ? 'ASC' : 'DESC',
      },
    });

    return result;
  }

  async getTodoOne(id: number): Promise<Todo> {
    const find_todo: Todo | null = await this.todoRepository.findOne({
      where: { id },
    });

    if (find_todo === null) {
      throw new NotFoundException('해당하는 Todo를 찾을 수 없습니다!');
    }
    return find_todo;
  }

  async modifyTodo(id: number, updateTodo: UpdateTodoDto): Promise<Todo> {
    const find_todo: Todo = await this.getTodoOne(id);
    if (find_todo.status === 'DONE') {
      throw new BadRequestException('DONE 상태의 Todo는 수정할 수 없습니다.');
    }
    const todo: Todo = Todo.updateTodo(find_todo, updateTodo);
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: number): Promise<void> {
    const find_todo: Todo = await this.getTodoOne(id);
    if (find_todo.status === 'DONE') {
      throw new BadRequestException(' DONE 상태의 Todo를 삭제할 수 없습니다.');
    }
    await this.todoRepository.delete(id);
  }
  static createWhere(responseTodoDto: ResponseTodoDto): OptionsType {
    const status: TodoStatus = responseTodoDto.status;
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
