import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { Todo } from './todo.entity';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    findAll(query: QueryTodoDto): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo>;
    remove(id: number): Promise<{
        success: boolean;
        id: number;
    }>;
}
