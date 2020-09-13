import fs = require('fs');

import { FileInfo, VideoStatus } from '../../common/constants';
import { restartSchedule } from './processVideo.schedule';

import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import axios from 'axios';

ffmpeg.setFfmpegPath(ffmpegPath);

import { ITrimData } from '../../common/interfaces';

class ProcessVideoController {
  processVideo = async (): Promise<void> => {
    try {
      console.log('************** RECEIVING DATA FROM SERVER *******************');
      const res = await axios.get('api/video/get-latest');

      if (res.status === 404) {
        restartSchedule();
      }

      const {
        id,
        starts_from: startsFrom,
        duration,
        video_path: videoPath,
      }: ITrimData = res.data;

      console.log('AXIOS.PATCH -> status:', { status: VideoStatus.PROCESSING });
      await axios.patch(`/api/v1/video/${id}/status`, { status: VideoStatus.PROCESSING });

      this.trimVideo(id, startsFrom, duration, videoPath);
    }
    catch (e) {
      restartSchedule();
    }
  };

  trimVideo = (id, startsFrom, duration, untrimmedPath): void => {
    console.log('----------------------------');
    console.log('START TRIMMING');
    const trimmedPath = `${FileInfo.PATH_TO_TRIMMED}${id}.${FileInfo.FILE_EXTENSION}`;
    console.log('TRIMMED PATH:', trimmedPath);

    ffmpeg(untrimmedPath)
    .setStartTime(startsFrom)
    .setDuration(duration)
    .output(trimmedPath)
    .on('end', async (err) => {
      if (!err) {
        this.removeUntrimmedVideo(untrimmedPath);
        console.log(untrimmedPath, 'removed');

        console.log('AXIOS.PATCH -> url:', { path: trimmedPath });
        console.log('AXIOS.PATCH -> status:', { status: VideoStatus.DONE });
        await axios.patch(`/api/v1/video/${id}/url`, { path: trimmedPath });
        await axios.patch(`/api/v1/video/${id}/status`, { status: VideoStatus.DONE });

        console.log('conversion Done');
      }
    })
    .on('error', async (err) => {
      console.log('AXIOS.PATCH -> status:', { status: VideoStatus.FAILED });
      await axios.patch(`/api/v1/video/${id}/status`, { status: VideoStatus.FAILED });
      console.log('error: ', err);
    })
    .run();
  };

  removeUntrimmedVideo = (path): void => {
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  };
}

export const processVideoController = new ProcessVideoController();
