<template>
  <q-page class="q-ma-md  bg-grey-4">
    <!-- formulaire de recherchee... -->
    <div class=" full-width q-pl-md q-pr-md q-pt-sm q-pb-sm  bg-grey-2" style="z-index: 1;" >
        <form class="row">
          <q-input color="grey-3" label-color="info" outlined v-model="recherche" label="Recherche.." class="col-9 q-pr-md">
            <template v-slot:append>
              <q-icon name="search" color="info" />
            </template>
          </q-input>
          <q-select filled v-model="filter" :options="options" label="Filtre" label-color="info" class="col" />
        </form>
    </div>
    <!-- ajouter nouveau cliant -->
    <q-btn @click="addForm = true" round color="amber" glossy text-color="white" icon="add" class="fixed-bottom-right q-mr-lg q-mb-lg " style="z-index: 1"/>
    <!-- formulaire ajouter -->
    <q-dialog v-model="addForm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <form class="q-pt-md" action="" method="post" >
            <span class="text-negative text-h6">
              Ajouter Plat
            </span>
            <q-input v-model="nom" color="grey-3 mt-6" label-color="negative" outlined label="Nom" type="text" name="nom" required>
              <template v-slot:append>
                <q-icon name="restaurant_menu" color="negative" />
              </template>
            </q-input>
            <q-input v-model="description" color="grey-3" label-color="negative" outlined label="Description" type="textarea" name="Description" class="q-mt-md" >
              <template v-slot:append>
                <q-icon name="description" color="negative" />
              </template>
            </q-input>
            <q-file color="grey-3 mt-6" outlined label-color="negative" v-model="photo" label="Photo du plat">
              <template v-slot:append>
                <q-icon name="wallpaper" color="negative" />
              </template>
            </q-file>
            <q-input v-model="prix" color="grey-3 mt-6" label-color="negative" outlined label="Prix en Ariary" type="Number" name="telephone" required>
              <template v-slot:append>
                <q-icon name="attach_money" color="negative" />
              </template>
            </q-input>
          </form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn flat label="Ajouter" color="warning" v-close-popup @click="addPlat" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- list plat -->
    <div class="q-pa-md " style="">
      <q-card class="my-card q-mt-md " :class="{'bg-grey-1' : !plat.tomenu, 'bg-warning': plat.tomenu}" :key="plat.codeplat"  bordered style="" v-for="plat in plats" >
        <q-card-section horizontal>
          <q-img
            class="col"
            :src="domain+plat.photo" >
            <div class="absolute-bottom">
              <div class="text-h6">{{plat.nom}}</div>
              <div class="text-subtitle2">{{plat.description}}</div>
              <q-badge floating class="bg-info">{{plat.prix}}</q-badge>
            </div>
          </q-img>
          <q-card-actions vertical class="justify-around q-px-md">
            <q-btn @click="destroy(plat.codeplat)" flat round color="red" icon="delete"  />
            <q-btn @click="edit(plat.codeplat,plat.nom,plat.description,plat.prix,plat.photo)" flat round color="accent" icon="edit" />
            <q-btn @click="toMenu(plat.codeplat,!plat.tomenu)" v-if="!plat.tomenu" flat round color="primary" icon="playlist_add" />
            <q-btn @click="toMenu(plat.codeplat,!plat.tomenu)" v-else flat round color="primary" icon="playlist_add_check" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
    <!-- formulaire mofication -->
    <q-dialog v-model="editForm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <form class="q-pt-md" action="" method="post" >
            <span class="text-negative text-h6">
              Modifier Plat
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
            <q-input v-model="nomM" color="grey-3 mt-6" label-color="negative" outlined label="Nom" type="text" name="nom" required>
              <template v-slot:append>
                <q-icon name="restaurant_menu" color="negative" />
              </template>
            </q-input>
            <q-input v-model="descriptionM" color="grey-3" label-color="negative" outlined label="Description" type="textarea" name="Description" class="q-mt-md" >
              <template v-slot:append>
                <q-icon name="description" color="negative" />
              </template>
            </q-input>
            <q-file color="grey-3 mt-6" outlined label-color="negative" v-model="photoM" label="Photo du plat">
              <template v-slot:append>
                <q-icon name="wallpaper" color="negative" />
              </template>
            </q-file>
            <q-input v-model="prixM" color="grey-3 mt-6" label-color="negative" outlined label="Prix en Ariary" type="Number" name="telephone" required>
              <template v-slot:append>
                <q-icon name="attach_money" color="negative" />
              </template>
            </q-input>
          </form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn flat label="Modifier" color="warning" v-close-popup @click="update" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- mkgkfdkmgfd -->
    <!-- loadin user -->
    <div class="q-pa-md" v-if="loadPlat" style="z-index: 0">
      <q-card >
        <q-card-section horizontal>
          <q-skeleton height="200px" class="full-width" square />
          <q-card-actions vertical class="justify-around q-px-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data () {
    return {
      loadPlat : false,
      recherche : '',
      filter: '',
      options: [
        '', 'prix', 'description', 'nom'
      ],
      addForm : false,
      editForm : false,
      prix: null,
      description : '',
      nom : '',
      photo : null,
      plats : [],
      domain : 'http://localhost:1337/plat/',
      nomM : '',
      descriptionM : '',
      photoM : null,
      prixM : null,
      codeplat : ''
    }
  },
  watch: {
    filter : function(value){
      this.search()
    },
    recherche (value) {
      this.search()
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.search()
  },
  methods: {
    ...Vuex.mapGetters(['token']),
    toMenu(codeplat,tomenu){
      this.$http.post('http://localhost:1337/plats/tomenu', { codeplat: codeplat ,tomenu: tomenu},{headers : {authorization : this.token()}}).then(
        (res) => {
          if (res.body.message == true) {
            this.search()
          }else {
            console.log('success', res);
          }
        },
        (res) => {
          console.log(res);
        }
      )
    },
    search(){
      this.$http.post('http://localhost:1337/plats/get', {nom : this.recherche, filter : this.filter},{headers : {authorization : this.token()}}).then(
        (res) => {
          if (res.body.message == true) {
            this.plats = []
            for (var i = 0; i < res.body.plats.length; i++) {
              this.plats.push(res.body.plats[i])
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
    addPlat() {
      this.loadPlat = true
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
          formData.append('nom', this.nom)
          formData.append('description', this.description)
          formData.append('prix', this.prix)
          formData.append('extension', extension)
          formData.append('photo', this.photo)
        }
        this.$http.post('http://localhost:1337/plats/create',formData, {headers : {authorization: this.token()}}).then(
        (res)=>{
          if (res.body.message) {
            window.setTimeout(() => {
              this.loadPlat = false
              this.search()
            } ,3000)
          }else {
            console.log('sucess', res.body.message);
          }
        },(res)=>{
          console.log(res);
        })
    },
    destroy (codeplat){
      this.$http.post('http://localhost:1337/plats/delete', {codeplat : codeplat}, {headers : {authorization : this.token()}}).then(
        (res)=>{
          if (res.body.message) {
            this.search()
          }
        },
        (res)=>{
          console.log(res);
        }
      )
    },
    edit (codeplat,nom,description,prix,photo){
      this.editForm = true
      this.codeplat = codeplat
      this.nomM = nom
      this.descriptionM = description
      this.photo = photo
      this.prixM = prix
    },
    update() {
      //do something after updating vue instance
      this.loadPlat = true
          var formData = new FormData();
          let extension
          try {
            let photoname = this.photoM.name.split('.');
            extension = photoname[(photoname.length-1)]

            if ((extension == 'jpg') || (extension == 'JPG') || (extension == 'png') || (extension == 'PNG') ) {
            }
          } catch (e) {
            extension = null
          } finally {
            formData.append('codeplat', this.codeplat)
            formData.append('nom', this.nomM)
            formData.append('description', this.descriptionM)
            formData.append('prix', this.prixM)
            formData.append('extension', extension)
            formData.append('photo', this.photoM)
          }
          this.$http.post('http://localhost:1337/plats/update',formData, {headers : {authorization: this.token()}}).then(
          (res)=>{
            if (res.body.message) {
              window.setTimeout(() => {
                this.loadPlat = false
                this.search()
              } ,3000)
            }else {
              console.log('sucess', res.body.message);
            }
          },(res)=>{
            console.log(res);
          })
    }
  }
}
</script>

<!-- /* <style >
.my-card{
  width: 100%;
  max-width: 480px;
}
</style> */ -->
