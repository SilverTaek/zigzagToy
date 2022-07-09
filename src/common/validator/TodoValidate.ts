import { Resolver } from 'dns';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { Todo } from '../../entity/Todo';
import * as moment from 'moment';

export function validateDeadLine(req: Request, res: Response) {
  if (req.body.deadline) {
    const deadline_validate = req.body.deadline;
    if (!moment(deadline_validate, 'YYYY-MM-DD', true).isValid()) {
      return res.status(401).json('마감일은 YYY-MM-DD 형식 또는 명확한 날짜를 입력해야 합니다!');
    }
  }
}

export function checkTodo(req: Request, res: Response, todo: Todo) {
  if (!todo) {
    return res.status(404).json('해당하는 Todo 를 찾을 수 없습니다. 다시 시도해주세요.');
  }
}

export function checkTodoStatus(res: Response, todo: Todo) {
  if (todo.status === 'DONE') {
    return res.status(400).json('완료 된 TODO는 수정 및 삭제 할 수 없습니다!');
  }
}

export const scheme = [
  body('title').isString().withMessage('제목을 입력 올바르게 입력해주세요!'),
  body('priority').isNumeric().withMessage('우선 순위를 올바르게 입력해주세요!(숫자)'),
  body('status').contains('TODO').withMessage('할 일의 기본 값은 TODO로 입력해주세요!'),
];
