<template>
  <q-page class="bg-grey-4">
    <!-- formulaire de recherchee... -->
    <div class=" full-width q-pl-md q-pr-md q-pt-sm q-pb-sm  bg-grey-2" style="z-index: 1;" >
        <form class="row">
          <q-input color="grey-3" label-color="info" outlined v-model="recherche" label="Recherche.." class="col-12 q-pr-md">
            <template v-slot:append>
              <q-icon name="search" color="info" />
            </template>
          </q-input>
        </form>
    </div>
    <!-- Liste commande -->
    <div class="q-pa-md" style=" z-index: 0;">
      <q-card :key="commande.codecommande" class="my-card q-mt-md bg-grey-2 wrap" v-for="(commande, index) in commandes" >
          <!-- list manaraka -->
          <q-list :key="plat.codeplat" bordered class="full-width" v-for="plat in commande.commandes" >
              <q-item clickable v-ripple >
               <q-item-section avatar>
                 <q-avatar rounded>
                    <img :src="domain+plat.photo">
                 </q-avatar>
                 </q-item-section>
                 <q-item-section>
                    <q-item-label>{{plat.nom}}</q-item-label>
                    <q-item-label caption> <q-icon name="attach_money" color="negative" /> {{plat.prix}} Ar</q-item-label>
                 </q-item-section>
                 <q-item-section side top>
                    <q-badge color="teal" :label="plat.quantity" />
                </q-item-section>
             </q-item>
          </q-list>
          <q-separator />
          <q-card-actions  align="right" >
            <span class="col text-bold">
              {{commande.codecommande}}
            </span>
            <span class="col text-bold text-negative" v-if="commande.accepted" >
              <div class="row justify-center" v-if="!commande.paid">
                <q-spinner-facebook color="light-blue" size="2em"  />
                <span class="col-12 text-center text-info"  >En attente de Payement</span>
              </div>
              <div class="" v-else >
                <span class="col-12 text-info" v-if="commande.livreur == '' ">
                  Code de la livraison : {{commande.codelivraison}}
                </span>
                <span class="col-12 text-info" v-else>
                  <q-icon size="40"  name="done" color="positive" /> Code valide
                </span>
              </div>
            </span>
            <q-btn v-if="!commande.accepted" flat class="text-warning" @click="accepter(index)">Accepter</q-btn>
            <q-btn v-if="!commande.accepted" flat class="text-negative" @click="refuser(commande)">Refuser</q-btn>
          </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data(){
    return {
      recherche : '',
      commandes : [],
      domain : 'http://localhost:1337/plat/'
    }
  },mounted() {
    //do something after mounting vue instance
    this.commandes = this.commande()
  },
  methods: {
    ...Vuex.mapGetters(['commande']),
    ...Vuex.mapActions(['remove_commande', 'accepte_commande', 'get_commande', 'paid_commande', 'remove_commande_bycode', 'code_valide']),
    refuser(commande) {
      this.remove_commande(commande)
      this.commandes = this.commande()
      let socket = io.sails.connect('http://localhost:1337')
      console.log(commande);
      socket.post('/reply_commande', {channel : commande.client_channel, message : false}, (res)=>{
      })
    },
    accepter(index){
      this.accepte_commande(index)
      this.commandes = this.commande()
      let socket = io.sails.connect('http://localhost:1337')
      socket.post('/reply_commande', {channel : this.commandes[index].client_channel, message : true, codecommande : this.commandes[index].codecommande}, (res)=>{
        socket.post('/connect', {channel : this.commandes[index].codecommande}, (res)=>{
        })
        socket.on('paid', (data) => {
          if (data.paid) {
            this.paid_commande({codecommande :data.codecommande, codelivraison : data.codelivraison})
          }else {
            this.remove_commande_bycode(data.codecommande)
            this.commandes = this.commande()
          }
        })
        socket.on('validateL', (data) => {
          console.log('livraison okok',data);
          this.code_valide(data.codecommande)
          this.commandes = this.commande()
        })
      })
    }
  }
}
</script>

<style>

</style>
