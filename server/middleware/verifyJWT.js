import jwt from 'jsonwebtoken'

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @example returns req.jwt_user with the decoded access token containing the 'userId' and 'email'
 */
const verifyJWT = (req, res, next) => {
    // get the authorization header from the request
    console.log("AYOO",req.headers)
    const authHeader = req.headers['authorization']
    // split the header into an array of strings, and get the second value, the access token
    const token = authHeader?.split(' ')[1]

    console.log("AYOO",token)

    // if there is no token, return an error
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        // verify the token, store the decoded token in a variable
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("YOOOO",decodedToken)
        // if the token is not an access token, return an error
        if (decodedToken.type !== 'access') {
            return res.status(401).json({ message: 'Not an access token' })
        }

        // set the user property of the request to the decoded token
        req.jwt_user = decodedToken
        // call the next middleware
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        
        return res.status(400).json({ message: 'Invalid token' })
    }
}

export default verifyJWT