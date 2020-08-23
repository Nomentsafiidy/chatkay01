/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jsonwebtoken  = require('./../../config/jsonwebtoken')
module.exports = {
    get : function (req, res){
          Plats.find().populate('users').exec(function(err, plat){
            if(err)return res.json(err)
            return res.json(plat)
          })
    },
    create : function(req,res){
      let id = req.body.id
      let body = req.body.body
      Test.create({id : id , body : body}).exec(function(err){
        if(err)return res.json(err)
        return res.json({
          create : 'true'
        })
      })
    },
    delete : function(req,res){
      let id = req.params.id
      console.log('maizina', id)
      Test.destroy({id: id}).exec(function(err) {
        if(err)return res.send(500, {message : 'Error database'})
        return res.json({
          deleted : true
        })
      })
    },
    edit : function(req,res){
      let id = req.params.id
      Test.findOne({id: id}).exec(function(err, test){
        if (err)return res.send(500, {message: 'Error database'})
        res.json(test)
      })
    },
    update : function(req,res){
      let id = req.params.id
      let body = req.body.body
      Test.update({id: id}, {body : body}).exec(function(err){
        if(err)return res.json(err)
        return res.json({
          create : 'true'
        })
      })
    }
};
