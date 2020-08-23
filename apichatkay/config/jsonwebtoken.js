const jwt  = require('jsonwebtoken')
let secret = 'fdslbjgkmqhfbbgjdwgdvcxw';
module.exports = {
  genererToken : (body, cb) => {
    let token = jwt.sign(body, secret ,{ expiresIn : '24h' })
    cb(token)
  },
  verifyToken : (token, cb) => {
    try {
        let jwtToken = jwt.verify(token, secret)
        cb(null, jwtToken)
    } catch (e) {
        cb(e, null)
    }
  },
  isAuth : (token) => {
    try {
        let jwtToken = jwt.verify(token, secret)
        if( jwtToken == undefined ){
          return false
        }else {
          return true
        }
    } catch (e) {
        return false
    }
  }
};
