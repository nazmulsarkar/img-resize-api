import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateFileDTO } from './create-file.dto';
import { Types } from 'mongoose';

export class FilterFileDTO extends PartialType(CreateFileDTO) {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
}

export class QueryFileDTO extends IntersectionType(
  PaginationDto,
  FilterFileDTO) { }