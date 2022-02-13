import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Module({
  providers: [GalleryService]
})
export class GalleryModule {}
