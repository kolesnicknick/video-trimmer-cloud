import { processVideoController } from './processVideo.controller';
import * as cron from 'node-cron';

// change */10 to *
const schedule = cron.schedule('*/10 * * * * *', processVideoController.processVideo);

export const restartSchedule = () => {
  const time = 5000;
  schedule.stop();
  console.log(`Restart in ${time / 1000} seconds`);
  setTimeout(() => {
    schedule.start();
    console.log('Restart');
  }, time);
};
