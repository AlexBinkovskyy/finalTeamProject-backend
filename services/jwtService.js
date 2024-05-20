import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.ACCESS_SECRET_KEY
const JWT_EXPIRES_IN = '24h'

export const signToken = id => {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  return token
}

export const checkToken = token => {
  if (!token) return
  try {
    const { id } = jwt.verify(token, JWT_SECRET)
    return id
  } catch (error) {
    console.log(error)
    return
  }
}
