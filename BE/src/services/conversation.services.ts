import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class ConversationService {
  async getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    // console.log('receiver_id', receiver_id)
    // console.log('sender_id', sender_id)

    const [conversations, total] = await Promise.all([
      await databaseService.conversation
        .find(match)
        .sort({ created_at: -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray(),
      await databaseService.conversation.countDocuments(match)
    ])
    return {
      conversations,
      total
    }
  }
}
const conversationService = new ConversationService()
export default conversationService
