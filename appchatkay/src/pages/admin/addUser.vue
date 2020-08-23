<template>
  <q-page class="container bg-grey-4">
    <!-- retoure nouveau cliant -->
    <q-btn to="/admin/users" round color="amber" glossy text-color="white" icon="arrow_forward" class="fixed-bottom-right q-mr-lg q-mb-lg " style="z-index: 1"/>
    <!-- formumaire -->
    <div class="flex flex-center">
      <form class="q-pt-md" action="http://localhost:1337/users/create" method="post" @submit.prevent="add" >
        <span class="text-negative text-h6">
          Nouveau Utilisateur
        </span>
        <q-input v-model="email" color="grey-3" label-color="negative" outlined label="Email" type="email" name="email" class="q-mt-md" required>
          <template v-slot:append>
            <q-icon name="email" color="negative" />
          </template>
        </q-input>
        <q-input v-model="nom" color="grey-3 mt-6" label-color="negative" outlined label="Nom" type="text" name="nom" required>
          <template v-slot:append>
            <q-icon name="account_box" color="negative" />
          </template>
        </q-input>
        <q-input v-model="telephone" color="grey-3 mt-6" label-color="negative" outlined label="Numero telephonique" type="text" name="telephone" required>
          <template v-slot:prepend>
            <span class="text-negative" >+261</span>
          </template>
          <template v-slot:append>
            <q-icon name="phone_iphone" color="negative" />
          </template>
        </q-input>
        <q-file color="grey-3 mt-6" outlined label-color="negative" v-model="photo" label="Photo de profils">
          <template v-slot:append>
            <q-icon name="wallpaper" color="negative" />
          </template>
        </q-file>
        <q-input v-model="password" color="grey-3 mt-6" label-color="negative" outlined label="Password" type="password" name="password" required>
          <template v-slot:append>
            <q-icon name="vpn_key" color="negative" />
          </template>
        </q-input>
        <q-select outlined  v-model="privilege" :options="options" label="privilege" label-color="negative" class="col-3 mt-6" />

        <!-- Formulaire restaurateur -->
        <div class="" v-show="isRestaurateur">
          <q-input v-model="restaurant" color="grey-3 mt-6" label-color="negative" outlined label="Nom du restaurant" type="text" name="restaurant" >
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
          <q-input v-model="nummoto" color="grey-3 mt-6" label-color="negative" outlined label="Immatriculation Moto" type="text" name="nummoto" required>
            <template v-slot:append>
              <q-icon name="motorcycle" color="negative" />
            </template>
          </q-input>
        </div>
        <!-- end -->
        <q-btn color="negative" class="mt-6  mr-6 " label="Ajouter" type="submit" />
      </form>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data() {
    return {
      accessToken : '',
      nom : '',
      email : '',
      password : '',
      telephone : '',
      photo : null,
      options : ['admin', 'restaurateur', 'livreur', 'client'],
      privilege : 'admin',
      latitude : 0,
      longitude : 0,
      marker : '',
      nummoto : '',
      restaurant : '',
      message : '',
      color : 'positive'
    }
  },
  computed : {
    isRestaurateur (){
      if (this.privilege == 'restaurateur') {
        this.localisation()
        return true
      }return false
    },
    isLivreur (){
      if (this.privilege == 'livreur') {
        return true
      }return false

    }
  },
  mounted() {
    //do something after mounting vue instance
    this.get_accessToken()
  },
  methods: {
    localisation() {
      if ("geolocation" in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude, longitude
            latitude = position.coords.latitude
            longitude = position.coords.longitude
            let mymap = L.map('mymap').setView([-21.453611, 47.085833], 15);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                minZoom: 14,
                id: 'mapbox/streets-v11',
                tile : 'Localisation du restaurant',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: this.accessToken
            }).addTo(mymap);

            mymap.addEventListener('click', (e) => {
              if( this.marker != ''){
                mymap.removeLayer(this.marker)
              }
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
    },
    showNotif () {
     this.$q.notify({
       message: this.message,
       color: this.color
     })
   },
    add() {
      var formData = new FormData();
      let extension
      try {
        let photoname = this.photo.name.split('.');
        extension = photoname[(photoname.length-1)]
        if ((extension == 'jpg') || (extension == 'JPG') || (extension == 'png') || (extension == 'PNG') ) {
        }
      } catch (e) {
        console.log('file errorr');
        extension = null
      } finally {
        formData.append('email', this.email)
        formData.append('nom', this.nom)
        formData.append('telephone', this.telephone)
        formData.append('password', this.password)
        formData.append('privilege', this.privilege)
        formData.append('restaurant', this.restaurant)
        formData.append('latitude', this.latitude)
        formData.append('longitude', this.longitude)
        formData.append('moto', this.nummoto)
        formData.append('extension', extension)
        formData.append('photo', this.photo)
      }
      this.$http.post('http://localhost:1337/users/create',formData, {headers : {authorization: this.token()}}).then((res)=>{
        if(res.body.message == true){
          this.email = ''
          this.nom = ''
          this.telephone = ''
          this.password = ''
          this.privilege = 'admin'
          this.restaurant = ''
          this.latitude = 0
          this.longitude = 0
          this.nummoto = ''
          this.photo = null
          this.color = 'positive'
          this.message = 'Ajout avec Success'
          this.showNotif()
        }else {
          this.color = 'positive'
          this.message = 'Ajout avec Success'
          this.showNotif()
        }
      },(res)=>{
        console.log(res);
      })
    },
    ...Vuex.mapGetters(['token']),
    get_accessToken(){
      this.$http.get('http://localhost:1337/access_token').then(
      (res)=>{
        this.accessToken = res.body.accessToken
      },
      (res) =>{
        console.log(res);
      })
    }
  }
}
</script>

<style>
  .mt-6{
    margin-top: 8px;
  }
  .mr-6{
    margin-right: 6px;
  }
  .mtb-5{
    margin-top: 15px ! important;
    margin-bottom: 15px;
  }
</style>
