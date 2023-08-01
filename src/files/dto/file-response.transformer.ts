import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ArrayResponse,
  FilesResponse,
  PaginatedFiles,
  Response,
} from './file.dto';
import { filesWithTagsAndProviders } from '../types/types';

@Injectable()
export class FilesArrayTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ArrayResponse<FilesResponse>> {
    return next.handle().pipe(
      map((res: PaginatedFiles) => {
        const { data } = res;
        const transformedData = data.map((file: filesWithTagsAndProviders) => {
          const { fileTags, providers, ...rest } = file;
          return {
            id: rest.id,
            name: rest.name,
            size: rest.size,
            mimeType: rest.mimeType,
            objectKey: rest.objectKey,
            fileTags: fileTags.map((tag) => tag.tags.name),
            providerName: providers.name,
            deleted: rest.deleted,
          };
        });
        return {
          page: Number(res.page),
          size: Number(transformedData.length),
          total: Number(res.total),
          data: transformedData,
        };
      }),
    );
  }
}

@Injectable()
export class FilesTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<FilesResponse>> {
    return next.handle().pipe(
      map((data: filesWithTagsAndProviders) => {
        const { fileTags, providers, ...rest } = data;
        return {
          data: {
            id: rest.id,
            name: rest.name,
            size: rest.size,
            mimeType: rest.mimeType,
            objectKey: rest.objectKey,
            fileTags: fileTags.map((tag) => tag.tags.name),
            providerName: providers.name,
            deleted: rest.deleted,
          },
        };
      }),
    );
  }
}
