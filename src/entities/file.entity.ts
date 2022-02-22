import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileType } from '../common/enums/file-type.enum';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class File {
  @Prop({ required: true })
  fileKey: string;

  @Prop({ required: false, default: FileType.IMAGE })
  fileType: FileType;

  @Prop({ required: true })
  fileName: string;

  @Prop()
  fileUrl: string;

  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  createdAt?: Date;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);