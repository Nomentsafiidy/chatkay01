/**
 * PlatsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jsonwebtoken  = require('./../../config/jsonwebtoken')
module.exports = {
  get : (req,res) =>{
    //blabla vao2
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        let criteria
        if (req.body.filter == '') {
          criteria = {
              or : [
                { email: userToken.email, nom : { contains: req.body.nom } } ,
                { email: userToken.email, description : { contains: req.body.nom } }
              ]
            }
        }else if(req.body.filter == 'prix') {
          criteria = {
            where : { email: userToken.email, prix : { '<=' : req.body.nom} }
          }
        }else if(req.body.filter == 'nom') {
          criteria = {
            where : { email: userToken.email, nom : { contains: req.body.nom } }
          }
        }else {
          criteria = {
            where : { email: userToken.email, description : { contains: req.body.nom } }
          }
        }
        Plats.find(criteria).exec(function (err,plats) {
          if (err) res.status(500).json({message: 'Error database'})
          res.json({message : true, plats: plats})
        });
      }else {
        res.json({
          message : 'Access refuser'
        })
      }
    })
  },
  create : (req, res) =>{
    //blabla vao2
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        Platid.find().exec(function (err,platid) {
          if (err) console.log(err);
          let codeplat = platid[0].codeplat
          codeplat += 1
          Platid.update({id: platid[0].id}, {codeplat: codeplat}).exec(function (err) {
            if (err) console.log(err)
          })
          let photo = 'P'+codeplat+'.'+req.body.extension
          //upload
          req.file('photo').upload({
              dirname : 'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/plat'
            },
            function(err,file){
              if (err) { res.json({message: 'Echec de l\'upload du fichier'}) }
              console.log('upload', file);
              const fs = require('fs')
              fs.rename(file[0].fd,'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/plat/'+photo, (err)=>{
                if (err) console.log(err)
                console.log('renomer .....');
                let plat = {
                  codeplat: 'P'+codeplat,
                  email: userToken.email,
                  nom: req.body.nom,
                  description: req.body.description,
                  photo: photo,
                  prix: req.body.prix,
                  tomenu : false,
                  users : userToken.id
                }
                //insert plat to DB
                Plats.create(plat).exec(function(err){
                  if(err)return res.status(500).json(err)
                  console.log('las le reponse');
                  return res.status(200).json({
                    message : true
                  })
                })
              })
          })
        })
      }else {
        res.json({message : 'Accées refuser'})
      }
    })
  },
  update : (req,res) =>{
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        let plat
        if (req.body.extension == 'null') {
          plat = {
            nom: req.body.nom,
            description: req.body.description,
            prix: req.body.prix
          }
          console.log('plarezr 1', plat);
          Plats.update({codeplat: req.body.codeplat}, plat).exec(function(err){
            if(err)return res.json(err)
            return res.json({
              message : true
            })
          })
        }else {
          let chiffre =   parseInt((Math.random()*100), 10)
          let photo = req.body.codeplat+chiffre+'.'+req.body.extension
          //upload file
           req.file('photo').upload({
              dirname : 'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/plat'
            },
            function(err,file){
              if (err) { res.json({message: 'Echec de l\'upload du fichier'}) }
              console.log(file);
              const fs = require('fs')
              fs.rename(file[0].fd,'C:/Users/Nomentsafidy/Desktop/licence/projet/apichatkay/assets/plat/'+photo, (err)=>{
                if (err) console.log(err)
                plat = {
                  nom: req.body.nom,
                  description: req.body.description,
                  prix: req.body.prix,
                  photo : photo
                }
                Plats.update({codeplat: req.body.codeplat}, plat).exec(function(err){
                  if(err)return res.json(err)
                  return res.json({
                    message : true
                  })
                })
              })
          })
        }
      }else {
        res.json({
          message : 'Access refuser'
        })
      }
    })
  },
  delete : (req,res) =>{
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        Plats.destroy({email : userToken.email, codeplat : req.body.codeplat}).exec((err)=>{
          if(err)console.log(err);
          res.json({
            message : true
          })
        })
      }else {
        res.json({
          message : 'Acces refuser'
        })
      }
    })
  },
  toMenu : (req,res) => {
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        Plats.update({codeplat: req.body.codeplat}, {tomenu : req.body.tomenu}).exec(function(err){
          if(err)return res.json(err)
          return res.json({
            message : true
          })
        })
      }else {
        res.json({
          message : 'Access refuser'
        })
      }
    })
  },
  menu : (req,res) => {
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        Plats.find({
          where : { email: userToken.email, tomenu : true, nom : { contains : req.body.nom } }
        }).exec(function (err,plats) {
          if (err) res.status(500).json({message: 'Error database'})
          res.json({message : true, plats: plats})
        });
      }else {
        res.json({
          message : 'Access refuser'
        })
      }
    })
  },
  allmenu : (req,res) => {
    jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
      if (err == null) {
        let criteria
        if (req.body.filter == '') {
          criteria = {
              or : [
                { tomenu: true, nom : { contains: req.body.nom } } ,
                { tomenu: true, description : { contains: req.body.nom } }
              ]
            }
        }else if(req.body.filter == 'prix') {
          criteria = {
            where : { tomenu: true }
          }
        }else if(req.body.filter == 'nom') {
          criteria = {
            where : { tomenu: true, nom : { contains: req.body.nom } }
          }
        }else {
          criteria = {
            where : { tomenu: true, description : { contains: req.body.nom } }
          }
        }
        Plats.find(criteria).populate('users').exec(function (err,plats) {
          if (err) res.status(500).json({message: 'Error database'})
          res.json({message : true, plats: plats})
        });
      }else {
        res.json({
          message : 'Access refuser'
        })
      }
    })
  }
};
