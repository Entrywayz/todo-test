"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
let TodoService = class TodoService {
    todoRepository;
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async findAll(query) {
        const where = {};
        if (query?.search && query.completed !== undefined) {
            return this.todoRepository.find({
                where: [
                    { title: (0, typeorm_2.ILike)(`%${query.search}%`), isCompleted: query.completed },
                    { description: (0, typeorm_2.ILike)(`%${query.search}%`), isCompleted: query.completed },
                ],
                order: { createdAt: 'DESC' },
            });
        }
        if (query?.search) {
            return this.todoRepository.find({
                where: [
                    { title: (0, typeorm_2.ILike)(`%${query.search}%`) },
                    { description: (0, typeorm_2.ILike)(`%${query.search}%`) },
                ],
                order: { createdAt: 'DESC' },
            });
        }
        if (query?.completed !== undefined) {
            return this.todoRepository.find({
                where: { isCompleted: query.completed },
                order: { createdAt: 'DESC' },
            });
        }
        return this.todoRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_1.NotFoundException(`Задача с ID ${id} не найдена`);
        }
        return todo;
    }
    async create(dto) {
        const todo = this.todoRepository.create({
            title: dto.title.trim(),
            description: dto.description?.trim(),
            isCompleted: false,
        });
        return this.todoRepository.save(todo);
    }
    async update(id, dto) {
        const todo = await this.findOne(id);
        if (dto.title !== undefined) {
            todo.title = dto.title.trim();
        }
        if (dto.description !== undefined) {
            todo.description = dto.description.trim();
        }
        if (dto.isCompleted !== undefined) {
            todo.isCompleted = dto.isCompleted;
        }
        return this.todoRepository.save(todo);
    }
    async remove(id) {
        const todo = await this.findOne(id);
        await this.todoRepository.remove(todo);
        return { success: true, id };
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodoService);
//# sourceMappingURL=todo.service.js.map