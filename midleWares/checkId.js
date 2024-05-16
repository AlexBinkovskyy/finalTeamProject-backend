import { isValidObjectId } from 'mongoose'
import HttpError from '../helpers/HttpError.js'

export const checkId = (req, res, next) => {
  const { id } = req.params
  if (!id || !isValidObjectId(id)) {
    next(HttpError(400, 'Invalid ID'))
    return
  }
  next()
}
