import { Request, Response } from 'express';
import { RequestTodoDto } from '../dto/RequestTodoDto';
import { Between, getRepository, Like } from 'typeorm';
import { Todo } from '../entity/Todo';
import { checkTodo, checkTodoStatus } from '../common/validator/TodoValidate';
import * as moment from 'moment';

export class TodoService {
  static registerTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const new_todo: RequestTodoDto = RequestTodoDto.from(req);

      const todo: Todo = getRepository(Todo).create(new_todo.toTodoEntity());
      const result: Todo = await getRepository(Todo).save(todo);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500);
    }
  };

  static getTodos = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const is_query_empty = Object.keys(req.query).length === 0;
      if (is_query_empty) {
        const todos = await getRepository(Todo).find({
          order: {
            priority: 'ASC',
          },
        });
        return res.status(200).json(todos);
      }

      const page: number = parseInt(req.query.page as string) || 1;

      const TAKE = 10;
      const options = TodoService.createWhere(req, res);

      type sort_type = 1 | 'ASC' | 'DESC' | -1;

      let sort = req.query.sort as sort_type;

      if (sort === undefined) {
        sort = 'ASC';
      }

      const result = await getRepository(Todo).find({
        where: options,
        take: TAKE,
        skip: (page - 1) * TAKE,
        order: {
          priority: sort === 'ASC' ? 'ASC' : 'DESC',
        },
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500);
    }
  };

  static getTodoOne = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const id = req.params.id;
      const todo = await getRepository(Todo).findOne(id);

      checkTodo(req, res, todo);

      return res.status(200).json(todo);
    } catch (error) {
      return res.status(500);
    }
  };

  static modifyTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const get_todo: Todo = await getRepository(Todo).findOne(req.params.id);

      checkTodo(req, res, get_todo);
      checkTodoStatus(res, get_todo);

      getRepository(Todo).merge(get_todo, req.body);
      if (get_todo.status === 'DONE') {
        get_todo.date_completed = new Date();
      }

      const result: Todo = await getRepository(Todo).save(get_todo);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500);
    }
  };

  static removeTodo = async (req: Request, res: Response) => {
    try {
      const todo = await getRepository(Todo).findOne(req.params.id);
      checkTodo(req, res, todo);
      checkTodoStatus(res, todo);

      await getRepository(Todo).delete(req.params.id);
      return res.status(204).json('정상적으로 선택 한 할 일이 삭제되었습니다!');
    } catch (error) {
      return res.status(500);
    }
  };

  // 조회를 위한 Where 절 생성 함수
  static createWhere(req: Request, res: Response) {
    const status = req.query.status as string;
    const title = req.query.title as string;
    const priority = req.query.priority as any;
    const request_deadline = req.query.deadline as string;
    const request_date_completed = req.query.date_completed as string;

    let options = {};
    if (status !== undefined) {
      if (status !== 'TODO' && status && 'IN_PROGRESS' && status !== 'DONE') {
        return res.status(400).json('상태 목록은 TODO / IN_PROGRESS / DONE 중 에서 정해주세요!');
      }
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
      if (isNaN(priority)) {
        return res.status(400).json('우선 순위는 숫자를 입력해야 합니다!');
      }

      options = {
        ...options,

        priority,
      };
    }

    if (request_deadline !== undefined) {
      if (!moment(request_deadline, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json('마감일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
      }
      const start_date = new Date(request_deadline);
      let end_date = new Date();
      end_date = new Date(start_date.setDate(start_date.getDate() + 1));
      options = {
        ...options,

        deadline: Between(new Date(request_deadline), end_date),
      };
    }

    if (request_date_completed !== undefined) {
      if (!moment(request_date_completed, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json('완료일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
      }
      const start_date = new Date(request_date_completed);
      let end_date = new Date();
      end_date = new Date(start_date.setDate(start_date.getDate() + 1));
      options = {
        ...options,

        date_completed: Between(new Date(request_date_completed), end_date),
      };
    }
    return options;
  }
}
