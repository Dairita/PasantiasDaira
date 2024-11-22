<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-teal-8 text-white">
      <q-btn flat round dense icon="assignment_ind" @click="showSection('unconfirmed')">
        <q-badge floating color="red">{{ unconfirmedUsers.length }}</q-badge>
      </q-btn>

      <q-toolbar-title>Solicitudes de acceso</q-toolbar-title>

      <q-btn flat round dense icon="account_circle" class="q-mr-xs" @click="showSection('confirmed')" />
      <q-btn flat round dense icon="add_circle" class="q-mr-xs" @click="showSection('form')"/>
    </q-toolbar>

    <form style="padding: 50px; text-align: center; min-width: 50%; background-image: linear-gradient(to bottom,  rgba(0, 150, 136, 0.8), rgba(255, 255, 255, 0.1));">
    <form @submit.prevent="updateUser" class="centered-form" >
      <div style="margin-top: 7%;">
        <div class="q-gutter-md" style="margin-left: 3px;">
          <q-card-section style="padding: 1%; margin-top: 5%;">
            <h3 style="margin-top: -5%; font-weight: bold; font-family: 'Arial', sans-serif;">
              Usuarios
            </h3>

            <div v-if="currentSection === 'unconfirmed'">
              <div v-if="unconfirmedUsers.length === 0" class="no-requests" style="color: Black; text-align: center; font-size: 1.5em; padding: 10%;">
                No hay solicitudes en este momento
              </div>

              <div v-for="user in unconfirmedUsers"  @click="openDialog(user)" :key="user.id" class="user-row">

                <q-expansion-item
                dense
                dense-toggle
                expand-separator
                :label="user.username"
                caption="Ajustes de la cuenta"
                style="width: 100%;"
              >
              <template v-slot:header>
                <q-item-section>
                  <span>{{ user.username }}</span>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <div><strong>Nombre:</strong> {{ user.username }}</div>
                  <div><strong>Email:</strong> {{ user.email }}</div>
                  <div><strong>Fecha de creación:</strong> {{ user.fechaCreacion }}</div>
                  <div><strong>Ultima hora de ingreso:</strong> {{ user.horaIngreso }}</div>
                  <div><strong>Ultima hora de salida:</strong> {{ user.horaSalida }}</div>
                  <div><strong>Rol:</strong> {{ user.role }}</div>
                  <div>
                    <strong>Cuenta: </strong>
                    <span>{{ user.confirmed ? 'Activa' : 'Inactiva' }}</span>
                    <q-toggle
                      v-model="user.confirmed"
                      @click="updateConfirmed(user)"
                      :color="user.confirmed ? 'green' : 'red'"
                    />
                  </div>

                  <q-btn color="teal-9" label="Actividad del Usuario" @click="mostrarDialogo(user)" />
               </q-card-section>
              </q-card>
              <q-dialog v-model="dialogv">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Actividad del Usuario</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section style="max-height: 50vh; overflow-y: auto;">
                    <div v-if="loading">Cargando actividad...</div>
                    <ul v-else>
                      <li v-for="(activity, index) in activities" :key="index">{{ activity.mensaje }}</li>
                    </ul>
                    <div v-if="!activities.length">No hay actividad registrada.</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" @click="dialogv = false" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-expansion-item>
              </div>
            </div>

            <div v-else-if="currentSection === 'confirmed'">
              <div v-for="user in adminUsers" :key="user.id" class="user-row">
                <span>{{ user.username }}</span>
                <span>{{ user.email }}</span>
                <span>{{ user.role }}</span>
              </div>
              <div v-for="user in commonUsers" @click="openDialog(user)" :key="user.id" class="user-row">

                <q-expansion-item
                  dense
                  dense-toggle
                  expand-separator
                  icon="perm_identity"
                  :label="user.username"
                  caption="Ajustes de la cuenta"
                  style="width: 100%;"
                >
                    <template v-slot:header>
                      <q-item-section>
                        <span>{{ user.username }}</span>
                      </q-item-section>
                    </template>

                <q-card>
                  <q-card-section>
                    <div><strong>Nombre:</strong> {{ user.username }}</div>
                    <div><strong>Email:</strong> {{ user.email }}</div>
                    <div><strong>Fecha de creación:</strong> {{ user.fechaCreacion }}</div>
                    <div><strong>Ultima hora de ingreso:</strong> {{ user.horaIngreso }}</div>
                    <div><strong>Ultima hora de salida:</strong> {{ user.horaSalida }}</div>
                    <div><strong>Rol:</strong> {{ user.role }}</div>
                    <div>
                      <strong>Cuenta: </strong>
                      <span>{{ user.confirmed ? 'Activa' : 'Inactiva' }}</span>
                      <q-toggle
                        v-model="user.confirmed"
                        @click="updateConfirmed(user)"
                        :color="user.confirmed ? 'green' : 'red'"
                      />
                    </div>
                    <q-btn color="teal-9" label="Actividad del Usuario" @click="mostrarDialogo(user)" />
                  </q-card-section>
                </q-card>

                <q-dialog v-model="dialogv">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6">Actividad del Usuario</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section style="max-height: 50vh; overflow-y: auto;">
                      <div v-if="loading">Cargando actividad...</div>
                      <ul v-else>
                        <li v-for="(activity, index) in activities" :key="index">{{ activity.mensaje }}</li>
                      </ul>
                      <div v-if="!activities.length">No hay actividad registrada.</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                      <q-btn flat label="Cerrar" color="primary" @click="dialogv = false" />
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-expansion-item>
            </div>
          </div>

            <div v-else-if="currentSection === 'form'">
              <div class="q-pa-md relative-" style="height: 50%; margin-top: -3%">
                <q-card-section class="text-h6">Nuevo usuario</q-card-section>

                <q-card-section class="text-subtitle1" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <div class="q-gutter-md" style="width: 100%; max-width: 400px;">
                    <q-input v-model="username" :class="{ 'error-input': usernameError }" filled label="Nombre de usuario"
                      style="margin-bottom: 10px; background-color: #1e1e2f; border-radius: 16px; color: white;" />

                    <q-input v-model="email" :class="{ 'error-input': emailError }" filled label="Email"
                      style="margin-bottom: 10px; background-color: #1e1e2f; border-radius: 16px; color: white;" />

                    <q-input v-model="pass" :class="{ 'error-input': passError }" filled :type="isPwd ? 'password' : 'text'" label="Contraseña"
                      style="margin-bottom: 10px; background-color: #1e1e2f; border-radius: 16px; color: white;">
                      <template v-slot:append>   <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"  style="cursor: pointer;"/> </template>
                    </q-input>

                    <q-input v-model="verifiPass" :class="{ 'error-input': verifiPassError }" filled :type="isPwd ? 'password' : 'text'" label="Verifique su contraseña"
                      style="margin-bottom: 10px; background-color: #1e1e2f; border-radius: 16px; color: white;" />

                    <div v-if="errorMessage" style="color: red; margin-top: 10px;">
                      {{ errorMessage }}
                    </div>
                    <div style="margin-top: 20px;">
                      <q-btn push type="submit" style="width: 100%; max-width: 150px; background-color: #1e1e2f; border-radius: 16px; color: white;" label='REGISTRATE' color='green-8' @click.prevent='registrar()'/>
                    </div>
                  </div>
                </q-card-section>
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </form>
  </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, getFirestore } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const dialogv = ref(false) // Asegúrate de definir esta variable
const activities = ref([])
const loading = ref(false)
const selectedUser = ref({})

const confirmedUsers = computed(() => users.value.filter(user => user.confirmed))
const unconfirmedUsers = computed(() => users.value.filter(user => !user.confirmed))
const adminUsers = computed(() => users.value.filter(user => user.role === 'admin'))
const commonUsers = computed(() => confirmedUsers.value.filter(user => user.role === 'user'))

const mostrarDialogo = async (user) => {
  console.log(user.email)
  if (!user || !user.email) {
    console.error('El usuario o el email del usuario están indefinidos')
    return // Salir si el usuario no es válido
  }

  selectedUser.value = user // Guarda el usuario seleccionado
  loading.value = true
  dialogv.value = true // Cambia a true para mostrar el diálogo

  const firestore = getFirestore()
  const userDocRef = doc(firestore, 'usersColecction', user.email) // Asegúrate de que user.email sea válido
  const actividadCollectionRef = collection(userDocRef, 'actividad')

  try {
    const querySnapshot = await getDocs(actividadCollectionRef)
    activities.value = querySnapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error al obtener las actividades:', error)
    activities.value = []
  } finally {
    loading.value = false // Asegúrate de restablecer el estado de carga
  }
}

const cargarUsuarios = async () => {
  try {
    const usersSnapshot = await getDocs(collection(firestore, 'usersColecction'))
    users.value = usersSnapshot.docs.map(userDoc => {
      const userData = userDoc.data()
      userData.id = userDoc.id
      return userData
    })
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

const router = useRouter()
const dialogVisible = ref(false)

function openDialog (user) {
  selectedUser.value = user
  dialogVisible.value = true
}

onMounted(() => {
  cargarUsuarios()
})

const users = ref([])
const username = ref('')
const email = ref('')
const pass = ref('')
const verifiPass = ref('')
const errorMessage = ref('')
const isPwd = ref(true)

const usernameError = ref(false)
const emailError = ref(false)
const passError = ref(false)
const verifiPassError = ref(false)

const currentSection = ref('unconfirmed')

const showSection = (section) => {
  currentSection.value = section
}

const registrar = async () => {
  if (!username.value || !email.value || !pass.value || !verifiPass.value) {
    errorMessage.value = 'Todos los campos son obligatorios.'
    return
  }

  if (pass.value !== verifiPass.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  const emailDocRef = doc(firestore, 'usersColecction', email.value)
  const emailDoc = await getDoc(emailDocRef)

  if (emailDoc.exists()) {
    errorMessage.value = 'Este email ya está en uso.'
    return
  }

  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, pass.value)

    const userDocRef = doc(firestore, 'usersColecction', userCredential.user.email)

    const fechaCreacion = new Date()

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }

    const formattedDate = fechaCreacion.toLocaleString('es-ES', options).replace(',', '')

    await setDoc(userDocRef, {
      username: username.value,
      email: userCredential.user.email,
      role: 'user',
      confirmed: true,
      fechaCreacion: formattedDate

    })

    username.value = ''
    email.value = ''
    pass.value = ''
    verifiPass.value = ''
    errorMessage.value = ''

    alert('Registro exitoso')
    router.replace('/')
  } catch (error) {
    console.error('Error al registrar el usuario:', error)
    errorMessage.value = error.message
  }
}

const validatePassword = (password) => {
  const regex = /^.{1,8}$/
  return regex.test(password)
}

watch([pass, verifiPass], () => {
  if (pass.value !== verifiPass.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    passError.value = true
    verifiPassError.value = true
  } else if (!validatePassword(pass.value)) {
    passError.value = true
    verifiPassError.value = true
  } else {
    errorMessage.value = ''
    passError.value = false
    verifiPassError.value = false
  }
})

const updateConfirmed = async (user) => {
  console.log('Cambié el estado del checkbox a:', user.confirmed)
  try {
    const userRef = doc(firestore, 'usersColecction', user.id)
    await updateDoc(userRef, { confirmed: user.confirmed }) // Actualiza el campo confirmed
    console.log('Estado guardado correctamente:', user.confirmed)
  } catch (error) {
    console.error('Error al guardar el estado:', error)
  }
}

</script>

<style scoped>

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(28, 119, 134); /* Fondo blanco para cada fila */
  box-shadow: 0px 2px 5px rgba(21, 8, 139, 0.5); /* Sombra gris claro */
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px; /* Ajustar para hacer más delgado */
  margin-bottom: 5px; /* Espaciado entre filas */
  border: 1px solid #ccc; /* Opcional, para visualizar el rectángulo */
  border-radius: 4px; /* Bordes redondeados opcionales */
  transition: transform 0.2s ease; /* Transición suave para el zoom */
}

.user-row:hover {
  transform: scale(1.01); /* Aumentar ligeramente el tamaño al pasar el mouse */
}

.username {
  font-weight: bold; /* Hacer que el nombre de usuario esté en negrita */
}

.button-group {
  display: flex; /* Utiliza flexbox para alinear los botones */
  gap: 0.5rem; /* Espacio entre los botones */
}

@media (max-width: 600px) {
  body {
    font-size: 1.2em; /* Aumentar el tamaño de fuente en pantallas pequeñas */
  }
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
}

.centered-form {
  text-align: center;
  width: 50%;
  margin-top: -20px; /* Add space between the toolbar and the form */
  padding: 50px; /* Optional padding for better appearance */
  margin-left: 25%;
}
</style>
