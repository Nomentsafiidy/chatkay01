<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-negative">
      <q-toolbar>
        <q-toolbar-title class="flex flex-center" >
          <img
            alt="Quasar logo"
            src="~assets/img/logo.png"
            height="45"
            style="padding : 0px"
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  }
}
</script>
