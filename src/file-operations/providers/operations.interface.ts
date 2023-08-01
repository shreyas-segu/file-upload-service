export interface FileOperations {
  providerName: string;
  uploadFile(file: FileObject): Promise<FileOperationStatus>;
  deleteFile(file: Partial<FileObject>): Promise<FileOperationStatus>;
}

export interface FileObject {
  name: string;
  tag: string;
  buffer: Buffer;
  mimeType: string;
}

export class FileOperationStatus {
  status: boolean;
  errorMessage?: string;
  url?: string;
  metadata: {
    provider: string;
  };
}
