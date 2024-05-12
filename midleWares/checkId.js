import { isValidObjectId } from 'mongoose'
import HttpErrors from '../helpers/HttpError.js'

export const checkId = (req, res, next) => {
  const { id } = req.params
  if (!id || !isValidObjectId(id)) {
    next(HttpErrors(400, 'Invalid ID'))
    return
  }
  next()
}
