import { Todo } from '../entity/Todo.entity';

export interface TodoListType {
  total_count: number;
  item_list: Todo[];
}
