import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidAndNotEmptyObject } from '../helpers/isValidAndNotEmptyObject';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidAndNotEmptyObject(value)) {
      throw new BadRequestException(`Email is incorrect`);
    }
    return value;
  }
}
