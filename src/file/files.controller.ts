import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { QueryFileDTO } from './dto/filter-file.dto';
import { FileService } from './file.service';
import { FileType } from '../common/enums/file-type.enum';

const maxFileCount = 5;
const maxFileSize = 5000000;

@Controller('files')
export class FilesController {
  constructor(private fileService: FileService) { }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    return this.fileService.findOne({ id });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: maxFileSize } }))
  async addSecureFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileType') fileType: FileType = FileType.IMAGE,
  ) {
    return await this.fileService.addSecureFile(
      file.buffer,
      file.originalname,
      fileType,
    );
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', maxFileCount, { limits: { fileSize: maxFileSize } }))
  async addSecureFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.fileService.uploadFiles(files);
  }

  @Post('secured/:fileKey')
  async getSecureFile(
    @Param('fileKey') fileKey: string,
  ) {
    return await this.fileService.findOne({ fileKey });
  }

  @Get()
  async findAllFiles(@Query() queryParams: QueryFileDTO) {
    return await this.fileService.findAllFiles(queryParams);
  }

  @Delete(':id')
  async remove(@Param('id') id: Types.ObjectId) {
    return await this.fileService.removeFile({ _id: id });
  }
}
