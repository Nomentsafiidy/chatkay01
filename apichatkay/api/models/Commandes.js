/**
 * Commandes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    codecommande : {
      type : 'string',
      required : true,
      unique : true
    },
    codelivraison : {
      type : 'string',
      required : true
    },
    codeconfirmation : {
      type : 'string',
      required : true
    },
    status : {
      type : 'BOOLEAN',
      required : true
    },
    latitude : {
      type : 'number',
      required : true
    },
    longitude : {
      type : 'number',
      required : true
    },
    indice : {
      type : 'string',
      required : false
    },
    livreur : {
      model : 'Users'
    },
    client : {
      model : 'Users'
    },
    plats : {
      collection : "Plats",
      via : "commandes",
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
