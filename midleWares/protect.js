import HttpErrors from '../helpers/HttpError.js'
import { User } from '../models/userModel.js'
import { asyncWrapper } from './asyncWrapper.js'
import { checkToken } from '../services/jwtService.js'
import { checkTokenPlusUser } from '../services/userService.js'

export const protect = asyncWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ') &&
    req.headers.authorization.split(' ')[1]

  const userId = checkToken(token)
  if (!userId) return next(HttpErrors(401))

  const currentUser = await checkTokenPlusUser(userId, token)

  // const currentUser = await User.findById(userId)
  if (!currentUser) return next(HttpErrors(401))

  // checkTokenPlusUser()

  req.user = currentUser

  next()
})
