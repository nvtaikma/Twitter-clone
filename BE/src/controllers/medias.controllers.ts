import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import { USERS_MESSAGES } from '~/constants/messages'
import { sendFileFromS3 } from '~/utils/S3'

// import formidable from 'formidable'
export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadImage(req)
  return res.json({
    msg: 'Upload successfully',
    result
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  sendFileFromS3(res, `images/${name}`)

  // console.log(name)
  // console.log(path.resolve(UPLOAD_IMAGE_DIR, name))
  // return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
  //   if (err) {
  //     return res.status(HTTP_STATUS.NOT_FOUND).json({
  //       msg: 'Image not found'
  //     })
  //   }
  // })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadVideo(req)
  return res.json({
    message: 'Upload successfully',
    result
  })
}

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1Mb = 10^6 bytes
  // Dung lượng video
  const videoSize = fs.statSync(videoPath).size

  // Dung lượng mỗi phần stream

  const chunkSize = 10 ** 6 // 1MB

  //lấy giá trị bytes bắt đâu

  const start = Number(range.replace(/\D/g, ''))

  //lấy giá trị bytes kết thúc

  const end = Math.min(start + chunkSize, videoSize - 1)

  //Dung lượng thực tế cho mỗi đoạn video stream
  // thường đây sẽ là chunkSize, ngoại trừ đoạn cuối

  const contentLength = end - start + 1

  const mime = (await import('mime')).default

  const contentType = mime.getType(videoPath) || 'video/*'

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)

  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}

export const serveVideoS3Controller = async (req: Request, res: Response) => {
  const { name } = req.params
  sendFileFromS3(res, `videos/${name}`)
}

export const serveM3U8Controller = async (req: Request, res: Response) => {
  const { id } = req.params
  sendFileFromS3(res, `videos-hls/${id}/master.m3u8`)
  // return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
  //   if (err) {
  //     return res.status(HTTP_STATUS.NOT_FOUND).json({
  //       msg: 'Video not found'
  //     })
  //   }
  // })
}

export const serveSegmentController = async (req: Request, res: Response) => {
  const { id, v, segment } = req.params
  console.log(id, v, segment)
  sendFileFromS3(res, `videos-hls/${id}/${v}/${segment}`)
  // return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
  //   if (err) {
  //     return res.status(HTTP_STATUS.NOT_FOUND).json({
  //       msg: 'Video not found'
  //     })
  //   }
  // })
}

export const uploadVideoHLSController = async (req: Request, res: Response) => {
  const result = await mediasService.UploadVideoHLS(req)
  return res.json({
    msg: 'Upload successfully',
    result
  })
}

export const videoStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await mediasService.getVideoStatus(id)
  return res.json({
    message: USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESS,
    result
  })
}
