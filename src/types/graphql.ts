import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  CrTimestamp: any;
};

/** createTodoList의 건별 입력 */
export type CreateTodoInput = {
  /** 마감일 */
  deadline?: InputMaybe<Scalars['String']>;
  /** 우선순위 */
  priority: Scalars['Int'];
  /** 상태 */
  status?: InputMaybe<TodoStatusType>;
  /** 제목 */
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Todo 생성 및 생성 된 Todo 반환 */
  createTodo: Todo;
  /** JWT 생성 및 JWT 반환 */
  createToken: Token;
  /** Todo 삭제 및 정상 삭제 시 true 반환 */
  removeTodo: Scalars['Boolean'];
  /** Todo 변경 및 변경 된 Todo 반환 */
  updateTodo: Todo;
};


export type MutationCreateTodoArgs = {
  createTodoInput: CreateTodoInput;
};


export type MutationRemoveTodoArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateTodoArgs = {
  id: Scalars['Int'];
  updateTodoInput: UpdateTodoInput;
};

export type Query = {
  __typename?: 'Query';
  /**
   * 주어진 조건 모두에 일치하는 할 일을 받는다.
   * 조건에 맞는 할 일이 없으면 null을 반환한다.
   * 조건을 주지 않으면 null을 반환한다.
   */
  todo?: Maybe<Todo>;
  /**
   * 주어진 조건 모두에 일치하는 할 일 목록을 받는다.
   * 조건을 주지 않으면 모든 할 일을 반환한다.
   */
  todo_list: TodoList;
};


export type QueryTodoArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryTodo_ListArgs = {
  responseTodo?: InputMaybe<ResponseTodo>;
};

/** todo_list의 조건 옵션 */
export type ResponseTodo = {
  /** 완료일 */
  date_completed?: InputMaybe<Scalars['CrTimestamp']>;
  /** 마감일 */
  deadline?: InputMaybe<Scalars['String']>;
  /** 페이지 */
  page?: InputMaybe<Scalars['Int']>;
  /** 우선순위 */
  priority?: InputMaybe<Scalars['Int']>;
  /** 정렬 */
  sort?: InputMaybe<TodoOrderType>;
  /** 상태 */
  status?: InputMaybe<TodoStatusType>;
  /** 가지고 올 갯수 */
  take?: InputMaybe<Scalars['Int']>;
  /** 제목 */
  title?: InputMaybe<Scalars['String']>;
};

/** 할 일 */
export type Todo = {
  __typename?: 'Todo';
  /** 완료 일자 */
  date_completed?: Maybe<Scalars['CrTimestamp']>;
  /** 생성 일자 */
  date_created: Scalars['CrTimestamp'];
  /** 변경 일자 */
  date_updated: Scalars['CrTimestamp'];
  /** 마감일 */
  deadline?: Maybe<Scalars['CrTimestamp']>;
  /** 기본 키 */
  id: Scalars['Int'];
  /** 우선순위 */
  priority: Scalars['Int'];
  /** 상태 */
  status?: Maybe<TodoStatusType>;
  /** 제목 */
  title: Scalars['String'];
};

/** 할 일 목록 및 요약 데이터 */
export type TodoList = {
  __typename?: 'TodoList';
  /** 할 일 목록 */
  item_list: Array<Todo>;
  /** 총목록 수 */
  total_count?: Maybe<Scalars['Int']>;
};

/** 정렬 타입 */
export enum TodoOrderType {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** 할 일 상태 타입 */
export enum TodoStatusType {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

/** 토큰 */
export type Token = {
  __typename?: 'Token';
  token?: Maybe<Scalars['String']>;
};

/** updateTodoList의 건별 입력 */
export type UpdateTodoInput = {
  /** 마감일 */
  deadline?: InputMaybe<Scalars['String']>;
  /** 우선순위 */
  priority: Scalars['Int'];
  /** 상태 */
  status?: InputMaybe<TodoStatusType>;
  /** 제목 */
  title: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CrTimestamp: ResolverTypeWrapper<Scalars['CrTimestamp']>;
  CreateTodoInput: CreateTodoInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ResponseTodo: ResponseTodo;
  String: ResolverTypeWrapper<Scalars['String']>;
  Todo: ResolverTypeWrapper<Todo>;
  TodoList: ResolverTypeWrapper<TodoList>;
  TodoOrderType: TodoOrderType;
  TodoStatusType: TodoStatusType;
  Token: ResolverTypeWrapper<Token>;
  UpdateTodoInput: UpdateTodoInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CrTimestamp: Scalars['CrTimestamp'];
  CreateTodoInput: CreateTodoInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  ResponseTodo: ResponseTodo;
  String: Scalars['String'];
  Todo: Todo;
  TodoList: TodoList;
  Token: Token;
  UpdateTodoInput: UpdateTodoInput;
};

export interface CrTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CrTimestamp'], any> {
  name: 'CrTimestamp';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createTodo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType, RequireFields<MutationCreateTodoArgs, 'createTodoInput'>>;
  createToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  removeTodo?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveTodoArgs, 'id'>>;
  updateTodo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType, RequireFields<MutationUpdateTodoArgs, 'id' | 'updateTodoInput'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  todo?: Resolver<Maybe<ResolversTypes['Todo']>, ParentType, ContextType, Partial<QueryTodoArgs>>;
  todo_list?: Resolver<ResolversTypes['TodoList'], ParentType, ContextType, Partial<QueryTodo_ListArgs>>;
};

export type TodoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = {
  date_completed?: Resolver<Maybe<ResolversTypes['CrTimestamp']>, ParentType, ContextType>;
  date_created?: Resolver<ResolversTypes['CrTimestamp'], ParentType, ContextType>;
  date_updated?: Resolver<ResolversTypes['CrTimestamp'], ParentType, ContextType>;
  deadline?: Resolver<Maybe<ResolversTypes['CrTimestamp']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['TodoStatusType']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TodoListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TodoList'] = ResolversParentTypes['TodoList']> = {
  item_list?: Resolver<Array<ResolversTypes['Todo']>, ParentType, ContextType>;
  total_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CrTimestamp?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  TodoList?: TodoListResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
};

