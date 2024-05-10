import HttpErrors from '../helpers/HttpError.js'
import { User } from '../models/userModel.js'
import { asyncWrapper } from './asyncWrapper.js'
import { checkToken } from '../services/jwtService.js'

export const protect = asyncWrapper(async (req, res, next) => {
	const token =
		req.headers.authorization?.startsWith('Bearer ') &&
		req.headers.authorization.split(' ')[1]

	const userId = checkToken(token)
	// const userId = '663dfa830247bf578218088e'
	if (!userId) return next(HttpErrors(401))
	console.log(userId)

	const currentUser = await User.findById(userId)
	if (!currentUser) return next(HttpErrors(401))

	req.user = currentUser

	next()
})
