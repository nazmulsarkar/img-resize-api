import { UploadFileDTO } from './../storage/dto/upload-file.dto';
import { QueryResponse } from '../common/dto/query-response.dto';

import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './../storage/storage.service';
import { FilterFileDTO, QueryFileDTO } from './dto/filter-file.dto';
import { File } from '../entities/file.entity';
import { FileType } from '../common/enums/file-type.enum';
import { CreateFileDTO } from './dto/create-file.dto';
import { extname } from 'path';
import { CommandResponse } from '../common/dto/command-response.dto';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private s3BucketBaseUrl;

  constructor(
    @InjectModel('File') private fileModel: Model<File>,
    private storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    this.s3BucketBaseUrl = this.configService.get('PROFILE_IMAGE_BASE_URL');
  }

  async addSecureFile(
    imageBuffer: Buffer,
    fileName: string,
    fileType: FileType,
  ) {
    this.logger.log('addSecureFile');
    try {
      const fileNameNew = fileName.replace(/[^A-Z0-9]+/gi, '-');
      const uploadResult = await this.storageService.uploadFile(
        imageBuffer,
        fileNameNew,
      );
      const newFile: CreateFileDTO = {
        fileKey: uploadResult.Key,
        fileType,
        fileName: fileNameNew,
        fileUrl: this.s3BucketBaseUrl + '/' + uploadResult.Key,
      };
      const createdFile = new this.fileModel(newFile);
      return await createdFile.save();
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async findOne(filter: FilterFileDTO) {
    const file = await this.fileModel.findOne(filter);

    if (!file) {
      throw new NotFoundException(`File not found`);
    }
    return file;
  }

  async uploadFile({
    imageBuffer,
    fileName,
    fileType,
    prevFileId,
  }: {
    imageBuffer: Buffer;
    fileName: string;
    fileType: FileType;
    prevFileId?: Types.ObjectId;
  }) {
    try {
      const fileNameNew = fileName.replace(/[^A-Z0-9]+/gi, '-');
      const uploadResult = await this.storageService.uploadFile(
        imageBuffer,
        fileNameNew,
      );

      if (prevFileId) {
        await this.removeFile({ _id: prevFileId });
        const updateFile = {
          fileName: fileNameNew,
          fileKey: uploadResult.Key,
          fileUrl: this.s3BucketBaseUrl + '/' + uploadResult.Key,
        };
        return await this.fileModel.findOneAndUpdate(
          { _id: prevFileId },
          updateFile,
          { new: true },
        );
      } else {
        const newFile: CreateFileDTO = {
          fileKey: uploadResult.Key,
          fileType,
          fileName: fileNameNew,
          fileUrl: this.s3BucketBaseUrl + '/' + uploadResult.Key,
        };
        const createdFile = new this.fileModel(newFile);
        return await createdFile.save();
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    let createdFiles: any;
    const response: CommandResponse = new CommandResponse()

    const filesToUlpoad: UploadFileDTO[] = files.map((file) => {
      const ext = extname(file.originalname);
      const fileName = file.originalname.replace(ext, '').replace(/[^A-Z0-9]+/gi, '-') + ext;
      const uploadDTO: UploadFileDTO = { fileName, file: file.buffer };
      return uploadDTO;
    });

    try {
      const uploadedFiles = await this.storageService.uploadMultipleFile(
        filesToUlpoad,
      );

      if (uploadedFiles) {
        const createFiles = uploadedFiles.map((u, i) => {
          const newFile: Partial<File> = {
            fileKey: u.Key,
            fileName: filesToUlpoad[i].fileName,
            fileUrl: this.s3BucketBaseUrl + '/' + u.Key,
          };
          return newFile;
        });

        createdFiles = await this.fileModel.insertMany(createFiles);
      }


      response.success = createdFiles ? true : false;
      const message = createdFiles ? `Success: Total ${filesToUlpoad.length} uploaded successfully!` : `Error: Upload has error, please try later!`
      response.message.push(message);

      return response;
    } catch (err) { throw new BadRequestException(err.message) }
  }

  async findAllFiles(queryParams: QueryFileDTO): Promise<QueryResponse<File>> {
    const response = new QueryResponse<File>();

    const { pageNumber, pageSize, ...rest } = queryParams;
    const filterQry = rest || {};
    const filteredQuery = this.buildQuery(filterQry);

    const size = pageSize || 100;
    const page = pageNumber || 0;

    const sortsQry = [{ property: 'createdAt', direction: -1 }];
    const sort = {};
    sortsQry.map((s) => {
      sort[s.property] = s.direction;
    });

    try {
      response.totalCount = await this.fileModel.countDocuments({
        ...filterQry,
      });

      const files = await this.fileModel
        .find({ ...filteredQuery })
        .skip(page)
        .limit(size)
        .exec();
      response.data = files || [];
      response.success = files ? true : false;
      return response;
    } catch (err) {
      throw new InternalServerErrorException(`${err.message}`);
    }
  }

  buildQuery(filter: FilterFileDTO) {
    return filter;
  }

  async removeFile(filter: FilterFileDTO) {
    const file = await this.fileModel.findOne({ ...filter });
    if (!file) {
      throw new BadRequestException(`Error: File not found with id: ${filter.toString()}!`);
    }
    await this.storageService.deleteFile(file.fileKey);
    return await this.fileModel.deleteOne({ _id: file._id });
  }
}
