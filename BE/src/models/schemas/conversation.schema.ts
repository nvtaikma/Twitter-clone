import { ObjectId } from 'mongodb'

interface ConversationType {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  updated_at?: Date
  created_at?: Date
}

export default class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  updated_at?: Date
  created_at?: Date
  constructor({ _id, sender_id, receiver_id, content, updated_at, created_at }: ConversationType) {
    this._id = _id
    this.sender_id = sender_id
    this.receiver_id = receiver_id
    this.content = content
    this.updated_at = updated_at || new Date()
    this.created_at = created_at || new Date()
  }
}
