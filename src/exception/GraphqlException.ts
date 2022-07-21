import { ValidationError } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

export class GraphQLTodoException extends ApolloError {
  constructor(message: string, code: string) {
    super(message);
    const contents = {
      type: 'warning',
      title: '유효하지 않은 TODO ID 입니다.',
      body: '다시 한 번 확인해주세요',
      link_title: 'ID 확인',
      link_url: 'https://example.com/check-todo',
    };

    this.extensions = { code, contents };
  }
}

export class GraphQLTodoStatusException extends ApolloError {
  constructor(message: string, code: string) {
    super(message);
    const contents = {
      type: 'warning',
      title: 'DONE 상태의 Todo를 수정/삭제할 수 없습니다.',
      body: '다시 한 번 확인해주세요',
      link_title: 'TODO Status 확인',
      link_url: 'https://example.com/check-todo',
    };

    this.extensions = { code, contents };
  }
}

export class GraphQLTodoValidateException extends ApolloError {
  constructor(validation: ValidationError[], message: string, code: string) {
    super(message);
    const contents = {
      type: 'warning',
      title: validation[0].target.title,
      body: validation[0].constraints.matches,
      link_title: 'TODO Validation 확인',
      link_url: 'https://example.com/check-todo',
    };

    this.extensions = { code, contents };
  }
}
