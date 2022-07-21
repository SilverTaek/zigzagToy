import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { CrTimestamp } from '@croquiscom/crary-graphql';
import { AuthModule } from './auth/auth.module';

const NODE_ENV = {
  product: 'PRODUCT',
  dev: 'DEV',
};
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: true,
          logging: true,
          entities: [__dirname + '/**/*.entity.{js,ts}'],
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const resolvers = { CrTimestamp };
        const debug: boolean =
          configService.get<string>('NODE_ENV') !== NODE_ENV.dev;
        return { typePaths: ['./**/*.graphql'], resolvers, debug };
      },
    }),
    TodoModule,
    AuthModule,
  ],
})
export class AppModule {}
