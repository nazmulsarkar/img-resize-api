import { IsString } from 'class-validator';

export class DeleteFileDTO {
  @IsString()
  Key: string;

  @IsString()
  Bucket: string;
}
