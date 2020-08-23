<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-negative" >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title  >
          <img
            alt="ChatKay logo"
            src="~assets/img/logo.png"
            height="33"
            style="padding : 0px"
            class="q-mt-sm"
          >
        </q-toolbar-title>

        <q-btn round>
          <q-avatar size="32px">
            <img :src="photo" alt="Avatar" />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <q-item
          :key="nav.label"
          v-for="nav in navs"
          clickable
          exact
          :to="nav.href"
        >
          <q-item-section avatar  >
            <q-icon :name="nav.iconname" />
          </q-item-section>
          <q-item-section>
            <q-item-label  >{{nav.label}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          exact
          @click.prevent="logout"
        >
          <q-item-section  avatar >
            <q-icon  name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label  >Deconnection</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Vuex from 'vuex'
export default {
  data () {
    return {
      leftDrawerOpen: false,
      photo : null,
      navs : [{ label : 'Home', iconname : 'home', href : '/restaurateur' },
              { label : 'Plat', iconname : 'fastfood', href : '/restaurateur/plat' },
              { label : 'Menu', iconname : 'menu_book', href : '/restaurateur/menu' },
              { label : 'Commande', iconname : 'assignment', href : '/restaurateur/commande' }]
    }
  },
  mounted (){
    console.log(this.token);
    this.$http.get('http://localhost:1337/authentification', {headers : {'authorization' : this.token}}).then(
      (res) => {
        if (res.body.message == true) {
          this.photo = 'http://localhost:1337/pdp/'+res.body.photo
          this.connect(res.body.email)
        }
      },
      (res) => {
        console.log(res);
      })


  },
  computed : {
    ...Vuex.mapGetters(['token'])
  },
  methods : {
    ...Vuex.mapActions(['edit_token', 'new_commande', 'destroy_commande']),
    logout (){
      this.edit_token('')
      window.location.href = '#/'
    },
    connect(channel){
      var socket = io.sails.connect('http://localhost:1337')
      socket.post('/connect', {channel : channel}, (res)=>{
        console.log(res);
      })
      socket.on('new_commande', (data) => {
            this.new_commande(data)
            this.showNotif('top-right')
      })
    },
    showNotif (position) {
      this.$q.notify({
        position : position,
        color : 'teal',
        message : 'Nouveau commande',
        icon : 'assignment',
        multiLine: true,
        actions :  [ { label: 'Repondre', color: 'warning', handler: () => { window.location.href = "#/restaurateur/commande" } } ]
      })
    }
  }
}
</script>

<style>
  .q-router-link--exact-active
  {
    color : #c42538 !important;
  }
  .q-router-link--active
  {
    color : #c42538 !important;
  }
</style>
