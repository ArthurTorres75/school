import { Injectable } from '@nestjs/common';
import { CreateLapseDto } from './dto/create-lapse.dto';
import { UpdateLapseDto } from './dto/update-lapse.dto';

@Injectable()
export class LapsesService {
  create(createLapseDto: CreateLapseDto) {
    return 'This action adds a new lapse';
  }

  findAll() {
    return `This action returns all lapses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lapse`;
  }

  update(id: number, updateLapseDto: UpdateLapseDto) {
    return `This action updates a #${id} lapse`;
  }

  remove(id: number) {
    return `This action removes a #${id} lapse`;
  }
}
