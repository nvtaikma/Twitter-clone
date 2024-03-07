import { Request, Response } from 'express'
import { getConversationParams } from '~/models/requests/conversation.requests'
import conversationService from '~/services/conversation.services'

export const getConversationController = async (req: Request<getConversationParams>, res: Response) => {
  const sender_id = req.decoded_authorization?.user_id as string
  const { receiver_id } = req.params
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const result = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })
  res.json({
    message: 'Get conversation successfully',
    result: {
      conversations: result.conversations,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
