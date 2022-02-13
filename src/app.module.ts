import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.DB_URL}`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      retryWrites: false,
    }),
    StorageModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
