import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import exp from 'constants'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { envConfig } from '~/constants/config'
config()
const verifyEmailTemplate = fs.readFileSync(path.resolve('src/template/verifyEmail.html'), 'utf8')
// Create SES service object.
const sesClient = new SESClient({
  region: envConfig.awsRegion as string,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey as string,
    accessKeyId: envConfig.awsAccessKeyId as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: envConfig.sesFromAddress as string,
    toAddresses: toAddress,
    body,
    subject
  })

  return sesClient.send(sendEmailCommand)
}

// sendVerifyEmail('nvtaikma@gmail.com', 'Tiêu đề email', '<h1>Nội dung email</h1>')

export const sendVerifyRegisterEmail = async (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify Email',
    template
      .replace('{{title}}', 'Please verify your email')
      .replace('{{content}}', 'Click the button below to verify your email.')
      .replace('{{link}}', `${envConfig.clientUrl}/verify-email?token=${email_verify_token}`)
      .replace('{{titleLink}}', 'Verify Email')
  )
}

export const sendForgotPasswordEmail = async (
  toAddress: string,
  forgot_password_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Reset Password',
    template
      .replace('{{title}}', 'Please reset your password')
      .replace('{{content}}', 'Click the button below to reset your password.')
      .replace('{{link}}', `${envConfig.clientUrl}/forgot-password?token=${forgot_password_token}`)
      .replace('{{titleLink}}', 'reset password')
  )
}
