import { Module } from '@nestjs/common';
import { GaleryService } from './galery.service';

@Module({
  providers: [GaleryService]
})
export class GaleryModule {}
