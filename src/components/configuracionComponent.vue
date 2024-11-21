<template>
  <div class="q-pa-md">
    <form @submit.prevent="updateUsername" style="padding: 150px; text-align: center; min-width: 100%; background-image: linear-gradient( #1989,#3333); border-radius: 30px;">

      <q-card style="margin-top: -5%; border-radius: 16px; background-color: rgba(0, 128, 128, 0.9);">
        <q-card-section class="bg-teal-9 text-white" style="height: 100px;">
        <div class="flex items-center" style="margin-top: 1%; margin-left: 10%;">
          <q-avatar class="bg-teal-7" style="width: 100px; height: 100px;">
            <q-icon name="person" class="text-white" size="60px" />
          </q-avatar>
          <div class="q-ml-md">
            <h3 class="q-font-bold custom-font">{{ username }}</h3>
          </div>
        </div>
        <div style="margin-top: -11%; margin-left: 50%;"><h6>{{ email }}</h6></div>
        <div style="margin-top: -3%; margin-left: 71%; display: flex; align-items: center;">
          <h6 style="margin-right: 10px;">{{ getRoleName(user.role) }}</h6>
          <q-avatar class="bg-teal-9" style="width: 50px; height: 50px;">
            <q-icon
              :name="user.role === 'user' ? 'account_circle' : 'admin_panel_settings'"
              class="text-white"
              size="40px"
            />
          </q-avatar>
        </div>

        </q-card-section>
        <q-card-section>

          <div class="text-left" style="margin-left: 10%; margin-top: 8%;">

            <div style="margin-bottom: -40px;"><h6><strong>Fecha de creación:</strong> {{ user.fechaCreacion }}</h6></div>
            <div style="margin-bottom: -40px;"><h6><strong>Última hora de ingreso:</strong> {{ user.horaIngreso }}</h6></div>
            <div style="margin-bottom: -40px;"><h6><strong>Última hora de salida:</strong> {{ user.horaSalida }}</h6></div>

          </div>
        </q-card-section>

      <div class="q-pa-md" style="max-width: 600px; margin-left: 46%; margin-top: -5%; margin-bottom: 5%;">
        <q-list padding bordered class="rounded-borders">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            icon="perm_identity"
            label="Ajustes de la cuenta"
            class="bg-teal-9 text-white"
          >
            <q-card>
              <q-card-section>
                <div class="q-gutter-md" style="margin-left: 3px;">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <q-input
                      v-model="username"
                      filled
                      label="Nombre Medico"
                      :dense="dense"
                      style="width: 50%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                    />
                    <q-btn
                      type="submit"
                      color="teal-9"
                      style="margin-left: 10px;"
                      icon="badge"
                    />
                  </div>

                  <div style="margin-top: 20px;">
                    <q-btn
                      type="button"
                      label="Cambiar contraseña"
                       icon="password"
                      color="teal-9"
                      :loading="isLoading"
                      @click="handleChangePassword"
                      style="width: 50%; margin-left: -7%;"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>

    </q-card>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router' // Import useRoute
const router = useRouter() // Create a router instance

function getRoleName (role) {
  if (role === 'admin') {
    return 'Administrador'
  } else if (role === 'user') {
    return 'Médico'
  } else {
    return role // Devuelve el rol original si no coincide
  }
}

const username = ref('')
const email = ref('')

const auth = getAuth()
const db = getFirestore()

const isLoading = ref(false)

function handleChangePassword () {
  isLoading.value = true // Activar el estado de loading

  // Simular un retraso de 2 segundos
  setTimeout(() => {
    isLoading.value = false // Desactivar el estado de loading
    // Navegar a la ruta deseada
    router.push('/correo')
  }, 2000)
}
const user = ref({}) // Initialize user as a reactive object
onMounted(async () => {
  const currentUser = auth.currentUser
  if (currentUser) {
    const userDocRef = doc(db, 'usersColecction', currentUser.email)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const data = userDoc.data()
      username.value = data.username
      email.value = data.email || ''

      // Almacenar en localStorage
      localStorage.setItem('userData', JSON.stringify(data))

      user.value = {
        role: data.role,
        fechaCreacion: data.fechaCreacion,
        horaIngreso: data.horaIngreso,
        horaSalida: data.horaSalida,
        confirmed: data.confirmed
      }
    }
  } else {
    // Recuperar datos del localStorage si no hay usuario actual
    const storedData = localStorage.getItem('userData')
    if (storedData) {
      const data = JSON.parse(storedData)
      username.value = data.username
      email.value = data.email || ''
      user.value = {
        role: data.role,
        fechaCreacion: data.fechaCreacion,
        horaIngreso: data.horaIngreso,
        horaSalida: data.horaSalida,
        confirmed: data.confirmed
      }
    }
  }
})
const updateUsername = async () => {
  if (typeof username.value !== 'string' || username.value.trim() === '') {
    console.error('El nombre de usuario debe ser una cadena no vacía.')
    return
  }

  try {
    const userRef = doc(db, 'usersColecction', email.value)
    await updateDoc(userRef, {
      username: username.value
    })
    console.log('Nombre de usuario actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar el nombre de usuario:', error)
  }
}

</script>

<style scoped>
.dark-mode {
    background-color: #121212;
    color: white;
}
.error-input {
    border-color: rgb(202, 23, 10);
}

.text-custom {
  color: #a2aa33 !important; /* Define tu color personalizado */
}

.bg-custom {
  background: #a2aa33 !important; /* Define tu fondo personalizado */
}
.custom-font {
  font-family: 'Roboto', sans-serif; /* Cambia 'Roboto' por la fuente que prefieras */
  font-size: 50px; /* Ajusta el tamaño de la fuente según sea necesario */
}
</style>
