<template>
  <q-page class=" bg-grey-4">
    <!-- formulaire de recherchee... -->
    <div class="fixed full-width q-pl-md q-pr-md q-pt-sm q-pb-sm  bg-grey-2" style="z-index: 1;" >
        <form class="row">
          <q-input color="grey-3" label-color="info" outlined v-model="recherche" label="Recherche.." class="col-9 q-pr-md">
            <template v-slot:append>
              <q-icon name="search" color="info" />
            </template>
          </q-input>
          <q-select filled v-model="filter" :options="options" label="Filtre" label-color="info" class="col" />
        </form>
    </div>
    <!-- Liste user -->
    <div class="q-pa-md" style="margin-top : 0px; z-index: 0; padding-top: 75px">
      <q-card :key="user.email" class="my-card q-mt-sm bg-grey-2 wrap" v-for="user in users" >
        <q-item clickable v-ripple>
            <q-item-section side>
              <q-avatar rounded size="100px">
                <img :src="domain + user.photo" />
                <q-badge floating :class="{'bg-teal': user.privilege==='admin', 'bg-warning' : user.privilege=='client','bg-negative' : user.privilege=='restaurateur', 'bg-warning' : user.privilege=='livreur', 'bg-purple' : user.privilege=='client' }">{{user.privilege}}</q-badge>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-info"><q-icon name="email" color="info" />  {{ user.email}}</q-item-label>
              <q-item-label caption>{{user.nom}}</q-item-label>
              <q-item-label caption v-if="user.moto.length > 0"><q-icon name="motorcycle" color="positive" />  {{user.moto}}</q-item-label>
              <q-item-label caption v-if="user.restaurant.length > 0"><q-icon name="restaurant" color="negative" />  {{user.restaurant}}</q-item-label>
            </q-item-section>
            <q-item-section side  >
              <div class="text-h6 q-mr-md q-mb-md absolute-bottom-right" ><q-icon name="phone_iphone" color="positive" />  +261{{user.telephone}}</div>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat class="text-warning" @click="edit(user.email,user.nom,user.password,user.privilege,user.telephone,user.photo,user.restaurant,user.latitude,user.longitude,user.moto)">Modifier</q-btn>
            <q-btn flat class="text-negative" @click="supprimer(user.email)">Supprimer</q-btn>
          </q-card-actions>
      </q-card>
    </div>
    <!-- ajouter nouveau cliant -->
    <q-btn to="/admin/addUser" round color="amber" glossy text-color="white" icon="add" class="fixed-bottom-right q-mr-lg q-mb-lg " style="z-index: 1"/>
    <!-- formulaire modifier -->
    <q-dialog v-model="modifier" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <form class="q-pt-md" action="http://localhost:1337/users/create" method="post" >
            <span class="text-negative text-h6">
              Modifier Utilisateur
            </span>
            <q-card class="my-card">
              <q-img
                :src="domain+photo"
                basic
              >
                <div class="absolute-bottom text-subtitle2 text-center">
                  Photo Actuel
                </div>
              </q-img>
            </q-card>
            <q-input v-model="emailM" color="grey-3" label-color="negative" outlined label="Email" type="email" name="email" class="q-mt-md" required>
              <template v-slot:append>
                <q-icon name="email" color="negative" />
              </template>
            </q-input>
            <q-input v-model="nomM" color="grey-3 mt-6" label-color="negative" outlined label="Nom" type="text" name="nom" required>
              <template v-slot:append>
                <q-icon name="account_box" color="negative" />
              </template>
            </q-input>
            <q-input v-model="telephoneM" color="grey-3 mt-6" label-color="negative" outlined label="Numero telephonique" type="text" name="telephone" required>
              <template v-slot:prepend>
                <span class="text-negative" >+261</span>
              </template>
              <template v-slot:append>
                <q-icon name="phone_iphone" color="negative" />
              </template>
            </q-input>

            <q-file color="grey-3 mt-6" outlined label-color="negative" v-model="photoM" label="Photo de profils">
              <template v-slot:append>
                <q-icon name="wallpaper" color="negative" />
              </template>
            </q-file>
            <q-input v-model="passwordM" color="grey-3 mt-6" label-color="negative" outlined label="Password" type="password" name="password" required>
              <template v-slot:append>
                <q-icon name="vpn_key" color="negative" />
              </template>
            </q-input>
            <q-select outlined  v-model="privilegeM" :options="options" label="privilege" label-color="negative" class="col-3 mt-6" />

            <!-- Formulaire restaurateur -->
            <div class="" v-if="isRestaurateur">
              <q-input v-model="restaurantM" color="grey-3 mt-6" label-color="negative" outlined label="Nom du restaurant" type="text" name="restaurant" required>
                <template v-slot:append>
                  <q-icon name="restaurant" color="negative" />
                </template>
              </q-input>
              <div class="mt-6" >
                <span class="q-pa-sm bg-white row" >
                  <span class="text-solid text-negative col" >Localisation du restaurant</span>
                  <q-icon name="location_on" color="negative" />
                </span>
                <div class="mt-6" id="mymap" style="height : 300px; width: 100%">
                </div>
              </div>
            </div>
            <!-- formulaire livreur -->
            <div class="" v-if="isLivreur">
              <q-input v-model="motoM" color="grey-3 mt-6" label-color="negative" outlined label="Immatriculation Moto" type="text" name="nummoto" required>
                <template v-slot:append>
                  <q-icon name="motorcycle" color="negative" />
                </template>
              </q-input>
            </div>
            <!-- end -->
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn flat label="Modifier" color="warning" v-close-popup @click="update" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- other compenents -->
    <!-- loading -->
    <q-dialog v-model="load" persistent>
      <div class="q-pa-md flex flex-center">
        <q-circular-progress
          indeterminate
          size="75px"
          :thickness="0.6"
          color="negative"
          center-color="grey-8"
          class="q-ma-md"
        />
      </div>
    </q-dialog>
    <!-- modal confirm -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ message }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn flat label="ok" color="primary" v-close-popup @click="destroy" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- loadin user -->
    <div class="q-pa-md" v-if="loadUser" style="z-index: 0">
      <q-card >
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-skeleton height="200px" square />
        <q-card-actions align="right" class="q-gutter-md">
          <q-skeleton type="QBtn" />
          <q-skeleton type="QBtn" />
        </q-card-actions>
      </q-card>
      <q-card class="q-mt-md" >
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-skeleton height="200px" square />
        <q-card-actions align="right" class="q-gutter-md">
          <q-skeleton type="QBtn" />
          <q-skeleton type="QBtn" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data () {
    return {
      accessToken : '',
      load : false,
      loadUser : false,
      nomM : '',
      emailM : '',
      passwordM : '',
      telephoneM : '',
      photoM : null,
      photo : '',
      privilegeM : 'admin',
      latitude : -21.453611,
      longitude : 47.085833,
      marker : '',
      nummotoM : '',
      restaurantM : '',
      motoM : '',
      modifier : false,
      confirm : false,
      email : '',
      message : '',
      filter: '',
      options: [
        '', 'admin', 'restaurateur', 'client', 'livreur'
      ],
      recherche : '',
      users : [],
      domain : 'http://localhost:1337/pdp/',
      colorNotif : '',
      messageNotif : ''
    }
  },
  watch: {
    filter : function(value){
      this.search()
    },
    recherche (value) {
      this.search()
    },
    isRestaurateur(value){
      if (value) {
        this.localisation()
      }
    }
  }
  ,
  mounted() {
    //do something after mounting vue instance
    this.loadUser = true
    this.get_accessToken()
    window.setTimeout(() => {
      this.search()
    } ,3000)
  },
  computed : {
    ...Vuex.mapGetters(['token']),
    isRestaurateur (){
      if (this.privilegeM == 'restaurateur') {
        return true
      }return false

    },
    isLivreur (){
      if (this.privilegeM == 'livreur') {
        return true
      }return false
    }
  },
  methods: {
    search(){
      this.$http.post('http://localhost:1337/users', {email : this.recherche, filter : this.filter},{headers : {authorization : this.token}}).then(
        (res) => {
          this.loadUser = false
          this.load = false
          if (res.body.message == true) {
            this.users = []
            for (var i = 0; i < res.body.users.length; i++) {
              this.users.push(res.body.users[i])
            }
          }else {
            console.log('success',res);
          }
        },
        (res) => {
          console.log(res)
        }
      )
    },
    showNotif () {
       this.$q.notify({
         message: this.messageNotif,
         color: this.colorNotif
       })
    },
    get (){
      this.$http.get('http://localhost:1337/users/get', {headers : {authorization : this.token}}).then((res)=>{
        if (res.body.message == true) {
          this.users = []
          for (var i = 0; i < res.body.users.length; i++) {
            this.users.push(res.body.users[i])
          }
        }else {
          console.log('success',res);
        }
      },(res)=>{
        console.log('error',res);
      })
    },
    destroy() {
      this.load = true
        this.$http.post('http://localhost:1337/users/delete', {email : this.email}, {headers : {authorization : this.token}}).then(
          (res)=>{
            this.load = false
            if (res.body.message == true) {
              this.search()
            }
          },
          (res)=>{
            console.log(res);
          }
        )
    },
    edit(email,nom,password,privilege,telephone,photo,restaurant,latitude,longitude,moto){
      this.emailM = email
      this.nomM = nom
      this.passwordM = password
      this.privilegeM = privilege
      this.telephoneM = telephone
      this.photo =  photo
      this.restaurantM = restaurant
      this.motoM =  moto
      this.modifier = true
      if (privilege == 'restaurateur') {
        this.latitude = latitude
        this.longitude = longitude
        this.localisation()
      }
    },
    supprimer(email){
      this.email = email
      this.confirm = true
      this.message = 'Voulez vous supprimer '+email+' ?'
    },
    update() {
      this.load = true
      //do something after updating vue instance
        var formData = new FormData();
        let extension
        try {
          let photoname = this.photoM.name.split('.');
          extension = photoname[(photoname.length-1)]
          console.log(extension);
          if ((extension == 'jpg') || (extension == 'JPG') || (extension == 'png') || (extension == 'PNG') ) {
          }
        } catch (e) {
          extension = null
        } finally {
          formData.append('email', this.emailM)
          formData.append('nom', this.nomM)
          formData.append('telephone', this.telephoneM)
          formData.append('password', this.passwordM)
          formData.append('privilege', this.privilegeM)
          formData.append('restaurant', this.restaurantM)
          formData.append('latitude', this.latitude)
          formData.append('longitude', this.longitude)
          formData.append('moto', this.motoM)
          formData.append('extension', extension)
          formData.append('photo', this.photo)
          formData.append('photoM', this.photoM)
        }
        this.$http.post('http://localhost:1337/users/update',formData, {headers : {authorization: this.token}}).then((res)=>{
          this.load = false
          if(res.body.message == true){
            this.users = null
            this.emailM = ''
            this.nomM = ''
            this.telephoneM = ''
            this.passwordM = ''
            this.privilegeM = 'admin'
            this.restaurantM = ''
            this.latitude = -21.453611
            this.longitude = 47.085833
            this.motoM = ''
            this.photo = ''
            this.photoM = null
            this.colorNotif = 'positive'
            this.messageNotif = 'Modifier avec Success'
            this.loadUser = true
            window.setTimeout(() => {
              this.showNotif()
              this.search()
            } ,3000)
          }else {
            this.colorNotif = 'negative'
            this.messageNotif = res.body.message
            this.showNotif()
          }
        },(res)=>{
          console.log(res);
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

<style>
    .wrap {
        word-wrap:break-word !important;
    }
</style>
