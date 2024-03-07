import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { searchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.services'
import { audienceValidator } from '../middlewares/Tweet.middlewares'
import { MediaTypeQuery } from '~/constants/enums'
export const searchController = async (req: Request<ParamsDictionary, any, any, searchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await searchService.search({
    limit,
    page,
    content: req.query.content,
    media_type: req.query.media_type as MediaTypeQuery,
    people_follow: req.query.people_follow,
    user_id: req.decoded_authorization?.user_id as string
  })
  res.json({
    message: 'Search Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total: Math.ceil(result.total / limit)
    }
  })
}
