import { SqsModule } from './../sqs/sqs.module';
import { FilesController } from './files.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from '../storage/storage.module';
import { File, FileSchema } from '../entities/file.entity';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    StorageModule,
    SqsModule,
  ],
  providers: [FileService],
  controllers: [FilesController]
})
export class FileModule { }
