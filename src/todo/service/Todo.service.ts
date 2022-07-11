import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestTodoDto } from "../dto/RequestTodoDto";
import { Todo } from "../entity/Todo.entity";
import { TodoRepository } from "../repository/Todo.repository";
import { Between, Like } from "typeorm";
import * as moment from "moment";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository)
    private todoRepository: TodoRepository
  ) {}

  registerTodo(todo: RequestTodoDto): Promise<Todo> {
    return this.todoRepository.createTodo(todo);
  }

  async getTodos(query): Promise<Todo[]> {
    const is_query_empty = Object.keys(query).length === 0;
    if (is_query_empty) {
      const todos = this.todoRepository.find({
        order: {
          priority: "ASC",
        },
      });
      return todos;
    }

    const page: number = parseInt(query.page) || 1;

    const take: number = parseInt(query.take) || 10;
    const options = TodoService.createWhere(query);

    type sort_type = 1 | "ASC" | "DESC" | -1;

    let sort: sort_type = query.sort;

    const result = await this.todoRepository.find({
      where: options,
      take,
      skip: (page - 1) * take,
      order: {
        priority: sort === "ASC" ? "ASC" : "DESC",
      },
    });

    return result;
  }

  async getTodoOne(id: number): Promise<Todo> {
    const find_todo = await this.todoRepository.findOne({
      where: { id },
    });
    if (!find_todo) {
      throw new NotFoundException("해당하는 Todo를 찾을 수 없습니다!");
    }
    return find_todo;
  }

  async modifyTodo(id: number, todoDto: RequestTodoDto): Promise<Todo> {
    const find_todo = await this.getTodoOne(id);
    if (find_todo.status === "DONE") {
      throw new BadRequestException("완료 된 TODO는 수정 할 수 없습니다!");
    }
    return this.todoRepository.updateTodo(find_todo, todoDto);
  }

  async removeTodo(id: number): Promise<void> {
    const find_todo = await this.getTodoOne(id);
    if (find_todo.status === "DONE") {
      throw new BadRequestException("완료 된 TODO는 삭제 할 수 없습니다!");
    }
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("해당하는 Todo를 찾을 수 없습니다.");
    }
  }
  // 조회를 위한 Where 절 생성 함수
  static createWhere(query) {
    const status = query.status as string;
    const title = query.title as string;
    const priority = query.priority as any;
    const request_deadline = query.deadline as string;
    const request_date_completed = query.date_completed as string;

    let options = {};
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
      const start_date_moment = moment(request_deadline, "YYYY-MM-DD", true);
      const start_date = start_date_moment.toDate();
      const end_date = start_date_moment.add(1, "day").toDate();

      options = {
        ...options,

        deadline: Between(start_date, end_date),
      };
    }

    if (request_date_completed !== undefined) {
      const start_date_moment = moment(
        request_date_completed,
        "YYYY-MM-DD",
        true
      );
      const start_date = start_date_moment.toDate();
      const end_date = start_date_moment.add(1, "day").toDate();
      options = {
        ...options,

        date_completed: Between(start_date, end_date),
      };
    }
    return options;
  }
}
