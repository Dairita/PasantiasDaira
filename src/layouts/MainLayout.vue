<template>
  <q-layout view="lHh Lpr lFf" class="background-image">

    <div>
      <p v-if="filteredLinksList.length === 0">No tienes acceso a ninguna opción.</p>
    </div>
    <q-header elevated class="custom-header">
      <q-toolbar class="emerald-toolbar">
        <q-toolbar-title class="text-center text-bold">
          <div class="text-black-8 text-bold">Hospital Adventista de Venezuela</div>
        </q-toolbar-title>

        <div>
          <q-toolbar-title class="text-right text-bold">
            <div class="text-black-8 text-bold">user</div>
          </q-toolbar-title>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" style="background-color: white;">
      <q-list>
        <q-item-label header>
          <img alt="logo" src="src/assets/images-removebg-preview.png" style="width: 50%; margin-left: 20%;" />
        </q-item-label>

        <EssentialLink
          class="btnList bg-green-8 text-black"
          style="margin: 5%; width: 270px; height: 100px; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.9);"
          v-for="link in filteredLinksList"
          :key="link.title"
          v-bind="link"
        />

      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'

defineOptions({
  name: 'MainLayout'
})

// Reactive properties
const userRole = ref('') // This will hold the user's role after login
const leftDrawerOpen = ref(true)

// Links list with roles defined
const linksList = [
  {
    title: 'Usuarios',
    caption: 'Consultar Paciente',
    icon: 'how_to_reg',
    link: '/usuarios', // Ensure this link is defined
    role: ['admin'] // Only visible to admin
  },
  {
    title: 'Nueva Historia Medica',
    caption: 'Crear',
    icon: 'library_add',
    link: '/newhistory', // Visible to all users (admin and common)
    role: ['admin', 'user']
  },
  {
    title: 'Registros',
    caption: 'Consultar Paciente',
    icon: 'how_to_reg',
    link: '/registros', // Visible to all users (admin and common)
    role: ['admin', 'user']
  },
  {
    title: 'Archivos Muertos',
    caption: 'Crear',
    icon: 'library_add',
    role: ['admin'] // Only visible to admin
  },
  {
    title: 'Configuracion',
    caption: 'Crear',
    icon: 'library_add',
    role: ['admin, user'] // Only visible to admin
  }
]

// Function to fetch user role from Firestore
const fetchUserRole = async (email) => {
  const userDocRef = doc(firestore, 'usersColecction', email)
  const userSnapshot = await getDoc(userDocRef)

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data()
    userRole.value = userData.role // Store user role
  } else {
    console.log('El usuario no existe en la base de datos')
  }
}

// Fetch user role when component mounts
onMounted(async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    await fetchUserRole(user.email) // Fetch role for logged-in user
  } else {
    console.log('No hay usuario autenticado')
  }
})

// Computed property to filter links based on user role
const filteredLinksList = computed(() => {
  if (userRole.value === 'admin') {
    return linksList // Admin sees all links
  } else if (userRole.value === 'user') {
    return linksList.filter(link => link.role.includes('user')) // Common user sees specific links
  }

  return [] // If no role is set, return an empty array
})
</script>

<style scoped>
.emerald-toolbar {
  background-color: #369b64; /* Color verde esmeralda pastel */
  color: rgb(0, 0, 0); /* Cambia el color del texto si es necesario */
  border-radius: 1000;
}

.q-layout {
  height: 100vh; /* Asegura que el layout ocupe toda la altura de la ventana */
  overflow: hidden;
  opacity: 10;
}

.background-image {
  background-image: url('src/assets/Hospital-Adventista.jpg');
  background-size: cover; /* Asegura que la imagen cubra toda el área */
  background-position: center; /* Centra la imagen */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  min-height: 100vh; /* Asegura que cubra al menos toda la altura del viewport */
  width: 100%;
}

.custom-header {
  padding: 10px;
  background-color: #369b64;
  border-bottom-left-radius: 15%; /* Redondear esquina inferior izquierda */
  border-bottom-right-radius: 15%; /* Redondear esquina inferior derecha */
}

</style>
