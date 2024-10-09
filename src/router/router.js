import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth' // Asegúrate de importar Firebase Auth
import routes from './routes' // Asegúrate de importar tus rutas

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardas de navegación
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  // Verifica si la ruta requiere autenticación
  if (to.meta.requiresAuth && !user) {
    // Si no hay usuario autenticado, redirige a login
    next('/login')
  } else {
    // Permite el acceso a la ruta
    next()
  }
})

export default router
