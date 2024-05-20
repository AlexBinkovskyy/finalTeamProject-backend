import HttpError from '../helpers/HttpError.js'
import { asyncWrapper } from './asyncWrapper.js'
import { checkToken } from '../services/jwtService.js'
import { checkTokenPlusUser } from '../services/userService.js'

export const protect = asyncWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ') &&
    req.headers.authorization.split(' ')[1]

  const userId = checkToken(token)
  if (!userId) return next(HttpError(401))
  
  const currentUser = await checkTokenPlusUser(userId, token)
  if (!currentUser) return next(HttpError(401))
  req.user = currentUser
  next()
})
