import HttpError from '../helpers/HttpError.js'
import jwt from "jsonwebtoken";
import { checkRefreshTokenPlusUser, checkTokenPlusUser, deleteTokenFromUser } from '../services/userService.js';

export const checkAuthenticity = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401, "Not authorized"));
  try {
    const { id } = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await checkTokenPlusUser(id, token);
    if (!user) throw HttpError(401, "Not authorized");
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export const checkAuthenticityAndLogout = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401));
  try {
    const { id } = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await checkTokenPlusUser(id, token);
    
    if (!user) throw HttpError(401, "Not authorized");
    if (!(await deleteTokenFromUser(user))) next(HttpError(500));
    res.status(204).end();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export const checkRefreshAuthenticity = async (req, res, next) => {
  console.log(req);
  const {refreshToken: oldRefreshToken} = req.cookies
  // req.cookies.refreshToken
  try {
    const { id } = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET_KEY);
    const user = await checkRefreshTokenPlusUser(id, oldRefreshToken);
    if (!user) throw HttpError(401, "Not authorized");
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(403, "Invalid token"));
  }
}