<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-teal-5 text-white">
      <q-btn flat round dense icon="assignment_ind" @click="showSection('unconfirmed')">
        <q-badge floating color="red">{{ unconfirmedUsers.length }}</q-badge>
      </q-btn>

      <q-toolbar-title>Solicitudes de acceso</q-toolbar-title>

      <q-btn flat round dense icon="account_circle" class="q-mr-xs" @click="showSection('confirmed')" />
      <q-btn flat round dense icon="add_circle" class="q-mr-xs" @click="showSection('form')" />
    </q-toolbar>

    <form @submit.prevent="updateUser" style="padding: 150px; text-align: center; min-width: 100%; background-image: linear-gradient( #1989,#3333);">
      <div style="margin-top: 7%;">
        <div class="q-gutter-md" style="margin-left: 3px;">
          <q-card-section style="padding: 1%; margin-top: 5%;">

            <div v-if="currentSection === 'unconfirmed'">
              <div v-if="unconfirmedUsers.length === 0" class="no-requests" style="color: Black; text-align: center; font-size: 1.5em; padding: 10%;">
                No hay solicitudes en este momento
              </div>

              <div v-for="user in unconfirmedUsers"  @click="openDialog(user)" :key="user.id" class="user-row">

                <q-expansion-item
                dense
                dense-toggle
                expand-separator
                icon="perm_identity"
                :label="user.username"
                caption="Ajustes de la cuenta"
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
                  <div><strong>Rol:</strong> {{ user.role }}</div>
                  <div><strong>Fecha de creación:</strong> {{ user.fechaCreacion }}</div>
                  <div>
                    <strong>Cuenta: </strong>
                    <span>{{ user.confirmed ? 'Activa' : 'Inactiva' }}</span>
                    <q-toggle
                      v-model="user.confirmed"
                      @click="updateConfirmed(user)"
                      :color="user.confirmed ? 'green' : 'red'"
                    />
                  </div>
                  <q-btn icon="delete" text-color="red" round />
               </q-card-section>
              </q-card>
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
                    <div><strong>Rol:</strong> {{ user.role }}</div>
                    <div><strong>Fecha de creación:</strong> {{ user.fechaCreacion }}</div>
                    <div>
                      <strong>Cuenta: </strong>
                      <span>{{ user.confirmed ? 'Activa' : 'Inactiva' }}</span>
                <q-toggle
                  v-model="user.confirmed"
                  @click="updateConfirmed(user)"
                  :color="user.confirmed ? 'green' : 'red'"
                />
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </div>

            <div v-else-if="currentSection === 'form'">
              <div class="q-pa-md relative-" style="height: 50%; margin-top: -10%">
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { collection, getDocs, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const dialogVisible = ref(false)
const selectedUser = ref({})
function openDialog (user) {
  selectedUser.value = user // Asignar el usuario seleccionado
  dialogVisible.value = true // Mostrar el diálogo
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

    await createUserWithEmailAndPassword(auth, email.value, pass.value)

    const userDocRef = doc(firestore, 'usersColecction', email.value)
    await setDoc(userDocRef, {
      username: username.value,
      email: email.value,
      role: 'user',
      confirmed: true
    })

    // Clear input fields
    username.value = ''
    email.value = ''
    pass.value = ''
    verifiPass.value = ''
    errorMessage.value = ''

    alert('Registro exitoso. Puedes iniciar sesión ahora.')
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

const confirmedUsers = computed(() => users.value.filter(user => user.confirmed))
const unconfirmedUsers = computed(() => users.value.filter(user => !user.confirmed))
const adminUsers = computed(() => users.value.filter(user => user.role === 'admin'))
const commonUsers = computed(() => confirmedUsers.value.filter(user => user.role === 'user'))

</script>

<style scoped>
.notificacion-rectangle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px; /* Espaciado entre notificaciones */
}

.no-notificaciones {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}

.notificacion-rectangle {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: rgb(19, 94, 105); /* Fondo blanco para cada fila */
  box-shadow: 0px 2px 5px rgba(21, 8, 139, 0.5); /* Sombra gris claro */
}
.notificaciones-container {
  height: 400px; /* Altura máxima */
  width: 600%; /* Ancho máximo */
  overflow-y: auto; /* Desplazamiento vertical si hay más contenido */
  overflow-x: hidden; /* Ocultar desplazamiento horizontal */
}
.panel-container {
  width: 100%;
  height: 200%;
  overflow: auto; /* Permite el desplazamiento si el contenido excede el tamaño */
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
  transform: scale(1.02); /* Aumentar ligeramente el tamaño al pasar el mouse */
}

.username {
  font-weight: bold; /* Hacer que el nombre de usuario esté en negrita */
}

.panel-container-width {
  width: 10rem;  /* Ajusta el valor según tu diseño */
  height: 30rem; /* Ajusta el valor según tu diseño */
  display: flex; /* Permite que los elementos hijos se alineen correctamente */
  flex-direction: column; /* Alinea los elementos en una columna */
  padding: 1rem; /* Agrega un poco de espacio interno */
  box-sizing: border-box; /* Asegura que el padding no afecte el tamaño total */
}
.notificaciones-container {
  flex-grow: 1; /* Permite que este contenedor crezca para ocupar espacio disponible */
  overflow-y: auto; /* Activa el desplazamiento vertical si es necesario */
}
.button-group {
  display: flex; /* Utiliza flexbox para alinear los botones */
  gap: 0.5rem; /* Espacio entre los botones */
}
</style>
