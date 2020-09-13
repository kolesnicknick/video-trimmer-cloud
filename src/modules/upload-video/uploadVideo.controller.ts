import { Request, Response, NextFunction } from "express";
import fileUpload = require('express-fileupload');
import fs = require('fs');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const axios = require('axios').default;

import { FileInfo, VideoStatus } from '../../common/constants';

class UploadVideoController {
  uploadUntrimmedVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const video: any = req.files.video;  // TYPE: fileUpload.UploadedFile | fileUpload.UploadedFile[]

    if (!video) {
      console.log('No video');
    }

    if (!video.mimetype.startsWith(FileInfo.FILE_MIMETYPE)) {
      console.log('Upload mp4 file');
    }

    if (video.size > FileInfo.MAX_FILE_SIZE) {
      console.log(`Upload file less than ${process.env.MAX_FILE_UPLOAD}`);
    }

    video.name = `${id}.mp4`;
    const videoPath = `${FileInfo.PATH_TO_UPLOADS}${video.name}`;

    video.mv(videoPath, (err: any) => {
      if (err) {
        console.log(err);
      }
    });

    console.log('AXIOS.PATCH -> url:', { path: videoPath });
    console.log('AXIOS.PATCH -> status:', { status: VideoStatus.SCHEDULED });
    axios.patch(`/api/v1/video/${id}/url`, { path: videoPath })
    axios.patch(`/api/v1/video/${id}/status`, { status: VideoStatus.SCHEDULED })

    res.send({
      success: true,
      message: `${video.name} uploaded to ${videoPath}`,
    });
  };
}

export const uploadVideoController = new UploadVideoController();
