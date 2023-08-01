import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { filesWithTagsAndProviders } from '../types/types';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class FileUploadRequest {
  @ApiProperty({ description: 'tag', example: 'cat' })
  tag: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file that you wish to upload',
  })
  file: Express.Multer.File;
}

export class FileQueryRequest {
  @IsString()
  @Type(() => String)
  tag: '';

  @IsInt()
  @Type(() => Number)
  size: 10;

  @IsInt()
  @Type(() => Number)
  page: 0;

  @IsString()
  @Type(() => String)
  provider: 's3';

  @IsBoolean()
  @Type(() => Boolean)
  includeDeleted: false;
}

export class Response<T> {
  // @ApiProperty({
  //   description: 'response data',
  // })
  data: T;
}

export class ArrayResponse<T> {
  @ApiProperty({
    description: 'response data',
  })
  data: T[];

  @ApiProperty({
    description: 'page number',
  })
  page: number;

  @ApiProperty({
    description: 'page size',
  })
  size: number;

  @ApiProperty({
    description: 'total number of records',
  })
  total: number;
}

export class PaginatedFiles {
  data: filesWithTagsAndProviders[];
  total: number;
  page: number;
  limit: number;
}

@ApiExtraModels()
export class FilesResponse {
  @ApiProperty({ description: 'file id', example: 1 })
  id: number;

  @ApiProperty({ description: 'file name', example: 'cat.jpg' })
  name: string;

  @ApiProperty({ description: 'file url', example: 'https://cat.jpg' })
  objectKey: string;

  @ApiProperty({ description: 'file mime type', example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ description: 'file size', example: 100 })
  size: number;

  @ApiProperty({ description: 'file provider', example: 's3' })
  providerName: string;

  @ApiProperty({ description: 'file tags', example: ['cat'] })
  fileTags: string[];

  @ApiProperty({ description: 'file is deleted', example: false })
  deleted?: boolean;
}

// Only for swagger. unfortunately
export const ResponseSchema = {
  schema: {
    properties: {
      data: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          size: {
            type: 'number',
          },
          mimeType: {
            type: 'string',
          },
          objectKey: {
            type: 'string',
          },
          fileTags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          providerName: {
            type: 'string',
          },
        },
      },
    },
  },
};
export const ArrayResponseSchema = {
  schema: {
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            name: {
              type: 'string',
            },
            size: {
              type: 'number',
            },
            mimeType: {
              type: 'string',
            },
            objectKey: {
              type: 'string',
            },
            fileTags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            providerName: {
              type: 'string',
            },
          },
        },
      },
      page: {
        type: 'number',
      },
      size: {
        type: 'number',
      },
    },
  },
};
