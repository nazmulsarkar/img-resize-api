import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileType } from './enums/file-type.enum';

@Schema({ timestamps: true })
export class File {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  fileKey: string;

  @Prop({ type: FileType, required: false, default: FileType.IMAGE })
  fileType: FileType;

  @Prop({ required: true })
  fileName: string;

  @Prop()
  fileUrl: string;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
