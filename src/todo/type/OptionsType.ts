import { TodoStatusType } from 'src/types/graphql';
import { FindOperator } from 'typeorm';

export interface OptionsType {
  status?: TodoStatusType;
  title?: FindOperator<string>;
  priority?: number;
  deadline?: FindOperator<Date>;
  date_completed?: FindOperator<Date>;
}
