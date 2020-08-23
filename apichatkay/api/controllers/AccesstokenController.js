/**
 * AccesstokenController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index : (req, res) => {
    res.status(200).json({ accessToken : 'pk.eyJ1Ijoibm9tZW50c2FmaWR5IiwiYSI6ImNrN2M5bXl3YTBuenQzZXJ3dWdhdzZ3amEifQ.znO-DuWyFO7cpfRnl3A0Rg' })
  }
};
