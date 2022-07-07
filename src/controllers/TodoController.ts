import { Request, Response } from 'express';
import { Between, getRepository, Like } from 'typeorm';
import { Todo } from '../entity/Todo';
import { RequestTodoDto } from '../dto/RequestTodoDto';
import * as moment from 'moment';

class TodoController {
  // 할 일 생성 API
  static registerTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      if (!req.body.title || !req.body.priority) {
        return res.status(401).json('반드시 "제목" / "상태" / "우선순위"를 입력해야 합니다!');
      }
      if (req.body.status) {
        type status_type = 'TODO' | 'IN_PROGRESS' | 'DONE';
        const todo_status: status_type = req.body.status.toUpperCase();
        if (todo_status !== 'TODO' && todo_status && 'IN_PROGRESS' && todo_status !== 'DONE') {
          return res.status(401).json('상태 목록은 TODO / IN_PROGRESS / DONE 중 에서 정해주세요!');
        }
      }
      if (isNaN(req.body.priority)) {
        return res.status(401).json('우선 순위는 숫자를 입력해야 합니다!');
      }

      if (req.body.deadline) {
        const deadline_validate = req.body.deadline;
        if (!moment(deadline_validate, 'YYYY-MM-DD', true).isValid()) {
          return res.status(401).json('마감일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
        }
      }
      const new_todo: RequestTodoDto = RequestTodoDto.from(req);

      const todo: Todo = getRepository(Todo).create(new_todo.toTodoEntity());
      const result: Todo = await getRepository(Todo).save(todo);

      return res.status(200).json(result);
    } catch (error) {
      res.status(400).json('잘못된 접근입니다. 올바른 값을 입력해주세요!');
    }
  };

  // 할 일 목록 조회 API
  static getTodos = async (req: Request, res: Response): Promise<Response<JSON>> => {
    const is_query_empty = Object.keys(req.query).length === 0;
    if (is_query_empty) {
      const todos = await getRepository(Todo).find({
        order: {
          priority: 'ASC',
        },
      });
      return res.status(200).json(todos);
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const TAKE = 10;
    const options = TodoController.createWhere(req, res);

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
  };

  // 할 일 상세 조회 API
  static getOneTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const id = req.params.id;
      const todo = await getRepository(Todo).findOne(id);
      if (!todo) {
        throw new Error('해당하는 ID 를 찾을 수 없습니다.');
      }
      return res.status(200).json(todo);
    } catch (error) {
      return res.status(500).json('id를 찾을 수 없습니다. 다시 시도해주세요!');
    }
  };

  // 할 일 수정 API
  static updateTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    try {
      const get_todo: Todo = await getRepository(Todo).findOne(req.params.id);
      //id 조회 결과 없다면 에러 처리
      if (!get_todo) {
        throw new Error('해당하는 ID 를 찾을 수 없습니다.');
      }
      if (get_todo.status === 'DONE') {
        res.status(500).json('완료 된 TODO는 수정할 수 없습니다!');
      } else if (get_todo && get_todo.status !== 'DONE') {
        getRepository(Todo).merge(get_todo, req.body);
        if (get_todo.status === 'DONE') {
          get_todo.date_completed = new Date();
        }
        get_todo.date_updated = new Date();
        const result: Todo = await getRepository(Todo).save(get_todo);
        return res.status(200).json(result);
      } else {
        return res.status(200).json({ msg: 'Todo Not Found' });
      }
    } catch (error) {
      return res.status(500).json('ID 값을 찾을 수 없습니다. 다시 시도해주세요!');
    }
  };

  // 할 일 삭제 API
  static deleteTodo = async (req: Request, res: Response) => {
    try {
      const todo = await getRepository(Todo).findOne(req.params.id);
      if (!todo) {
        throw new Error('해당하는 ID 를 찾을 수 없습니다.');
      } else if (todo.status === 'DONE') {
        return res.status(500).json('완료된 TODO는 삭제할 수 없습니다.');
      } else if (todo && todo.status != 'DONE') {
        const todoDelete = await getRepository(Todo).delete(req.params.id);
        return res.status(200).json('정상적으로 선택 한 할 일이 삭제되었습니다!');
      }
    } catch (error) {
      return res.status(500).json('ID 값을 찾을 수 없습니다. 다시 시도해주세요!');
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
        return res.status(401).json('상태 목록은 TODO / IN_PROGRESS / DONE 중 에서 정해주세요!');
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
        return res.status(401).json('우선 순위는 숫자를 입력해야 합니다!');
      }

      options = {
        ...options,

        priority,
      };
    }

    if (request_deadline !== undefined) {
      if (!moment(request_deadline, 'YYYY-MM-DD', true).isValid()) {
        return res.status(401).json('마감일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
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
        return res.status(401).json('완료일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
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

export default TodoController;
