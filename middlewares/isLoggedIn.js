import { generateTokenFromHeader } from "../utils/generateTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = generateTokenFromHeader(req);
    // get verified token 
    const decodedUser = verifyToken(token);
    if (!decodedUser) {
        throw new Error("Invalid/Expired token, please login again");
    } else {
        req.userAuthId = decodedUser?.id;
        next();
    }
}