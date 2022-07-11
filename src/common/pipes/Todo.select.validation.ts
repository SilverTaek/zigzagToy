import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import * as moment from "moment";
import { TodoStatus } from "../Todo.enum";

export class TodoSelectValidationPipe implements PipeTransform {
  readonly StatusOptions = [
    TodoStatus.TODO,
    TodoStatus.IN_PROGRESS,
    TodoStatus.DONE,
  ];
  transform(value: any) {
    if (value.sort) {
      const validateSort = value.sort;
      if (validateSort !== "ASC" && validateSort !== "DESC") {
        throw new BadRequestException(
          "정렬은 ASC(오름차순) / DESC(내림차순) 으로 해주세요."
        );
      }
    }
    if (value.status) {
      const validateStatus = value.status.toUpperCase();

      if (!this.isStatusValid(validateStatus)) {
        throw new BadRequestException(
          `${validateStatus} 는 올바른 형태가 아닙니다! TODO / IN_PROGRESS / DONE 형식을 지켜주세요!`
        );
      }
    }

    if (value.deadline) {
      const validateDeadline = value.deadline;
      if (!moment(validateDeadline, "YYYY-MM-DD", true).isValid()) {
        throw new BadRequestException(
          `${validateDeadline} 는 올바른 형식이 아닙니다. YYYY-MM-DD 형식을 지켜주세요!`
        );
      }
    }
    if (value.date_completed) {
      const validate_date_completed = value.date_completed;
      if (!moment(validate_date_completed, "YYYY-MM-DD", true).isValid()) {
        throw new BadRequestException(
          `${validate_date_completed} 는 올바른 형식이 아닙니다. YYYY-MM-DD 형식을 지켜주세요!`
        );
      }
    }

    if (value.priority) {
      const validate_priority = value.priority;
      if (isNaN(validate_priority)) {
        throw new BadRequestException("우선 순위는 숫자를 입력해야 합니다!");
      }
    }
    return value;
  }
  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
