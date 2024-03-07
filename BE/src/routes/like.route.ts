import { Router } from 'express'
import { UnBookmarkTweetController, bookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { UnLikeTweetController, likeTweetController } from '~/controllers/like.controllers'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator, tweetIdValidator } from '~/middlewares/Tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likeRouter = Router()

/**
 * Description: bookmark Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/**
 * Description: unBookmark Tweet
 * Path: /:tweetId
 * Method: delete
 * Body: { tweet_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
likeRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(UnLikeTweetController)
)

export default likeRouter
