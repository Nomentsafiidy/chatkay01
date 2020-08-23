<template>
  <q-page class="q-ma-md  bg-grey-4">
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
    <!-- list plat -->
    <div class="q-pa-md " style="">
      <q-card :key="plat.id" class="my-card q-mt-md bg-grey-2 "  bordered style="" v-for="plat in plats" >
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
            <q-btn @click="toMenu(plat.codeplat,!plat.tomenu)" flat round color="primary" icon="close" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data(){
    return{
      recherche : '',
      plats : [],
      domain : 'http://localhost:1337/plat/'

    }
  },watch : {
    recherche  (value){
      this.search()
    }
  },mounted() {
    //do something after mounting vue instance
    this.search()
  },methods: {
    ...Vuex.mapGetters(['token']),
    search() {
      this.$http.post('http://localhost:1337/plats/menu', {nom : this.recherche},{headers : {authorization : this.token()}}).then(
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
    }
  }
}
</script>

<style>

</style>
