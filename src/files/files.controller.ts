import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {
  ArrayResponseSchema,
  FileUploadRequest,
  ResponseSchema,
} from './dto/file.dto';
import {
  FilesArrayTransformInterceptor,
  FilesTransformInterceptor,
} from './dto/file-response.transformer';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ version: '1', path: 'file' })
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  @Inject()
  private filesService: FilesService;

  @Post()
  @UseInterceptors(FileInterceptor('file'), FilesTransformInterceptor)
  @HttpCode(201)
  @ApiBody({ type: FileUploadRequest })
  @ApiConsumes('multipart/form-data')
  @ApiResponse(ResponseSchema)
  @ApiTags('Creation, updation and deletion of files')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadRequest,
    @Headers('x-api-key') apiKey: string,
  ) {
    return await this.filesService.uploadFile(file, body, apiKey);
  }

  @Get()
  @UseInterceptors(FilesArrayTransformInterceptor)
  @ApiResponse(ArrayResponseSchema)
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'file tag for organization / categorization',
  })
  @ApiQuery({ name: 'size', required: false, description: 'page size' })
  @ApiQuery({ name: 'page', required: false, description: 'page number' })
  @ApiQuery({ name: 'provider', required: false, description: 'provider name' })
  @ApiQuery({
    name: 'include-deleted',
    required: false,
    description: 'include soft deleted files as well',
  })
  @ApiTags('Fetch')
  async getFiles(
    @Query('tag') tag: string,
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('provider') provider: string,
    @Query('include-deleted') includeDeleted: boolean,
    @Headers('x-api-key') apiKey: string,
  ) {
    return await this.filesService.getFiles(
      tag,
      size,
      page,
      provider,
      includeDeleted,
      apiKey,
    );
  }

  @Get(':id')
  @UseInterceptors(FilesTransformInterceptor)
  @ApiResponse(ResponseSchema)
  @ApiQuery({
    name: 'include-deleted',
    required: false,
    description: 'delete file from database as well as object store',
  })
  @ApiParam({ name: 'id', required: true, description: 'file id' })
  @ApiQuery({
    name: 'include-deleted',
    required: false,
    description: 'include soft deleted files as well',
  })
  @ApiTags('Fetch')
  async getFile(
    @Param('id') id: number,
    @Query('include-deleted') includeDeleted: boolean,
    @Headers('x-api-key') apiKey: string,
  ) {
    return await this.filesService.getFile(id, includeDeleted, apiKey);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FilesTransformInterceptor)
  @ApiResponse(ResponseSchema)
  @ApiParam({ name: 'id', required: true, description: 'file id' })
  @ApiTags('Creation, updation and deletion of files')
  async updateFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadRequest,
    @Headers('x-api-key') apiKey: string,
  ) {
    return await this.filesService.updateFile(id, file, body, apiKey);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, description: 'file id' })
  @ApiQuery({
    name: 'force',
    required: false,
    description: 'delete file from database as well as object store',
  })
  @ApiTags('Creation, updation and deletion of files')
  @HttpCode(204)
  async deleteFile(
    @Param('id') id: number,
    @Query('force') force: boolean,
    @Headers('x-api-key') apiKey: string,
  ) {
    return await this.filesService.deleteFile(id, force, apiKey);
  }
}
