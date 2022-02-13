import { IsEnum, IsString } from 'class-validator';
import { FileType } from '../../entities/enums/file-type.enum';

export class BaseFileDTO {
  @IsString()
  fileKey?: string;

  @IsEnum(FileType)
  fileType?: FileType = FileType.IMAGE;

  @IsString()
  fileName?: string;

  @IsString()
  fileUrl?: string;
}
