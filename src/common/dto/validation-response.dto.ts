import { IsArray, IsBoolean } from 'class-validator';

export class ValidationResponse {
  @IsBoolean()
  isValid: boolean;

  @IsArray()
  message: string[] = [];
}
