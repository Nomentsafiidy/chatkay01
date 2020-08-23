<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-negative">
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
          clickable
          exact
          to="/livreur"
        >
          <q-item-section avatar >
            <q-icon name="directions_run" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Livraison</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          exact
          @click.prevent="logout"
        >
          <q-item-section avatar >
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Deconnection</q-item-label>
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
      photo : '',
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.$http.get('http://localhost:1337/authentification', {headers : {'authorization' : this.token()}}).then(
      (res) => {
        if (res.body.message == true) {
          this.photo = 'http://localhost:1337/pdp/'+res.body.photo
        }
      },
      (res) => {
        console.log(res);
      })
  },
  methods: {
    ...Vuex.mapGetters(['token']),
    ...Vuex.mapActions(['edit_token']),
    logout() {
      this.edit_token('')
      window.location.href = '#/'
    }
  }
}
</script>
