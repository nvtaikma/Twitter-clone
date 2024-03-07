import { Router } from 'express'
import { get } from 'lodash'
import { UnBookmarkTweetController, bookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { getConversationController } from '~/controllers/conversation.controller'
import { UnLikeTweetController, likeTweetController } from '~/controllers/like.controllers'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator, paginationValidator, tweetIdValidator } from '~/middlewares/Tweet.middlewares'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationRoute = Router()

/**
 * Description: get conversation
 * Path: /receive/:receiver_id
 * Method: GET
 * Body: { receiver_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
conversationRoute.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationController)
)

export default conversationRoute
