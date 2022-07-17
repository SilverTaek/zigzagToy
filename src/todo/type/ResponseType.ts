import { Todo } from "../entity/Todo.entity";

export interface ResponseType {
  item_list: Todo[];
  total_count: number;
}
