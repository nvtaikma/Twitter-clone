import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import usersRoute from './routes/users.route'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRoute from './routes/medias.route'
import { initFolder } from './utils/file'
import staticRoute from './routes/static.route'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import cors, { CorsOptions } from 'cors'
import tweetsRouter from './routes/Tweet.route'
import bookmarksRouter from './routes/bookmarks.route'
import likeRouter from './routes/like.route'
import searchRouter from './routes/search.route'
import { createServer } from 'http'
import conversationRoute from './routes/conversation.route'
import initSocket from './utils/socket'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import helmet from 'helmet'
import { envConfig, isProduction } from './constants/config'
import rateLimit from 'express-rate-limit'
// import '~/utils/fake_data'
// import '~/utils/S3'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    persistAuthorization: true
  },
  apis: ['./openapi/*.yaml'] // files containing annotations as above
}
const openapiSpecification = swaggerJsdoc(options)

databaseService.connect().then(() => {
  databaseService.indexUser()
  databaseService.indexRefreshToken()
  databaseService.indexVideoStatus()
  databaseService.indexFollower()
  databaseService.indexTweet()
})
const app = express()

const port = envConfig.port
const httpServer = createServer(app)

// create folder uploads
initFolder()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // include headers
  legacyHeaders: false // Disable X-RateLimit headers
})
app.use(limiter)
app.use(helmet())
const corsOptions: CorsOptions = {
  // origin: isProduction ? envConfig.clientUrl : '*',
  origin: '*'
}
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRoute)
app.use('/medias', mediasRoute)
app.use('/static', staticRoute)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/like', likeRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationRoute)
app.use(defaultErrorHandler)

initSocket(httpServer)
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
