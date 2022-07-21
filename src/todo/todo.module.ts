import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TodoEntity } from './entity/Todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), AuthModule],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
