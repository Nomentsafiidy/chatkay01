
const routes = [
  {
    path: '/',
    component: () => import('layouts/login-layout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/register', component: () => import('pages/client/register.vue') }
    ]
  },
  {
    path: '/admin',
    component: ()=> import('layouts/admin-layout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/Index.vue') },
      { path: '/admin/users', component : () => import('pages/admin/users.vue') },
      { path: '/admin/addUser', component : () => import('pages/admin/addUser.vue') }
    ]
  },
  {
    path: '/client',
    component: ()=> import('layouts/client-layout.vue'),
    children: [
      { path: '', component: () => import('pages/client/Index.vue') },
      { path: '/client/plat', component : () => import('pages/client/plat.vue') },
      { path: '/client/commande', component : () => import('pages/client/commande.vue') }
    ]
  },
  {
    path: '/livreur',
    component: ()=> import('layouts/livreur-layout.vue'),
    children: [
      { path: '', component: () => import('pages/livreur/Index.vue') }
    ]
  },
  {
    path: '/restaurateur',
    component: ()=> import('layouts/restaurateur-layout.vue'),
    children: [
      { path: '', component: () => import('pages/restaurateur/Index.vue') },
      { path: '/restaurateur/plat', component : () => import('pages/restaurateur/plat.vue') },
      { path: '/restaurateur/menu', component : () => import('pages/restaurateur/menu.vue') },
      { path: '/restaurateur/commande', component : () => import('pages/restaurateur/commande.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
