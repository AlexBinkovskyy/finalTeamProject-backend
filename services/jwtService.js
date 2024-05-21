import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.ACCESS_SECRET_KEY


export const checkToken = token => {
  if (!token) return
  try {
    const { id } = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
    return id
  } catch (error) {
    console.log( error)
  }
}
