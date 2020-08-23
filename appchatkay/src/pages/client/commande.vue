<template>
  <q-page  class="q-ma-md  bg-grey-4" >
    <!-- Liste user -->
    <div class="q-pa-md" style="margin-top : 0px; z-index: 0;" >
      <q-card :key="index" class="my-card q-mt-sm bg-grey-2 wrap" v-for="(commande, index) in commandes" >
        <q-item clickable v-ripple>
            <q-item-section side>
              <q-avatar rounded size="100px">
                <img :src="domain + commande.photo" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-info"><q-icon name="restaurant_menu" color="info" />  {{ commande.nom}}</q-item-label>
              <q-item-label caption> <q-icon name="attach_money" color="positive" /> {{commande.prix}} Ar</q-item-label>
            </q-item-section>
            <q-item-section   >
              <q-badge color="secondary">
                Quantité : {{ commande.quantity }}
              </q-badge>
              <q-slider v-model="nombre[index]" :min="1" label :max="5" @change="update(index)" />
            </q-item-section>
          </q-item>
      </q-card>
    </div>
    <div glossy class="fixed-bottom bg-negative shadow row" style="z-index: 1" >
      <q-field color="teal" filled label="Total" label-color="white" stack-label class=" q-mr-sm bg-negative col">
       <template v-slot:prepend>
           <q-icon color="white" name="attach_money" />
         </template>
         <template v-slot:control>
           <div class="self-center text-white" tabindex="0">{{total}}</div>
         </template>
         <template v-slot:append>
          <div class="text-white">Ariary</div>
         </template>
       </q-field>
      <!-- ajouter nouveau cliant -->
      <q-btn @click="send"  color="info" glossy text-color="white" label="Commander" class="q-ma-sm" />
    </div>
    <!-- modal -->
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="row justify-center" v-if="attente" >
          <q-spinner-facebook color="light-blue" size="4em" />
          <span class="col-12 text-center text-h6 text-info" v-if="livreur"  >
            En attente d'un livreur
          </span>
          <span class="col-12 text-center text-h6 text-info"  v-else >En attente de confirmation</span>
        </q-card-section>
        <q-card-section class="row justify-center" v-if="!attente" >
          <div class="q-pt-md" v-if="isDeliver" >
            <span class="col-12 text-center text-h6 text-info">
              Code de confirmation : {{codeconfirmation}}
            </span>
            <div class="" v-if="deliver.nom" >
              <q-card class="my-card">
                <q-img
                  :src="'http://localhost:1337/pdp/'+deliver.photo"
                  basic
                >
                  <div class="absolute-bottom text-subtitle2 text-center">
                    <div class="text-h6">Livreur</div>
                    <div class="text-subtitle2">{{deliver.nom}}</div>
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>
          <form class="q-pt-md" action="" method="post" v-if="!isDeliver" >
            <span class="text-negative text-h6">
              Formulaire de Payement
            </span>
            <q-field color="teal" filled label="Total" label-color="negative" stack-label class=" q-mr-sm col">
             <template v-slot:prepend>
                 <q-icon color="negative" name="attach_money" />
               </template>
               <template v-slot:control>
                 <div class="self-center text-negative" tabindex="0">{{total}}</div>
               </template>
               <template v-slot:append>
                <div class="text-negative">Ariary</div>
               </template>
             </q-field>
             <div class="mt-6" >
               <span class="q-pa-sm bg-white row" >
                 <span class="text-solid text-negative col" >Lieu de la livraison</span>
                 <q-icon name="location_on" color="negative" />
               </span>
               <div class="mt-6" id="mymap" style="height : 300px; width: 100%">
               </div>
             </div>
             <q-input v-model="indice" color="grey-3" label-color="negative" outlined label="Indice Pour le livreur" type="textarea" name="cs" class="q-mt-md" >
               <template v-slot:append>
                 <q-icon name="description" color="negative" />
               </template>
             </q-input>
            <q-input v-model="password" color="grey-3 mt-6" label-color="negative" outlined label="Password" type="password" name="password" required>
              <template v-slot:append>
                <q-icon name="vpn_key" color="negative" />
              </template>
            </q-input>
          </form>
        </q-card-section>
        <q-card-actions align="right" v-if="!attente">
          <q-btn v-if="!isDeliver"  flat label="Annuler" color="primary" v-close-popup @click="paid_commande(false)" />
          <q-btn v-if="!isDeliver"  flat label="Payer" color="warning" v-close-popup @click="paid_commande(true)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
  export default{
    data (){
      return {
        accessToken : '',
        commandes : [],
        domain : 'http://localhost:1337/plat/',
        nombre : [],
        total : null,
        modal : false,
        attente : true,
        livreur : false,
        myprofils : {},
        password : '',
        codecommande : '',
        indice : '',
        latitude : -21.455157306877357,
        longitude : 47.093265639921945,
        codeconfirmation : '',
        deliver : null
      }
    },
    computed : {
      isDeliver (){
        if (this.deliver == null) {
          return false
        } return true
      }
    },
    mounted() {
      //do something after mounting vue instance
      this.get_accessToken()
      this.liste()
      this.myprofils = this.profils()
      var socket = io.sails.connect('http://localhost:1337')
      socket.post('/connect', {channel : this.myprofils.email}, (res)=>{
        socket.on('reply', (data) => {
          if (data.message) {
            this.attente = false
            this.codecommande = data.codecommande
            this.localisation()
          }else{
            this.attente = true
            this.modal = false
            this.showNotif('Commande Refuser', 'negative')
          }
        })
      })
    },
    methods: {
      ...Vuex.mapGetters(['commande', 'profils', 'token']),
      ...Vuex.mapActions(['update_commande', 'destroy_commande']),
      reset(){
        this.liste()
        this.modal = false
        this.attente = true
        this.livreur = false
        this.password = ''
        this.codecommande = ''
        this.indice = ''
        this.codeconfirmation = ''
        this.deliver = null
      },
      update (index){
        let a = this.nombre[index]
        this.update_commande({ index : index, quantity : a})
        this.liste()
      },
      liste(){
        this.commandes = this.commande()
        this.nombre = []
        this.total = 0
        for (var i = 0; i < this.commandes.length; i++) {
          this.nombre.push(this.commandes[i].quantity)
          this.total += (this.commandes[i].quantity*this.commandes[i].prix)
        }
      },
      send (){
        var socket = io.sails.connect('http://localhost:1337')
        let channel = this.commandes[0].users.email
        socket.post('/connect', {channel : channel}, (res)=>{
            socket.post('/new_commande', {commandes : this.commandes, channel : channel, client_channel : this.myprofils.email}, (res) => {
                this.modal = true
            })
        })
      },
      paid_commande (paid){
        var socket = io.sails.connect('http://localhost:1337')
        if (paid) {
          socket.post('/connect', {channel : this.codecommande}, (res)=>{
          })
          socket.on('delivering', (data) => {
            this.attente = false
            this.deliver = data.livreur
          })
          socket.on('validateC', (data) => {
            console.log('confirmation', data)
            this.destroy_commande()
            this.reset()
            this.showNotif('Commade livré', 'positive')
          })
          this.livreur = true
          this.attente = true
        }else {
          this.attente = true
          this.modal = false
        }
        socket.post('/paid_commande',
            {
              codecommande : this.codecommande,
              commandes : this.commandes,
              latitude : this.latitude,
              longitude : this.longitude,
              indice : this.indice,
              paid : paid,
              authorization : this.token()
            },
        (res) => {
          if (res.message) {
            this.codeconfirmation = res.codeconfirmation
          }
        })

      },
      showNotif (message, color) {
        this.$q.notify({
          position : 'right',
          color : color,
          message : message,
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
        if ("geolocation" in navigator) {
          /* geolocation is available */
          navigator.geolocation.getCurrentPosition((position) => {
              let mymap = L.map('mymap').setView([this.latitude, this.longitude], 16);
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
              this.marker = L.marker([this.latitude, this.longitude])
              this.marker.addTo(mymap);
              mymap.addEventListener('click', (e) => {
                mymap.removeLayer(this.marker)
                this.latitude = e.latlng.lat
                this.longitude = e.latlng.lng
                this.marker = L.marker(e.latlng)
                this.marker.addTo(mymap);
              })
          });

          } else {
            /* geolocation IS NOT available */
            console.log("Not geolocation");
          }
      }
    }
  }
</script>
