import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { Todo } from './todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех задач с фильтрацией' })
  @ApiResponse({ status: 200, description: 'Список задач', type: [Todo] })
  async findAll(@Query() query: QueryTodoDto): Promise<Todo[]> {
    return this.todoService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Данные задачи', type: Todo })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiResponse({ status: 201, description: 'Задача создана', type: Todo })
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу (статус выполнения, текст)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Задача обновлена', type: Todo })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Задача удалена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; id: number }> {
    return this.todoService.remove(id);
  }
}
