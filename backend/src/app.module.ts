import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { Todo } from './todo/todo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const sslConfig = config.get<string>('DATABASE_SSL');

        let ssl: any = undefined;
        if (sslConfig === 'true') {
          ssl = { rejectUnauthorized: false };
        } else if (sslConfig === 'false') {
          ssl = false;
        } else if (databaseUrl && (databaseUrl.includes('render.com') || databaseUrl.includes('sslmode=require'))) {
          ssl = { rejectUnauthorized: false };
        }

        const maskedUrl = databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':***@') : null;
        console.log(
          `[TypeORM] Connecting to database: ${
            maskedUrl ? `URL: ${maskedUrl}` : `Host: ${config.get('DATABASE_HOST', 'localhost')}:${config.get('DATABASE_PORT', 5432)}`
          }`,
        );

        return {
          type: 'postgres' as const,
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DATABASE_HOST', 'localhost'),
                port: Number(config.get<number>('DATABASE_PORT', 5432)),
                username: config.get<string>('DATABASE_USER', 'postgres'),
                password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
                database: config.get<string>('DATABASE_NAME', 'todo_db'),
              }),
          entities: [Todo],
          synchronize: true,
          ssl,
          logging: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    TodoModule,
  ],
})
export class AppModule {}
