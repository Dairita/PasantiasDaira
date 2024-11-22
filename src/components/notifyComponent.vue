<template>
  <div class="q-ma-md notification-panel" style="margin-left: 5%;">
    <div class="text-h6">Notificaciones</div>

    <div class="button-group" style="display: flex; align-items: center;">
      <q-btn @click="tabSeleccionado = 'todo'" :color="tabSeleccionado === 'todo' ? 'primary' : 'grey'" label="Todo" style="min-width: 100px; margin-right: 10px;" />
      <q-btn @click="tabSeleccionado = 'hoy'" :color="tabSeleccionado === 'hoy' ? 'primary' : 'grey'" label="Hoy" style="min-width: 100px; margin-right: 10px;" />
      <q-btn @click="tabSeleccionado = 'mes'" :color="tabSeleccionado === 'mes' ? 'primary' : 'grey'" label="Mes" style="min-width: 100px; margin-right: 10px;" />

      <div class="button-group" style="display: flex; align-items: center;">
        <q-btn
          @click="marcarTodo"
          :loading="loading"
          label="Marcar todo como leídos"
          style="min-width: 100px; margin-right: 10px;"
        />
      </div>

      <div v-if="tabSeleccionado === 'mes'" class="month-selector" style="margin-left: auto;">
        <q-select
          v-model="mesSeleccionado"
          :options="meses"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          filled
          label="Mes"
          style="margin-top: 5%; min-width: 150px; margin-left: -50%;"
        />
      </div>

    </div>

    <div v-if="filtradas.length === 0" class="no-notificaciones">
      No hay actividad en este momento.
    </div>

    <div v-else>
      <div class="notificaciones-container">
        <div
          v-for="(notificacion, index) in ordenadas"
          :key="index"
          class="notificacion-rectangle"
          :style="{ backgroundColor: notificacion.visto ? 'white' : '#ffcccb' }"
          @click="marcarComoLeido(notificacion)"
        >
          {{ notificacion.Actividad }}
          {{ notificacion.fecha }}
          {{ notificacion.hora }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, onSnapshot, updateDoc, getDocs } from 'firebase/firestore'
import { firestore } from 'boot/firebase'

import useNotificaciones from 'boot/useNotificaciones'

const { obtenerNotificaciones } = useNotificaciones()
const notificaciones = ref(obtenerNotificaciones())

const marcarComoLeido = async (notificacion) => {
  const docRef = doc(firestore, 'Movimientos', notificacion.id)

  await updateDoc(docRef, { visto: true })
}
const loading = ref(false)

const marcarTodo = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))

  const movimientosRef = collection(firestore, 'Movimientos')
  const snapshot = await getDocs(movimientosRef)

  const promises = snapshot.docs.map(doc => {
    const notificacion = doc.data()
    if (!notificacion.visto) {
      return updateDoc(doc.ref, { visto: true })
    }
    return null
  })

  await Promise.all(promises)
  loading.value = false
}

const meses = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 }
]
const mesSeleccionado = ref(new Date().getMonth() + 1)

const filtradas = computed(() => {
  const hoy = new Date()
  const diaHoy = hoy.getDate()
  const mesHoy = hoy.getMonth() + 1
  const anioHoy = hoy.getFullYear()

  if (tabSeleccionado.value === 'hoy') {
    return notificaciones.value.filter(notificacion => {
      const fechaNotificacion = new Date(notificacion.fecha)
      return fechaNotificacion.getDate() === diaHoy &&
             fechaNotificacion.getMonth() + 1 === mesHoy &&
             fechaNotificacion.getFullYear() === anioHoy
    })
  } else if (tabSeleccionado.value === 'mes') {
    return notificaciones.value.filter(notificacion => {
      const fechaNotificacion = new Date(notificacion.fecha)
      return fechaNotificacion.getMonth() + 1 === mesSeleccionado.value &&
             fechaNotificacion.getFullYear() === anioHoy
    })
  }

  return notificaciones.value
})

const ordenadas = computed(() => {
  const copiaFiltradas = [...filtradas.value]
  return copiaFiltradas.sort((a, b) => {
    const dateA = new Date(`${a.fecha} ${a.hora}`)
    const dateB = new Date(`${b.fecha} ${b.hora}`)
    return dateB - dateA
  })
})

onMounted(() => {
  const movimientosRef = collection(firestore, 'Movimientos')
  onSnapshot(movimientosRef, (snapshot) => {
    notificaciones.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) // Agregar ID para actualizar más tarde
    filtradas.value = notificaciones.value
  })
})
const tabSeleccionado = ref('todo')

const userName = ref('')

onMounted(async () => {
  const auth = getAuth()
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
const userRole = ref('')

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

</script>

<style scoped>

.notification-panel {
  padding: 16px;
  background-color: rgb(175, 175, 175);
  border-radius: 10px;
  box-shadow: 0px 2px 1px rgba(66, 55, 55, 0.1);
  width: 60%;
  height: 70%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
}

.notification-panel::-webkit-scrollbar {
  width: 8px;
}

.notification-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.notification-panel::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.notification-panel::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
.notificacion-rectangle {
  margin-top: 10px;
  padding: 20px;
  margin-bottom: 5px;
  border: 2px solid #007B7F; /* Color teal-9 */
  color: black; /* Letras en negro */
  background-color: white; /* Fondo blanco */
  border-radius: 10px; /* Bordes redondeados */
}
</style>
