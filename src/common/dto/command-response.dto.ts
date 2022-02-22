
import { IsArray, IsBoolean } from 'class-validator';

export interface ICommandResponse {
  success: boolean;
  message: string[];
}

export class CommandResponse implements ICommandResponse {
  @IsBoolean()
  success = true;

  @IsArray()
  message: string[] = [];
}
