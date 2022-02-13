import { IsArray, IsBoolean } from 'class-validator';

export class ValidationResponseDTO {
  @IsBoolean()
  isValid: boolean;

  @IsArray()
  message: string[] = [];
}
