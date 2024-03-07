import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import { get } from 'lodash'
import path, { resolve } from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    maxFileSize: 1024 * 5 * 1024, // 1MB
    maxFields: 1024 * 5 * 1024 * 4,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 1024 * 50 * 1024, // 1MB
    maxFields: 1024 * 50 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video) {
        return reject(new Error('File is empty'))
      }
      const video = files.video as File[]
      video.forEach((file) => {
        const ext = getExtensionFromFullName(file.originalFilename as string)
        fs.renameSync(file.filepath, path.resolve(UPLOAD_VIDEO_DIR, file.filepath + '.' + ext))
        file.newFilename = file.newFilename + '.' + ext
        file.filepath = file.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const handleUploadHLSVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  fs.mkdirSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR, idName),
    maxFiles: 1,
    maxFileSize: 1024 * 50 * 1024, // 1MB
    maxFields: 1024 * 50 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function (filename, ext) {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video) {
        return reject(new Error('File is empty'))
      }
      const video = files.video as File[]
      video.forEach((file) => {
        const ext = getExtensionFromFullName(file.originalFilename as string)
        fs.renameSync(file.filepath, path.resolve(UPLOAD_VIDEO_DIR, file.filepath + '.' + ext))
        file.newFilename = file.newFilename + '.' + ext
        file.filepath = file.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  const nameArr = fullName.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtensionFromFullName = (fullName: string) => {
  const name = fullName.split('.')
  return name[name.length - 1]
}

export const getFiles = async (dir: string, files: string[] = []) => {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir)
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files)
    } else {
      // If it is a file, push the full path to the files array
      files.push(name)
    }
  }
  return files
}

// console.log(getFiles(path.resolve(UPLOAD_VIDEO_DIR, 'TaN-VK2Oc8KQhIqIUdOoC')))
