import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
export declare class TodoService {
    private readonly todoRepository;
    constructor(todoRepository: Repository<Todo>);
    findAll(query?: QueryTodoDto): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    create(dto: CreateTodoDto): Promise<Todo>;
    update(id: number, dto: UpdateTodoDto): Promise<Todo>;
    remove(id: number): Promise<{
        success: boolean;
        id: number;
    }>;
}
