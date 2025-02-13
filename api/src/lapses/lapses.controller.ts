import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LapsesService } from './lapses.service';
import { CreateLapseDto } from './dto/create-lapse.dto';
import { UpdateLapseDto } from './dto/update-lapse.dto';

@Controller('lapses')
export class LapsesController {
  constructor(private readonly lapsesService: LapsesService) {}

  @Post()
  create(@Body() createLapseDto: CreateLapseDto) {
    return this.lapsesService.create(createLapseDto);
  }

  @Get()
  findAll() {
    return this.lapsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lapsesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLapseDto: UpdateLapseDto) {
    return this.lapsesService.update(+id, updateLapseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lapsesService.remove(+id);
  }
}
