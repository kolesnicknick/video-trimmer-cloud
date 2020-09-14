export enum FileInfo {
  PATH_TO_UPLOADS = 'public/untrimmed/',
  PATH_TO_TRIMMED = 'public/trimmed/',
  FILE_EXTENSION = 'mp4',
  FILE_MIMETYPE = 'video/mp4',
  MAX_FILE_SIZE = 5000000,
}

export enum VideoStatus {
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export const VIDEO_API = '127.0.0.1:9000/';

export const { ADMIN_LOGIN, ADMIN_PASS } = process.env;
