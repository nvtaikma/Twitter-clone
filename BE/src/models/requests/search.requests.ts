import { MediaTypeQuery, peopleFollow } from '~/constants/enums'

import { Pagination } from './Tweet.requests'
import { Query } from 'express-serve-static-core'

export interface searchQuery extends Pagination, Query {
  content: string
  media_type?: MediaTypeQuery
  people_follow: peopleFollow
}
