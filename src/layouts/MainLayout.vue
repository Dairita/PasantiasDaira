<template>
    <q-layout view="hHh Lpr lff" container style="height: 300px" class="shadow-2 rounded-border background-image">
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
          <q-toolbar-title class="text-teal-9 text-bold">Hospital Adventista de Venezuela</q-toolbar-title>

        <q-btn v-if="isAdmin" round dense flat color="grey-8" icon="notifications" @click="showNotifications">
          <q-badge v-if="notificationCount > 0" color="red" text-color="white" floating>
            {{ notificationCount }}
          </q-badge>
          <q-tooltip>Notificaciones</q-tooltip>

        </q-btn>

          <div class="text-teal-9 text-bold">{{ userName }}</div>
        </q-toolbar>

      </q-header>

  <q-drawer
  v-model="drawer"
  show-if-above

  :mini="miniState"
  @mouseenter="miniState = false"
  @mouseleave="miniState = true"

  :width="250"
  :breakpoint="500"
  bordered
  :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
>

<q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
  <q-item-label header>
    <img alt="logo" src="~assets/images-removebg-preview.png" style="width: 50%; margin-left: 20%;" />
  </q-item-label>

  <q-list padding>
    <q-item
      v-for="(item, index) in filteredMenuItems"
      :key="index"
      :to="item.link"
      @click="() => navigateTo(item.link)"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>

      <q-item-section>
        {{ item.title }}
      </q-item-section>
    </q-item>

    <q-separator />

    <q-item clickable v-ripple @click="logout">
      <q-item-section avatar>
        <q-icon name="logout" />
      </q-item-section>

      <q-item-section>
        Salir
      </q-item-section>
    </q-item>
  </q-list>
</q-scroll-area>
</q-drawer>

<q-page-container>
  <router-view />
  <q-inner-loading
    :showing="loading"
    label="Please wait..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</q-page-container>
  </q-layout>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter, useRoute } from 'vue-router'

import useNotificaciones from 'boot/useNotificaciones'

const { contarNotificacionesNoVistas, obtenerNotificaciones } = useNotificaciones()

const notificationCount = computed(() => contarNotificacionesNoVistas())

const showNotifications = () => {
  router.push('/notis')
  const notifications = obtenerNotificaciones()
  notifications.forEach(notif => {
    notif.visto = true
  })
}
const router = useRouter()
const loading = ref(false)
const route = useRoute()

const startLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 5000)
}

watch(route, (to) => {
  if (to.path === '/registros') {
    startLoading()
  } else {
    loading.value = false
  }
})

const userName = ref('')
const drawer = ref(false)
const miniState = ref(true)
const visible = ref(false)

onMounted(async () => {
  const auth = getAuth()

  if (route.path === '/registros') {
    startLoading()
  }
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userName.value = user.email
      await fetchUserRole(user.email)
    } else {
      userName.value = ''
      console.log('No hay usuario autenticado')
    }
  })
})

const isAdmin = computed(() => userRole.value === 'admin')

const navigateTo = (link) => {
  visible.value = true

  router.push(link).then(() => {
    setTimeout(() => {
      visible.value = false
    }, 5000)
  })
}

defineOptions({
  name: 'MainLayout'
})

const userRole = ref('')

const menuItems = ref([
  {
    title: 'Usuarios',
    icon: 'group',
    link: '/usuarios',
    role: ['admin']
  },
  {
    title: 'Nueva Historia Medica',
    icon: 'library_add',
    link: '/newhistory',
    role: ['admin', 'user']
  },
  {
    title: 'Registros',
    icon: 'how_to_reg',
    link: '/registros',
    role: ['admin', 'user']
  },
  {
    title: 'Archivados',
    icon: 'folder_delete',
    link: '/archivosmuertos',
    role: ['admin']
  },
  {
    title: 'Configuracion',
    icon: 'settings',
    link: '/configuracion',
    role: ['admin', 'user']
  }
])

const fetchUserRole = async (email) => {
  const userDocRef = doc(firestore, 'usersColecction', email)
  const userSnapshot = await getDoc(userDocRef)

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data()
    userRole.value = userData.role
  } else {
    console.log('El usuario no existe en la base de datos')
  }
}

const filteredMenuItems = computed(() => {
  return menuItems.value.filter(item =>
    item.role.some(role => userRole.value.includes(role))
  )
})

const logout = async () => {
  const confirmation = confirm('¿Deseas cerrar sesión?')

  if (confirmation) {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (user) {
        const userDocRef = doc(firestore, 'usersColecction', user.email)
        const horaSalida = formatDate(new Date())
        await updateDoc(userDocRef, { horaSalida })
      }

      await auth.signOut()
      console.log('Usuario ha cerrado sesión exitosamente.')

      router.replace('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  } else {
    console.log('Cierre de sesión cancelado.')
  }
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return formattedDate.replace(',', '').replace('AM', 'AM').replace('PM', 'PM')
}

</script>

<style scoped>
.emerald-toolbar {
  background-color: #2cb0c7;
  color: rgb(0, 0, 0);
  border-radius: 1000;
}

.q-layout {
  height: 100vh;
  overflow: hidden;
  opacity: 10;
}

.background-image {
  background-image: url('src/assets/Hospital-Adventista.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
}

.custom-header {
  padding: 10px;
  background-color: #2cb0c7;
}

.user-image-container {
  width: 40px; /* Ajusta según sea necesario */
  height: 40px; /* Ajusta según sea necesario */
  border-radius: 50%; /* Para hacerla circular */
  overflow: hidden; /* Para ocultar cualquier desbordamiento */
  margin-left: auto; /* Para alinear a la derecha */
}

.user-image {
  width: 100%;
  height: auto;
}
</style>
