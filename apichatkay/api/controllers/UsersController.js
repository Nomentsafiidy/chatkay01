/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jsonwebtoken  = require('./../../config/jsonwebtoken')
module.exports = {
  index : function (req, res) {
    if (jsonwebtoken.isAuth(req.headers.authorization)) {
      let criteria
      if (req.body.filter == '') {
        criteria = {
          or : [
            { email: { contains: req.body.email } },
            { nom: { contains: req.body.email } }
          ]
          }
      }else {
        criteria = {
          or : [
            { email: { contains: req.body.email }, privilege : req.body.filter },
            { nom: { contains: req.body.email }, privilege : req.body.filter }
          ]
          }
      }
      Users.find(criteria).exec(function (err,users) {
        if (err) res.send(500, {message: 'Error database'})
        res.json({message : true, users: users})
      });
    }else {
      res.json({message: 'Accées refuser'})
    }
  },
  create : function(req,res){
    Users.findOne({email: req.body.email}).exec(function(err, user){
      if (err)return res.send(500, {message: 'Error database'})
      //verification user
      if(user == undefined){
        let photo
        if (req.body.extension == 'null') {
          photo = 'default.png'
        }else {
          //upload file
          photo = req.body.email+'.'+req.body.extension
          req.file('photo').upload({
              dirname : 'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/pdp'
            },
            function(err,file){
              if (err) { res.json({message: 'Echec de l\'upload du fichier'}) }
              const fs = require('fs')
              fs.rename(file[0].fd,'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/pdp/'+photo, (err)=>{
                if (err) console.log(err)
              })
          })
        }
        //blabla vao2
        jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
          let user
          if (err == null) {
            if (userToken.privilege == 'admin') {
              user = {
                email : req.body.email,
                nom : req.body.nom,
                telephone : req.body.telephone,
                privilege : req.body.privilege,
                password : req.body.password,
                solde: 0,
                photo: photo,
                restaurant : req.body.restaurant,
                latitude : req.body.latitude,
                longitude : req.body.longitude,
                moto : req.body.moto
              }
            }
          }else {
            user = {
              email : req.body.email,
              nom : req.body.nom,
              telephone : req.body.telephone,
              privilege : 'client',
              password : req.body.password,
              solde: 0,
              photo: photo
            }
          }
          //insert to DB
          Users.create(user).exec(function(err){
            if(err)return res.status(400).json(err)
            return res.status(200).json({
              message : true
            })
          })
        })
        //end
      }else {
        res.json({
          message : 'email dejas utiliser'
        })
      }
    })
  },
  delete : function(req,res){
    if (jsonwebtoken.isAuth(req.headers.authorization)) {
    let email = req.body.email
    console.log("io le mail",email);
    Plats.destroy({email: email}).exec(function(err) {
      if(err)return res.send(500, {message : 'Error database'})
      })
    Users.destroy({email: email}).exec(function(err) {
      if(err)return res.send(500, {message : 'Error database'})
      return res.json({
        message : true
        })
      })
    }else {
      res.json({ message : 'access refuser' })
    }
  },
  update : function(req,res){
    if (jsonwebtoken.isAuth(req.headers.authorization)) {
      let photo
      if (req.body.extension == 'null') {
        photo = req.body.photo
      }else {
        let chiffre =   parseInt((Math.random()*100), 10)
        photo = req.body.email+chiffre+'.'+req.body.extension
        //upload file
         req.file('photoM').upload({
            dirname : 'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/pdp'
          },
          function(err,file){
            if (err) { res.json({message: 'Echec de l\'upload du fichier'}) }
            console.log(file);
            const fs = require('fs')
            fs.rename(file[0].fd,'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/pdp/'+photo, (err)=>{
              if (err) console.log(err)
            })
        })
      }
      let user
      if(req.body.privilege == 'restaurateur'){
        user = {
          nom : req.body.nom,
          telephone : req.body.telephone,
          privilege : req.body.privilege,
          password : req.body.password,
          solde: 0,
          photo: photo,
          restaurant : req.body.restaurant,
          latitude : req.body.latitude,
          longitude : req.body.longitude,
          moto : ''
        }
      }else if(req.body.privilege == 'livreur'){
        user = {
          nom : req.body.nom,
          telephone : req.body.telephone,
          privilege : req.body.privilege,
          password : req.body.password,
          solde: 0,
          photo: photo,
          restaurant : '',
          latitude : 0,
          longitude : 0,
          moto : req.body.moto
        }
      }else {
        user = {
          nom : req.body.nom,
          telephone : req.body.telephone,
          privilege : req.body.privilege,
          password : req.body.password,
          solde: 0,
          photo: photo,
          restaurant : '',
          latitude : 0,
          longitude : 0,
          moto : ''
        }
      }
      Users.update({email: req.body.email}, user).exec(function(err){
        if(err)return res.json(err)
        return res.json({
          message : true
        })
      })
    }else {
      res.json({ message : 'access refuser' })
    }
  }
};
