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
