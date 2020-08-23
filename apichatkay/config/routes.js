/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  //authentification
  'POST /authentification' : 'AuthentificationController.index',
  'GET /authentification' : 'AuthentificationController.verify',
  'GET /access_token' : 'AccesstokenController.index',

  //action
  '/test/get' : 'TestController.get',
  '/test/create' : 'TestController.create',
  '/test/delete/:id' : 'TestController.delete',
  '/test/edit/:id' : 'TestController.edit',
  '/test/update/:id' : 'TestController.update',


  //users
  '/users' : 'UsersController.index',
  '/users/create' : 'UsersController.create',
  '/users/delete' : 'UsersController.delete',
  '/users/update' : 'UsersController.update',

  //plats
  '/plats/get' : 'PlatsController.get',
  '/plats/create' : 'PlatsController.create',
  '/plats/delete' : 'PlatsController.delete',
  '/plats/update' : 'PlatsController.update',
  '/plats/tomenu' : 'PlatsController.toMenu',
  '/plats/menu' : 'PlatsController.menu',
  '/plats/allmenu' : 'PlatsController.allmenu',

  //chat commande
  'post /connect' : 'CommandesController.connect',
  'post /new_commande' : 'CommandesController.new_commande',
  'post /reply_commande' : 'CommandesController.reply_commande',
  'post /paid_commande' : 'CommandesController.paid_commande',
  'post /do_livraison' : 'CommandesController.do_livraison',
  'post /commandes/get' : 'CommandesController.get',
  'post /valide_livraison' : 'CommandesController.valide_livraison',
  'post /valide_confirmation' : 'CommandesController.valide_confirmation',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
