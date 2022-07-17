import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "../entity/Todo.entity";
import { Between, Like, Repository } from "typeorm";
import * as moment from "moment";
import { ResponseTodoDto } from "../dto/ResponseTodoDto";
import { OptionsType } from "../type/OptionsType";
import { UpdateTodoDto } from "../dto/RequestUpdateTodoDto";
import { TodoStatus } from "src/enum/Todo.enum";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}
  /**
   * Returns create Success created Todo Entity
   *
   * @param createTodo - Request Body by Todo
   * @returns The returns mean of created Todo Entity
   *
   */
  async registerTodo(createTodo: Todo): Promise<Todo> {
    return await this.todoRepository.save(createTodo);
  }
  /**
   * Returns create Success message and created Todo Entity
   *
   * @param responseTodoDto - Request Query string After ResponseTodoDto
   * @param is_query_empty - The parameter mean of query length
   * @returns The returns mean of selectAll Todo Entity or Todo result search according to query
   *
   */
  async getTodos(
    responseTodoDto: ResponseTodoDto,
    is_query_empty: boolean
  ): Promise<Todo[]> {
    if (is_query_empty) {
      const todos = this.todoRepository.find({
        order: {
          priority: "ASC",
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
        priority: sort === "ASC" ? "ASC" : "DESC",
      },
    });

    return result;
  }
  /**
   * Returns create Success message and created Todo Entity
   *
   * @param id - Request Todo Id params
   * @returns The returns mean of selectOne Todo Entity
   *
   */
  async getTodoOne(id: number): Promise<Todo> {
    const find_todo: Todo | null = await this.todoRepository.findOne({
      where: { id },
    });

    if (find_todo === null) {
      throw new NotFoundException("해당하는 Todo를 찾을 수 없습니다!");
    }
    return find_todo;
  }
  /**
   * Returns create Success message and created Todo Entity
   *
   * @param id - Request Todo Id params
   * @param todoDto - Request Body by UpdateTodoDto
   * @returns The returns mean of updated Todo Entity
   *
   */
  async modifyTodo(id: number, todoDto: UpdateTodoDto): Promise<Todo> {
    const find_todo: Todo = await this.getTodoOne(id);
    if (find_todo.status === "DONE") {
      throw new BadRequestException("DONE 상태의 Todo는 수정할 수 없습니다.");
    }
    const todo: Todo = Todo.updateTodo(find_todo, todoDto);
    return this.todoRepository.save(todo);
  }
  /**
   * Returns create Success message and created Todo Entity
   *
   * @param id - Request Todo Id params
   * @returns void
   *
   */
  async removeTodo(id: number): Promise<void> {
    const find_todo: Todo = await this.getTodoOne(id);
    if (find_todo.status === "DONE") {
      throw new BadRequestException(" DONE 상태의 Todo를 삭제할 수 없습니다.");
    }
    await this.todoRepository.delete(id);
  }
  /**
   * Returns create Success message and created Todo Entity
   *
   * @param responseTodoDto - Request query string After ResponseTodoDto
   * @returns The returns mean of options to use typeORM 'where' conditions
   *
   */
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
