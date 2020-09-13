import * as express from 'express';
import * as cors from 'cors';
import * as fileupload from 'express-fileupload';
import * as bodyParser from 'body-parser';

import { uploadVideoController } from './modules/upload-video/uploadVideo.controller';
import { authMiddleware } from './middlewares/auth.middleware';

class Server {
  private initExpress() {
    const app: express.Express = express();
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(cors());
    app.use(fileupload());

    app.post('/videos/:id', authMiddleware, uploadVideoController.uploadUntrimmedVideo);

    // set env port
    const PORT: number = 5000;

    return new Promise((resolve) => {
      app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`);
        resolve();
      });
    });
  }

  async start() {
    await this.initExpress();
  }
}

const server = new Server();
server.start().catch((err) => {
  console.log(err);
});
