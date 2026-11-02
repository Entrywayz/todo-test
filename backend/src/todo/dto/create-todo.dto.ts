import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ example: 'Купить продукты', description: 'Заголовок задачи' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Молоко, хлеб, яйца',
    description: 'Подробное описание задачи',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
