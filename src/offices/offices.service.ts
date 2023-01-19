import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Office } from 'src/entities/office.entity';
import { Repository } from 'typeorm';
import { CreateOfficeDto } from './dto/create-office.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  create(createOfficeDto: CreateOfficeDto) {
    return this.officeRepository.save(createOfficeDto);
  }

  findAll() {
    return this.officeRepository.find();
  }

  getOfficeById(id: number) {
    return this.officeRepository.findOne({
      where: { officeId: id },
    });
  }
}
