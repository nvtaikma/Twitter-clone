import Bookmark from '~/models/schemas/Bookmarks.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Like from '~/models/schemas/Like.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.like.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
  async UnLikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.like.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}
const likeService = new LikeService()
export default likeService
