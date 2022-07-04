import { Request, Response }from 'express';
import * as todoRepository from '../data/todos';

export async function getTodos(req: Request, res: Response): Promise<void> {
    // const todos = await todoRepository.getAll();
    // res.status(200).json(todos);
}

