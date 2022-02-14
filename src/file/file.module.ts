import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from '../storage/storage.module';
import { File, FileSchema } from '../entities/file.entity';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    StorageModule,
  ],
  providers: [FileService]
})
export class FileModule { }
