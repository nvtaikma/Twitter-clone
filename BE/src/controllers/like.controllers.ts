import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'
import { BOOKMARK_MESSAGES, LIKE_MESSAGES } from '~/constants/messages'
import { likeTweetRequestBody } from '~/models/requests/like.requests'
import likeService from '~/services/like.services'

export const likeTweetController = async (req: Request<ParamsDictionary, any, likeTweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, req.body.tweet_id)
  return res.json({
    message: LIKE_MESSAGES.LIKE_SUCCESSFULLY,
    result
  })
}

export const UnLikeTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.UnLikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESSFULLY
  })
}
