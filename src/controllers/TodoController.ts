import { Request, Response } from 'express';
import { validateDeadLine } from '../common/validator/TodoValidate';
import { TodoService } from '../service/TodoService';
class TodoController {
  // 할 일 생성 API
  static createTodo = async (req: Request, res: Response): Promise<Response<JSON>> => {
    validateDeadLine(req, res);
    return TodoService.registerTodo(req, res);
  };

  // 할 일 목록 조회 API
  static selectTodos = async (req: Request, res: Response): Promise<Response<JSON>> => TodoService.getTodos(req, res);

  // 할 일 상세 조회 API
  static selectTodoOne = async (req: Request, res: Response): Promise<Response<JSON>> =>
    TodoService.getTodoOne(req, res);

  // 할 일 수정 API
  static updateTodo = async (req: Request, res: Response): Promise<Response<JSON>> => TodoService.modifyTodo(req, res);

  // 할 일 삭제 API
  static deleteTodo = async (req: Request, res: Response) => TodoService.removeTodo(req, res);
}

export default TodoController;
