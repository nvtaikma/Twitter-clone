import { S3 } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { Upload } from '@aws-sdk/lib-storage'
import fs, { createReadStream } from 'fs'
import path from 'path'
import { Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { envConfig } from '~/constants/config'

config()
const s3 = new S3({
  region: envConfig.awsRegion as string,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey as string,
    accessKeyId: envConfig.awsAccessKeyId as string
  }
})
// s3.listBuckets({}).then((data) => console.log(data.Buckets))

export const uploadFileToS3 = async ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: envConfig.s3BucketName as string,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType
    },

    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })

  return parallelUploads3.done()
}

export const sendFileFromS3 = async (res: Response, filepath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: envConfig.s3BucketName as string,
      Key: filepath
    })
    res.set('content-type', 'image/Jpeg')
    ;(data.Body as any).pipe(res)
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).send('Not found')
  }
}
