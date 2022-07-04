import express from 'express';
import * as todoController from '../controller/todos';
const router = express.Router();

router.get('/', todoController.getTodos);

export default router;