import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
  followController,
  unFollowController,
  changePasswordController,
  loginGoogleController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '../utils/handlers'
import { update } from 'lodash'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
const usersRoute = Router()

/**
 * Description: Login a user
 * Path: /login
 * Method: Post
 * Body: { email: string, password: string }
 **/
usersRoute.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Login oauth google
 * Path: /oauth/google
 * Method: Post
 **/
usersRoute.get('/oauth/google', wrapRequestHandler(loginGoogleController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: Post
 * Body: { name: string, email: string, password: string, date_of_birth: ISO8601, confirm_password: string}
 **/
usersRoute.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: Post
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 * */
usersRoute.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: Post
 * Body: { refresh_token: string }
 * */
usersRoute.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Verify email when user register
 * Path: /verify-email
 * Method: Post
 * Body: { refresh_token: string }
 * */
usersRoute.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Resend email verify token
 * Path: /resend-verify-email
 * Method: Post
 * Headers: { Authorization: Bearer <access_token> }
 * Body: {}
 * */
usersRoute.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: forgot password
 * Path: /forgot-password
 * Method: Post
 * Body: {email: string}
 * */
usersRoute.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: Post
 * Body: {forgot_password_token: string}
 * */
usersRoute.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: reset password
 * Path: /reset-password
 * Method: Post
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 * */
usersRoute.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Headers: { Authorization: Bearer <access_token> }
 * */
usersRoute.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Headers: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 * */
usersRoute.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 * */
usersRoute.get('/:username', wrapRequestHandler(getProfileController))
export default usersRoute

/**
 * Description: follow user
 * Path: /follow
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { user_id: string  }
 * */
usersRoute.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: unFollow user
 * Path: /follow/:user_id
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 * */
usersRoute.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/**
 * Description: change password
 * Path: /change-password
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 * */
usersRoute.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
