import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { GaleryModule } from './galery/galery.module';

@Module({
  imports: [StorageModule, GaleryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
