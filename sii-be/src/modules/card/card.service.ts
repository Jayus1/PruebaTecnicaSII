import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return await this.prisma.card.create({
      data: createCardDto,
    });
  }

  async findAll() {
    return await this.prisma.card.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Tarjeta con ID ${id} no encontrada`);
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    await this.findOne(id);

    return await this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.card.delete({
      where: { id },
    });
  }
}
