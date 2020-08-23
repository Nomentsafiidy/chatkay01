/**
 * AuthentificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jsonwebtoken  = require('./../../config/jsonwebtoken')

module.exports = {
  index : (req, res) => {
    Users.findOne({email: req.body.email}).exec(function(err, user){
      if (err)return res.send(500, {message: 'Error database'})
      if(user == undefined){
        res.json({ message : 'mail error' })
      }else {
        if (req.body.password == user.password) {
          let body = {
            id : user.id,
            email : user.email,
            privilege : user.privilege,
            nom : user.nom,
            telephone : user.telephone,
            solde : user.solde,
            photo : user.photo
          }
          jsonwebtoken.genererToken(body, function(token){
            res.json({
              message : true,
              token : token,
              privilege : user.privilege
            })
          })
        }else {
          res.json({ message : 'Mot de passe incorrect' })
        }
      }
    })
  },
  verify : (req, res) => {
    jsonwebtoken.verifyToken(req.headers.authorization, (err,user) => {
      if (err == null) {
        res.json({
          message : true,
          ...user
        })
      }else {
        res.json({
          message : false
        })
      }
    })
  }
};
