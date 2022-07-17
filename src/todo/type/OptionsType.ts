import { TodoStatus } from "src/enum/Todo.enum";
import { FindOperator } from "typeorm";

export interface OptionsType {
  status?: TodoStatus;
  title?: FindOperator<string>;
  priority?: number;
  deadline?: FindOperator<Date>;
  date_completed?: FindOperator<Date>;
}
