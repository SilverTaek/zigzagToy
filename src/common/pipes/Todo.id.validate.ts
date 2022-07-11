import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

export class TodoIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (isNaN(value)) {
      throw new BadRequestException("Id 값은 숫자여야 합니다!");
    }
    return value;
  }
}
