export const generateTokenFromHeader = (req) => {
    // get token from the header
    const token = req?.headers?.authorization?.split(" ")[1];
    if(token === undefined) {
        return false;
    } else {
        return token;
    }
}