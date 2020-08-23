<template>
  <q-page class="container bg-grey-4">

    <!-- alerte  -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ message }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="icon">
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
    <!-- formumaire -->
    <div class="flex flex-center">
      <form class="q-pt-md" action="http://localhost:1337/users/create" method="post" @submit.prevent="singup" >
        <span class="text-negative text-h6">
          Register
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
        <q-btn color="negative" class="mt-6  mr-6 " label="S'inscrire" type="submit" />
        <q-btn color="positive" class="mt-6"  label="Se connecter" to="/"  />
      </form>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      icon: false,
      alert: false,
      message: '',
      nom : '',
      email : '',
      password : '',
      telephone : '',
      photo : null
    }
  },
  methods: {
    singup() {
        this.icon = true
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
          formData.append('extension', extension)
          formData.append('photo', this.photo)
        }
        this.$http.post('http://localhost:1337/users/create', formData).then((res)=>{
          if (res.body.message == true) {
            this.showNotif("Compte créer")
            window.location.href = '#/'
          }else {
            this.alert=true
            this.message =  res.body.message
          }
          this.icon = false
        }, (res)=>{
          console.log("error", res)
          this.icon = false
        });
    },
    showNotif (message) {
       this.$q.notify({
         message: message,
         color: 'positive'
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
