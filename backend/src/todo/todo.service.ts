import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(query?: QueryTodoDto): Promise<Todo[]> {
    const where: FindOptionsWhere<Todo>[] | FindOptionsWhere<Todo> = {};

    if (query?.search && query.completed !== undefined) {
      return this.todoRepository.find({
        where: [
          { title: ILike(`%${query.search}%`), isCompleted: query.completed },
          { description: ILike(`%${query.search}%`), isCompleted: query.completed },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    if (query?.search) {
      return this.todoRepository.find({
        where: [
          { title: ILike(`%${query.search}%`) },
          { description: ILike(`%${query.search}%`) },
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

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    return todo;
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      isCompleted: false,
    });
    return this.todoRepository.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
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

  async remove(id: number): Promise<{ success: boolean; id: number }> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
    return { success: true, id };
  }
}
