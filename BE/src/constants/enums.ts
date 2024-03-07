import exp from 'constants'

export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  emailVerifyToken
}

export enum MediaType {
  Image,
  Video,
  HLS
}

export enum EncodingStatus {
  PENDING,
  PROCESSING,
  SUCCESS,
  FAILED
}

export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum peopleFollow {
  Anyone = '0',
  Following = '1'
}
