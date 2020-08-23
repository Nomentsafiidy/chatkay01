/**
 * CommandesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jsonwebtoken  = require('./../../config/jsonwebtoken')
module.exports = {


    connect : function(req, res){
        sails.sockets.join(req, req.body.channel)
        return res.ok()
    },
    new_commande : (req,res) => {
      Commandeid.find().exec(function (err,commandeid) {
        if (err) console.log(err);
        let codecommande = commandeid[0].codecommande
        codecommande += 1
        Commandeid.update({id: commandeid[0].id}, {codecommande: codecommande}).exec(function (err) {
          if (err) console.log(err)
        })
        codecommande = 'C0'+codecommande
        sails.sockets.broadcast(req.body.channel, 'new_commande', {commandes  : req.body.commandes, codecommande : codecommande, accepted : false, client_channel : req.body.client_channel, paid : false, codelivraison : '', livreur : ''})
        return res.ok()
      })
    },
    reply_commande : (req, res) => {
        sails.sockets.broadcast(req.body.channel, 'reply', { message : req.body.message, codecommande : req.body.codecommande })
        return res.ok()
    },
    paid_commande : (req, res) => {
      jsonwebtoken.verifyToken(req.body.authorization, (err,userToken) => {
        if (err == null) {
          let codelivraison = ''
          let codeconfirmation = ''
          if (req.body.paid) {
            //apidirina anaty base de donné
            codelivraison = parseInt((Math.random()*1000000), 10)
            codeconfirmation = parseInt((Math.random()*1000000), 10)
            let cmd = {
                        codecommande : req.body.codecommande,
                        codelivraison : codelivraison,
                        codeconfirmation : codeconfirmation,
                        status : false,
                        latitude : req.body.latitude,
                        longitude : req.body.longitude,
                        indice : req.body.indice,
                        livreur : null,
                        client : userToken.id
                      }
            Commandes.create(cmd).exec(function(err){
              if(err)return res.json(err)
              //recuperer id commandes
              Commandes.findOne({codecommande : req.body.codecommande}).exec(function(err,commande){
                if(err)return res.json(err)
                console.log("id" , commande.id);
                console.log(req.body.commandes);
                req.body.commandes.forEach((item, i) => {
                  Commandesplats.create({commandes : commande.id, plats : item.id, quantity : item.quantity}).exec(function(err){
                    if(err)return res.json(err)
                  })
                });
              })
            })

            sails.sockets.broadcast('livreur', 'new_livraison', {codecommande : req.body.codecommande})
          }
          sails.sockets.broadcast(req.body.codecommande, 'paid', { codecommande : req.body.codecommande, paid : req.body.paid, codelivraison : codelivraison })
          // sails.sockets.broadcast(req.body.codecommande, 'paid', { codecommande : req.body.codecommande, codelivraison: codelivraison,paid : req.body.paid })
          res.json({
            message : req.body.paid,
            codeconfirmation : codeconfirmation
          })
        }else {
          res.json({
            message : 'Access refuser'
          })
        }
      })
    },
    do_livraison : (req,res) => {
      jsonwebtoken.verifyToken(req.body.authorization, (err,userToken) => {
        if (err == null) {
          Commandes.update({codecommande: req.body.codecommande}, {livreur : userToken.id}).exec(function(err){
            sails.sockets.broadcast(req.body.codecommande, 'delivering', { livreur : userToken  })
            res.json({
              message : true
            })
          })
        }else {
          res.json({
            message : 'Accées non autoriser'
          })
        }
      })
    },
    get : (req,res) => {
      jsonwebtoken.verifyToken(req.headers.authorization, (err,userToken) => {
        if (err == null) {
          Commandes.findOne({codecommande : req.body.codecommande}).populateAll().exec(function (err,commande) {
            Users.findOne({id : commande.plats[0].users}).exec(function (err,restaurateur) {
              Commandesplats.find({commandes : commande.id}).populateAll().exec(function (err,cmdplat) {
                console.log(cmdplat);
                res.json({
                  commande : commande,
                  restaurateur : restaurateur,
                  cmdplat : cmdplat
                })
              })
            })
          })
        }else {
          res.json({
            message : 'Accées non autoriser'
          })
        }
      })
    },
    valide_confirmation : (req,res) => {
      console.log("validation confiramation");
      sails.sockets.broadcast(req.body.codecommande, 'validateC', { codecommande : req.body.codecommande  })
      res.ok()
    },
    valide_livraison : (req,res) => {
      console.log("validatuion livraison");
      sails.sockets.broadcast(req.body.codecommande, 'validateL', { codecommande : req.body.codecommande  })
      res.ok()
    }
};
