export interface IResizeMessage {
  fileKey: string;
  fileWidth: number;
  fileHeight: number;
}

export class ResizeMessage implements IResizeMessage {
  fileKey: string;
  fileWidth = 200;
  fileHeight = 200;
}