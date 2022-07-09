import { Router } from 'express';
import TodoController from '../controllers/TodoController';
import { scheme } from '../common/validator/TodoValidate';
import { TodoRequestSchema } from '../common/validator/TodoRequestSchema';

const router: Router = Router();

router.post('/', scheme, TodoRequestSchema, TodoController.createTodo);
router.get('/', TodoController.selectTodos);
router.get('/:id', TodoController.selectTodoOne);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);
export default router;
