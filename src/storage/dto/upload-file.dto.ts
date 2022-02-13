import { IsString } from 'class-validator';

export class UploadFileDTO {
  file: Buffer;

  @IsString()
  fileName: string;
}
