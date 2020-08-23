 <template>
   <q-page class="q-ma-md  bg-grey-4" >
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
     <!-- list plat -->
     <div class="q-pa-md">
       <q-card class="my-card q-mt-md" :key="plat.codeplat"  style="" v-for="(plat, index) in plats" >
          <q-img :src="domain+plat.photo" />
          <q-card-section>
            <q-btn
              fab
              @click="addcommande(index,!tocommande[index].tocommande)"
              v-if="!tocommande[index].tocommande"
              color="primary"
              icon="playlist_add"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />
            <q-btn
              fab
              @click="addcommande(index,!tocommande[index])"
              v-else
              color="primary"
              icon="playlist_add_check"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                {{plat.nom}}
              </div>
              <div class="col-auto  text-caption q-pt-md row no-wrap items-center">
                <q-icon class="text-negative" name="restaurant" />
                <span class="text-grey" >{{plat.users.restaurant}}</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">
              Prix : {{plat.prix}} Ar
            </div>
            <div class="text-caption text-grey">
             {{plat.description}}
            </div>
          </q-card-section>
        </q-card>
     </div>
   </q-page>
 </template>

 <script>
 import Vuex from 'vuex'
   export default {
     data (){
       return {
         recherche : '',
         filter : null,
         options : ['', 'prix', 'description', 'nom' ],
         plats : [],
         tocommande : [],
         domain : 'http://localhost:1337/plat/',
         commande : true
       }
     },
     mounted() {
       //do something after mounting vue instance
       // var socket = io('http://localhost:1337')
       // socket.on('connect',  () => {
       //   console.log('okok okokokokokokokok');
       //   socket.emit('ty', {a: 'gfgfd'})
       //   console.log('sfdsfd',socket);
       // })
       // var socket = io.sails.connect('http://localhost:1337')
       // socket.post('/on-connect', (res)=>{
       //   console.log(res);
       // })
       this.search()
     },watch : {
       recherche  (value){
         this.search()
       },
       filter (value){
         this.search()
       }
     } ,
     methods: {
       ...Vuex.mapGetters(['token']),
       ...Vuex.mapActions(['add_commande', 'remove_commande']),
       search() {
         this.$http.post('http://localhost:1337/plats/allmenu', {nom : this.recherche, filter: this.filter},{headers : {authorization : this.token()}}).then(
           (res) => {
             if (res.body.message == true) {
               this.plats = []
               this.tocommande = []
               for (var i = 0; i < res.body.plats.length; i++) {
                 this.plats.push(res.body.plats[i])
                 this.tocommande.push({tocommande: false})
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
       addcommande (index,value)  {
         console.log(value);
         this.tocommande.forEach((item, i) => {
           if (i == index) {
             this.tocommande[i].tocommande = value
             if (value) {
               this.add_commande(this.plats[i],2)
             }else {
               this.remove_commande(this.plats[i])
             }
           }
         });

       }
     }
   }
 </script>
