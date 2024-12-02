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
    path: '/correo',
    component: () => import('pages/correoPage.vue')
  },
  {
    path: '/recuperarclave',
    component: () => import('pages/RecuperacionPage.vue')
  },
  {
    path: '/reportes',
    component: () => import('pages/ReportesPage.vue')
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/menu', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: '/newhistory', component: () => import('pages/NewHistory.vue'), meta: { requiresAuth: true } },
      { path: '/actualizar', component: () => import('pages/ActualizacionPage.vue'), meta: { requiresAuth: true } },
      { path: '/usuarios', component: () => import('pages/UsuariosPage.vue'), meta: { requiresAuth: true } },
      { path: '/registros', component: () => import('pages/RegistrosPage.vue'), meta: { requiresAuth: true } },
      { path: '/archivosmuertos', component: () => import('pages/ArchivosMuertosPage.vue'), meta: { requiresAuth: true } },
      { path: '/configuracion', component: () => import('pages/ConfiguracionPage.vue'), meta: { requiresAuth: true } },
      { path: '/notis', component: () => import('pages/notifyPage.vue'), meta: { requiresAuth: true } },
      { path: '/recipe', component: () => import('pages/RecipePage.vue'), meta: { requiresAuth: true } }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
