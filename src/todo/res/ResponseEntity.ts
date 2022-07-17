import { Todo } from "../entity/Todo.entity";
import { ResponseType } from "../type/ResponseType";
import { ResponseStatus } from "./ResponseStatus";

export class ResponseEntity<T> {
  private readonly _statusCode: string;
  private readonly _message: string;
  private readonly _data: Todo | ResponseType;

  private constructor(
    status: ResponseStatus,
    message: string,
    data: Todo | ResponseType
  ) {
    this._statusCode = ResponseStatus[status];
    this._message = message;
    this._data = data;
  }

  static OK(message: string, data: Todo): ResponseEntity<Todo> {
    return new ResponseEntity<string>(ResponseStatus.OK, message, data);
  }
  static OK_WITH<T>(todo: ResponseType): ResponseEntity<ResponseType> {
    return new ResponseEntity<ResponseType>(
      ResponseStatus.OK,
      "성공적으로 호출했습니다.",
      todo
    );
  }
}
