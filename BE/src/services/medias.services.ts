import { EncodingStatus, MediaType } from './../constants/enums'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { getFiles, getNameFromFullName, handleUploadHLSVideo, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { envConfig, isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import fsPromises from 'fs/promises'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/videoStatus.schema'
import { USERS_MESSAGES } from '~/constants/messages'
import { uploadFileToS3 } from '~/utils/S3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { get } from 'lodash'
import { rimrafSync } from 'rimraf'

config()

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    const idName = getNameFromFullName(item.split(/\/|\\/).pop() as string)
    await databaseService.videoStatus.insertOne(new VideoStatus({ name: idName, status: EncodingStatus.PENDING }))
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullName(videoPath.split(/\/|\\/).pop() as string)
      const mime = (await import('mime')).default

      await databaseService.videoStatus.updateOne(
        { name: idName },
        { $set: { status: EncodingStatus.PROCESSING }, $currentDate: { updated_at: true } }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromises.unlink(videoPath)

        const files = await getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))

        await Promise.all(
          files.map(async (filePath: any) => {
            let text = filePath.replace(path.resolve(`${UPLOAD_VIDEO_DIR}`), '')
            if (text.startsWith('\\')) {
              text = '/' + text.substring(1)
            }

            const fileName = 'videos-hls' + text

            // console.log('fileName', fileName)
            await uploadFileToS3({
              filePath,
              fileName,
              contentType: mime.getType(filePath) as string
            })
          })
        )
        rimrafSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
        console.log('----------------------------end encode success----------------------------')
        await databaseService.videoStatus.updateOne(
          { name: idName },
          { $set: { status: EncodingStatus.SUCCESS }, $currentDate: { updated_at: true } }
        )
        console.log('----------------------------end encode success----------------------------')
      } catch (error) {
        const idName = getNameFromFullName(videoPath.split(/\/|\\/).pop() as string)
        await databaseService.videoStatus
          .updateOne({ name: idName }, { $set: { status: EncodingStatus.FAILED }, $currentDate: { updated_at: true } })
          .catch((err) => console.log(err))
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('end encode all video')
    }
  }
}

const queue = new Queue()
class MediasService {
  async UploadImage(req: Request) {
    const mime = (await import('mime')).default
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`

        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)

        const s3Result = await uploadFileToS3({
          fileName: 'images/' + newFullFileName,
          filePath: newPath,
          contentType: mime.getType(newPath) as string
        })

        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])

        //return thẳng về file s3
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }

        //return file từ server
        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/static/image/${newFullFileName}`
        //     : `http://localhost:4000/static/image/${newFullFileName}`,
        //   type: MediaType.Image
        // }
      })
    )
    return result
  }

  async UploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const mime = (await import('mime')).default
    const Result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          fileName: 'videos/' + file.newFilename,
          filePath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })
        fsPromises.unlink(file.filepath)

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
      })
    )
    return Result

    // const { newFilename } = files[0]
    // return {
    //   url: isProduction
    //     ? `${envConfig.host}/static/video/${newFilename}`
    //     : `http://localhost:4000/static/video/${newFilename}`,
    //   type: MediaType.Video
    // }
  }

  async UploadVideoHLS(req: Request) {
    const files = await handleUploadHLSVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hsl/${newName}/master.m3u8`
            : `http://localhost:4000/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const videoStatus = await databaseService.videoStatus.findOne({ name: id })
    if (!videoStatus) {
      return {
        message: USERS_MESSAGES.VIDEO_NOT_FOUND
      }
    }
    return videoStatus
  }
}

const mediasService = new MediasService()
export default mediasService
