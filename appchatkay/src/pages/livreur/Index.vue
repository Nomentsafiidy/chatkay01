<template>
  <q-page class="bg-grey-4">
    <!-- Liste Livraison -->
    <div class="q-pa-md" style=" z-index: 0;" v-if="todo" >
      <div class="mt-6" >
        <span class="q-pa-sm bg-white row" >
          <span class="text-solid text-negative col" >Lieu de la livraison</span>
          <q-icon name="location_on" color="negative" />
        </span>
        <div class="mt-6" id="mymap" style="height : 400px; width: 100%">
        </div>
      </div>
      <!-- Liste commande -->
      <div class="q-pa-md" style=" z-index: 0;">
        <q-card class="my-card q-mt-md bg-grey-2 wrap"  >
            <q-item>
              <span class="text-info text-h6" >Code du Commande :</span>
              <span class="text-h6" >{{this.commande.codecommande}}</span>
            </q-item>
            <q-separator />
            <!-- list manaraka -->
            <q-list :key="item.plats.codeplat" bordered class="full-width" v-for="(item, i) in cmdplat" >
                <q-item clickable v-ripple >
                 <q-item-section avatar>
                   <q-avatar rounded>
                      <img :src="domain+item.plats.photo">
                   </q-avatar>
                   </q-item-section>
                   <q-item-section>
                      <q-item-label>{{item.plats.nom}}</q-item-label>
                      <q-item-label caption> <q-icon name="attach_money" color="negative" /> {{item.plats.prix}} Ar</q-item-label>
                   </q-item-section>
                   <q-item-section side top>
                      <q-badge color="teal" :label="item.quantity" />
                  </q-item-section>
               </q-item>
            </q-list>
            <q-separator />
            <q-item v-if="!isValide">
              <q-input v-model="codelivraison" class="col" color="grey-3  " label-color="negative" outlined label="Code de la livraison" type="text" name="codelivraison" required>
                <template v-slot:append>
                  <q-icon name="vpn_key" color="negative" />
                </template>
              </q-input>
              <q-btn flat label="Valider"  color="warning" v-close-popup @click="valideL" />
            </q-item>
            <q-item v-else class="row" >
              <q-input v-model="codeconfirmation" class="col" color="grey-3" label-color="negative" outlined label="Code Confirmation" type="text" name="codeconfirmation" required>
                <template v-slot:append>
                  <q-icon name="vpn_key" color="negative" />
                </template>
              </q-input>
              <q-btn flat label="Valider" color="warning  " v-close-popup @click="valideC"/>
            </q-item>
        </q-card>
      </div>
    </div>
    <div class="q-pa-md" style=" z-index: 0;" v-else >
      <q-card class="my-card q-mt-sm bg-grey-2 wrap" v-for="(livraison, index) in livraisons" :key="index" >
          <q-item class="q-pa-md" clickable v-ripple>
            <q-item-section>
              <q-item-label class="text-info text-center text-h6">
                Commande à livré
              </q-item-label>
              <q-item-label class="text-center text-h6">
                {{livraison.codecommande}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat class="text-warning" @click="accepter(livraison.codecommande)">Accepter</q-btn>
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
      accessToken : '',
      domain : 'http://localhost:1337/plat/',
      livraisons : [],
      marker : '',
      todo : false,
      commande : '',
      restaurateur : {},
      cmdplat : [],
      client : {},
      markerCli : '',
      markerRes : '',
      codelivraison : '',
      codeconfirmation : '',
      isValide : false,
      socket : ''
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.livraisons = []
    this.get_accessToken()
    let socket = io.sails.connect('http://localhost:1337')
    this.socket = socket
    socket.post('/connect', {channel : 'livreur'}, (res) => {

    })
    socket.on('new_livraison', (data) => {
      this.livraisons.push(data)
    })
  },
  methods: {
    ...Vuex.mapGetters(['token']),
    valideL () {
      if (this.codelivraison == this.commande.codelivraison) {
        this.showNotif ("Code valide","positive")
        this.isValide = true
        this.socket.post('/valide_livraison', {codecommande : this.commande.codecommande}, (res) => {
        })
      }else {
        this.showNotif ("Code invalide", "negative")
        this.isValide = false
      }
    },
    valideC () {
      if (this.codeconfirmation == this.commande.codeconfirmation) {
        this.showNotif ("Code valide","positive")
        this.showNotif ("Livraison achevé","positive")
        this.isValide = false
        this.todo = false
        this.livraisons = []
        this.socket.post('/valide_confirmation', {codecommande : this.commande.codecommande}, (res) => {
        })
      }else {
        this.showNotif ("Code invalide", "negative")
        this.isValide = true
      }
    },
    accepter(codecommande) {
      var socket = io.sails.connect('http://localhost:1337')
      socket.post('/do_livraison',
          {
            codecommande : codecommande,
            authorization : this.token()
          },
      (res) => {
        if(res.message){
          this.todo = true
          this.get_commande(codecommande)
        }else {
          this.showNotif(res.message, "negative")
        }
      })
    },
    showNotif (message, color) {
      this.$q.notify({
        color : color,
        message : message,
      })
    },
    get_commande(codecommande){
      this.$http.post('http://localhost:1337/commandes/get', {codecommande : codecommande},{headers : {authorization : this.token()}}).then(
      (res)=>{
        this.commande = res.body.commande
        this.restaurateur = res.body.restaurateur
        this.cmdplat = res.body.cmdplat
        this.client = res.body.commande.client
        this.localisation()
      },(res)=>{

      })
    },
    get_accessToken(){
      this.$http.get('http://localhost:1337/access_token').then(
      (res)=>{
        this.accessToken = res.body.accessToken
      },
      (res) =>{
        console.log(res);
      })
    },
    localisation() {
        let mymap = L.map('mymap').setView([this.restaurateur.latitude, this.restaurateur.longitude], 14);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            minZoom: 13,
            id: 'mapbox/streets-v11',
            tile : 'Localisation du restaurant',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.accessToken
        }).addTo(mymap);

        this.markerRes = L.marker([this.restaurateur.latitude, this.restaurateur.longitude])
        this.markerRes.addTo(mymap);

        // this.markerRes = L.popup()
        //     .setLatLng([this.restaurateur.latitude, this.restaurateur.longitude])
        //     .setContent('<div><img src="http://localhost:1337/pdp/'+this.restaurateur.photo+'" width="80"  /><p>Restaurant : '+this.restaurateur.restaurant+'</p></div>')
        //     .openOn(mymap);

        this.markerCli = L.popup({
          autoClose : false,
          closeOnEscapeKey : false,
          closeOnClick : false,
          closeButton : false,
          maxWidth : 300
        })
            .setLatLng([this.commande.latitude, this.commande.longitude])
            .setContent('<div><img src="http://localhost:1337/pdp/'+this.client.photo+'" width="80"  /><p>Nom : '+this.client.nom+'</p><p>Indice : '+this.commande.indice+'</p></div>')
            .openOn(mymap)

        mymap.fitBounds([
            [this.restaurateur.latitude, this.restaurateur.longitude],
            [this.commande.latitude, this.commande.longitude]
        ]);
    }
  }
}
</script>
