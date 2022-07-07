import { Router } from 'express';
import TodoController from '../controllers/TodoController';

const router: Router = Router();

router.post('/', TodoController.registerTodo);
router.get('/', TodoController.getTodos);
router.get('/:id', TodoController.getOneTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);
export default router;
