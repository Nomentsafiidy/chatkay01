/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema : true,
  attributes: {
    email : {
      type : 'string',
      required : true,
      unique : true
    },
    password : {
      type : 'string',
      required : true
    },
    nom : {
      type : 'string',
      required : true
    },
    privilege : {
      type : 'string',
      required : true
    },
    solde : {
      type : 'number',
      required : true
    },
    telephone : {
      type : 'string',
      required : true
    },
    photo : {
      type : 'string',
      required : false
    },
    restaurant : {
      type : 'string',
      required : false
    },
    latitude : {
      type : 'number',
      required : false
    },
    longitude : {
      type : 'number',
      required : false
    },
    moto : {
      type : 'string',
      required : false
    },
    plats : {
      collection : "Plats",
      via: 'users'
    },
    livreur : {
      collection : "Commandes",
      via: 'livreur'
    },
    client : {
      collection : "Commandes",
      via: 'client'
    }



    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};
