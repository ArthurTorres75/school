import { Module } from '@nestjs/common';
import { LapsesService } from './lapses.service';
import { LapsesController } from './lapses.controller';

@Module({
  controllers: [LapsesController],
  providers: [LapsesService],
})
export class LapsesModule {}
