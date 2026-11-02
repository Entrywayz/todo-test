"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const todo_module_1 = require("./todo/todo.module");
const todo_entity_1 = require("./todo/todo.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const databaseUrl = config.get('DATABASE_URL');
                    const sslConfig = config.get('DATABASE_SSL');
                    let ssl = undefined;
                    if (sslConfig === 'true') {
                        ssl = { rejectUnauthorized: false };
                    }
                    else if (sslConfig === 'false') {
                        ssl = false;
                    }
                    else if (databaseUrl && (databaseUrl.includes('render.com') || databaseUrl.includes('sslmode=require'))) {
                        ssl = { rejectUnauthorized: false };
                    }
                    const maskedUrl = databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':***@') : null;
                    console.log(`[TypeORM] Connecting to database: ${maskedUrl ? `URL: ${maskedUrl}` : `Host: ${config.get('DATABASE_HOST', 'localhost')}:${config.get('DATABASE_PORT', 5432)}`}`);
                    return {
                        type: 'postgres',
                        ...(databaseUrl
                            ? { url: databaseUrl }
                            : {
                                host: config.get('DATABASE_HOST', 'localhost'),
                                port: Number(config.get('DATABASE_PORT', 5432)),
                                username: config.get('DATABASE_USER', 'postgres'),
                                password: config.get('DATABASE_PASSWORD', 'postgres'),
                                database: config.get('DATABASE_NAME', 'todo_db'),
                            }),
                        entities: [todo_entity_1.Todo],
                        synchronize: true,
                        ssl,
                        logging: config.get('NODE_ENV') === 'development',
                    };
                },
            }),
            todo_module_1.TodoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map