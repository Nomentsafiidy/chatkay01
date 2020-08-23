<template>
  <q-page class="container bg-grey-4">
    <div class="flex flex-center">
      <form class="" action="" method="post" @submit.prevent="singin">
        <h4 class="text-negative">
          Login
        </h4>
        <q-input v-model="email" color="grey-3" label-color="negative" outlined label="Email" type="email" name="email" required >
          <template v-slot:append>
            <q-icon name="email" color="negative" />
          </template>
        </q-input>
        <q-input v-model="password" color="grey-3 mt-6" label-color="negative" outlined label="Password" type="password" name="password" required>
          <template v-slot:append>
            <q-icon name="vpn_key" color="negative" />
          </template>
        </q-input>
        <q-btn color="negative" class="mt-6 mr-6"  label="Se connecter" type="submit" />
        <q-btn color="positive" class="mt-6 " label="S'inscrire" to="/register" />
      </form>
    </div>
  </q-page>
</template>

<script>
import Vuex from 'vuex'
export default {
  data () {
    return {
      error : "",
      email : '',
      password : ''
    }
  },
  computed : {
    ...Vuex.mapGetters(['token'])
  },
  methods: {
    ...Vuex.mapActions(['edit_token']),
    singin() {
      this.$http.post('http://localhost:1337/authentification', { email : this.email, password : this.password }).then((res)=>{
        if(res.body.message == true){
          this.edit_token(res.body.token)
          window.location.href = '#/'+res.body.privilege
        }else {
          this.showNotif(res.body.message)
        }
      }, (res)=>{
        console.log(res);
      });
    },
    showNotif (message) {
       this.$q.notify({
         message: message,
         color: 'negative'
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
</style>
