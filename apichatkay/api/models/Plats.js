/**
 * Plats.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    codeplat : {
      type : 'string',
      required : true,
      unique : true
    },
    email :{
      type : 'string',
      required : true
    },
    nom : {
      type : 'string',
      required : true
    },
    description : {
      type : 'string',
      required : false
    },
    photo : {
      type : 'string',
      required : true
    },
    prix : {
      type : 'number',
      required : true
    },
    tomenu : {
      type : 'BOOLEAN',
      required : true
    },
    users : {
      model : 'Users'
    },
    Commandes : {
      collection : "Commandes",
      via : "plats",
      through : "Commandesplats"
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
