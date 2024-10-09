const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/registro',
    component: () => import('pages/RegistroCuenta.vue')
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/menu', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: '/newhistory', component: () => import('pages/NewHistory.vue'), meta: { requiresAuth: true } },
      { path: '/actualizar', component: () => import('pages/ActualizacionPage.vue'), meta: { requiresAuth: true } },
      { path: '/usuarios', component: () => import('pages/UsuariosPage.vue'), meta: { requiresAuth: true } },
      { path: '/registros', component: () => import('pages/RegistrosPage.vue'), meta: { requiresAuth: true } }
    ]
  },
  // Siempre deja esto como el último,
  // pero también puedes eliminarlo
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
