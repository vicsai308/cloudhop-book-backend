//import JWT package
const jwt = require('jsonwebtoken');

// JWT secret key/signature
const JWT_SECRET = 'Top$ecret'

// this is a middleware which is executed brfor endpoint
// get the user from jwt token and add id to req object
const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using valid token" })
    }

    try {
        // compare token with jwt secret if its correct decode JWT token to user id
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; //contains user id
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token" })
    }
}

module.exports = fetchuser;