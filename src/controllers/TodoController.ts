import { Request, Response } from 'express';
import { Between, getRepository, Like } from 'typeorm';
import { Todo } from '../entity/Todo';
import { RequestTodoDto } from '../dto/RequestTodoDto';
import { STATUS_CODES } from 'http';
import { start } from 'repl';

class TodoController {
  // 할 일 생성 API
  static registerTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    type status_type = 'TODO' | 'IN_PROGRESS' | 'DONE';
    const todo_status: status_type = req.body.status.toUpperCase();
    if (todo_status !== 'TODO' && todo_status && 'IN_PROGRESS' && todo_status !== 'DONE') {
      return res.status(401).json('상태 목록은 TODO / IN_PROGRESS / DONE 중 에서 정해주세요!');
    }

    const new_todo: RequestTodoDto = RequestTodoDto.from(req);

    const todo: Todo = getRepository(Todo).create(new_todo.toTodoEntity());
    const result: Todo = await getRepository(Todo).save(todo);

    return res.status(200).json(result);
  };

  // 할 일 목록 조회 API
  static getTodos = async (req: Request, res: Response): Promise<Response<JSON>> => {
    const is_query_empty = Object.keys(req.query).length === 0;
    if (is_query_empty) {
      const todos = await getRepository(Todo).find();
      return res.status(200).json(todos);
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const TAKE = 10;

    const status: string = req.query.status as string;
    const title: string = req.query.title as string;
    const priority: string = req.query.priority as string;
    const request_deadline = req.query.deadline as string;
    let request_date_completed = req.query.date_completed as string;

    console.log(status);
    console.log(title);
    console.log(priority);
    console.log(request_deadline);
    console.log(request_date_completed);

    let options = {};
    if (status !== undefined) {
      options = {
        ...options,

        status,
      };
    }
    console.log(options);
    if (title) {
      options = {
        ...options,

        title: Like(`%${title}%`),
      };
    }
    console.log(options);
    if (priority !== undefined) {
      options = {
        ...options,

        priority,
      };
    }
    console.log(options);
    if (request_deadline !== undefined) {
      let start_date: Date = new Date(request_deadline);
      let end_date = new Date(start_date.getDate() + 1);

      options = {
        ...options,

        deadline: Between(start_date, end_date),
      };
    }
    console.log(options);

    if (request_date_completed !== undefined) {
      const start_date = new Date(request_date_completed);
      let end_date = new Date();
      end_date = new Date(start_date.setDate(start_date.getDate() + 1));
      options = {
        ...options,

        date_completed: Between(new Date(request_date_completed), end_date),
      };
    }

    type sort = 1 | 'ASC' | 'DESC' | -1;

    let ssort = req.query.sort as sort;

    // * sort 에 ASC or DESC 가 들어오면 에러 처리

    if (ssort === undefined) {
      ssort = 'ASC';
    }
    console.log(options);

    const result = await getRepository(Todo).find({
      where: options,
      take: TAKE,
      skip: (page - 1) * TAKE,
      order: {
        priority: ssort === 'ASC' ? 'ASC' : 'DESC',
      },
    });

    return res.status(200).json(result);
  };

  // 할 일 상세 조회 API
  static getOneTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const id = req.params.id;
      const todo = await getRepository(Todo).findOne(id);

      return res.status(200).json(todo);
    } catch (error) {
      throw new Error('잘못된 접근입니다. 다시 시도해주세요!');
    }
  };

  // 할 일 수정 API
  static updateTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    const todo: Todo = await getRepository(Todo).findOne(req.params.id);
    if (todo.status === 'DONE') {
      res.status(500).json('완료 된 TODO는 수정할 수 없습니당!');
    } else if (todo && todo.status !== 'DONE') {
      getRepository(Todo).merge(todo, req.body);
      const currentDate: Date = new Date();
      todo.date_updated = currentDate;

      if (todo.status === 'DONE') {
        todo.date_completed = currentDate;
      }
      const result: Todo = await getRepository(Todo).save(todo);
      return res.status(200).json(result);
    } else {
      return res.status(200).json({ msg: 'Todo Not Found' });
    }
  };

  // 할 일 삭제 API
  static deleteTodo = async (req: Request, res: Response) => {
    const todo = await getRepository(Todo).findOne(req.params.id);
    if (!todo) {
      res.status(500).json('TODO를 찾을 수 없습니다.');
    } else if (todo.status === 'DONE') {
      res.status(500).json('완료된 TODO는 삭제할 수 없습니다.');
    } else if (todo && todo.status != 'DONE') {
      const todoDelete = await getRepository(Todo).delete(req.params.id);
      return res.status(200).json(todoDelete);
    }
  };

  // 조회를 위한 Where 절 생성 함수
  static createWhere(req: Request) {
    const status: string = req.query.status as string;
    const title: string = `(%${req.query.title}%)` as string;
    const priority: string = req.query.priority as string;
    const request_deadline = req.query.deadline as string;
    const request_date_completed = req.query.date_completed as string;

    let where = {};

    if (title !== undefined) {
      where = { ...where, title };
    }
    if (status !== undefined) {
      where = { ...where, status };
    }
    if (priority !== undefined) {
      where = { ...where, priority };
    }
    if (request_deadline !== undefined) {
      let deadline = new Date();
      deadline = new Date(request_deadline);
      where = { ...where, deadline };
    }
    if (request_date_completed !== undefined) {
      let date_completed = new Date();
      date_completed = new Date(request_date_completed);
      where = { ...where, date_completed };
    }
    return where;
  }
}

export default TodoController;
