const state = {
  token : '',
  commande : [],
  profils : {}
}
const mutations = {
  EDIT_TOKEN : (state,new_token) =>{
    state.token = new_token
  },
  ADD_COMMANDE : (state,new_commande) =>{
    state.commande.push({...new_commande, quantity : 1})
  },
  NEW_COMMANDE : (state,new_commande) => {
    state.commande.push(new_commande)
  }
  ,
  REMOVE_COMMANDE : (state, commande) => {
    let tmp = []
    state.commande.forEach((item, i) => {
      if (item != commande) {
        tmp.push(item)
      }
    })
    state.commande = tmp
  },
  REMOVE_COMMANDE_BYCODE : (state, codecommande) => {
    let tmp = []
    state.commande.forEach((item, i) => {
      if (item.codecommande != codecommande) {
        tmp.push(item)
      }
    });
    state.commande = tmp
  },
  UPDATE_COMMANDE : (state, commande) => {
    let tmp = state.commande[commande.index]
    tmp.quantity = commande.quantity
    state.commande[commande.index] = tmp
  },
  DESTROY_COMMANDE : (state) => {
    state.commande = []
  },
  ACCEPTE_COMMANDE : (state, index) => {
    let tmp = state.commande[index]
    tmp.accepted = true
    state.commande[index] = tmp
  },
  ADD_PROFILS : (state, profils) => {
    state.profils = profils
  },
  GET_COMMANDE : (state, index) =>{
      return state.commande[index]
  },
  PAID_COMMANDE : (state, obj) => {
    let tmp
    let index
    state.commande.forEach((item, i) => {
      if (item.codecommande == obj.codecommande) {
        tmp = item
        index = i
      }
    });
    tmp.paid = true
    tmp.codelivraison = obj.codelivraison
    state.commande[index] = tmp
  },
  CODE_VALIDE : (state, codecommande) => {
    let tmp = []
    let tmp1
    state.commande.forEach((item, i) => {
      if (item.codecommande != codecommande) {
        tmp.push(item)
      }else {
        tmp1 = item
        tmp1.livreur = "ok"
        tmp.push(tmp1)
      }
    });
    state.commande = tmp
  }
}
const actions = {
  edit_token : (store, new_token) => {
    store.commit('EDIT_TOKEN', new_token)
  },
  add_commande : (store, new_commande) => {
    store.commit('ADD_COMMANDE', new_commande)
  },
  remove_commande : (store, commande) =>{
    store.commit('REMOVE_COMMANDE', commande)
  },
  remove_commande_bycode : (store,codecommande) => {
    store.commit('REMOVE_COMMANDE_BYCODE', codecommande)
  },
  update_commande : (store, commande) => {
    store.commit('UPDATE_COMMANDE', commande)
  },
  new_commande : (store, commande) => {
    store.commit('NEW_COMMANDE', commande)
  },
  destroy_commande : (store) =>{
    store.commit('DESTROY_COMMANDE')
  },
  accepte_commande : (store, index) => {
    store.commit('ACCEPTE_COMMANDE', index)
  },
  add_profils : (store, profils) => {
    store.commit('ADD_PROFILS', profils)
  },
  get_commande : (store,index) => {
    store.commit('GET_COMMANDE', index)
  },
  paid_commande : (store, obj) => {
    store.commit('PAID_COMMANDE', obj)
  },
  code_valide : (store, codecommande) => {
    store.commit('CODE_VALIDE', codecommande)
  }
}
const getters = {
  token : (state) => {
    return state.token
  },
  commande : (state) => {
    return state.commande
  },
  profils : (state) => {
    return state.profils
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
