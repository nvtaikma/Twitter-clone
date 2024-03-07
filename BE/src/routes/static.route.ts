import { Router } from 'express'
import {
  serveImageController,
  serveM3U8Controller,
  serveSegmentController,
  serveVideoS3Controller,
  serveVideoStreamController
} from '~/controllers/medias.controllers'
const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video-stream-server/:name', serveVideoStreamController) // chỉ sử dụng khi lưu video ở server
staticRouter.get('/video-stream/:name', serveVideoS3Controller)
staticRouter.get('/video-hls/:id/master.m3u8', serveM3U8Controller)
staticRouter.get('/video-hls/:id/:v/:segment', serveSegmentController) // segment: tên của file .ts trong thư mục videos-hls, v: version của video tương dương với chất lượng video, id: name của video

export default staticRouter
