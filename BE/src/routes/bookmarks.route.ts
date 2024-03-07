import { Router } from 'express'
import { UnBookmarkTweetController, bookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator, tweetIdValidator } from '~/middlewares/Tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouter = Router()

/**
 * Description: bookmark Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * Description: unBookmark Tweet
 * Path: /:tweetId
 * Method: delete
 * Body: { tweet_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(UnBookmarkTweetController)
)

export default bookmarksRouter
