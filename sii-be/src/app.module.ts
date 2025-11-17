import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { CardModule } from './modules/card/card.module';

@Module({
  imports: [PrismaModule, CardModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
