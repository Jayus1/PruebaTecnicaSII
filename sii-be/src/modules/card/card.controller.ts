import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Tarjetas')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarjeta' })
  @ApiResponse({
    status: 201,
    description: 'La tarjeta ha sido creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarjetas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarjetas obtenida exitosamente',
  })
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarjeta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta' })
  @ApiResponse({
    status: 200,
    description: 'Tarjeta encontrada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarjeta' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta' })
  @ApiResponse({
    status: 200,
    description: 'Tarjeta actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarjeta' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta' })
  @ApiResponse({
    status: 204,
    description: 'Tarjeta eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  remove(@Param('id') id: string) {
    return this.cardService.remove(id);
  }
}
