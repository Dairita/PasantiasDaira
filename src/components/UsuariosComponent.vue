<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; overflow: auto; align-items: center;">
    <q-card class="my-card bg-white text-black" style="margin-bottom: 5%; margin-top: 3%; border-radius: 50px; border: 20px solid #007A7C; opacity: 100; width: 90%;">
      <q-card-section style="padding: 10%; margin-top: -10%;">
        <h2>{{ showConfirmed ? 'Usuarios Confirmados' : 'Lista de Solicitudes' }}</h2>

        <div v-if="filteredUsers.length === 0" class="no-requests" style="color: gray; text-align: center; font-size: 1.5em; padding: 10%;">
          No hay solicitudes en este momento
        </div>

        <div v-for="user in filteredUsers" :key="user.id" class="user-row">
          <span>{{ user.username }}</span>
          <span>{{ user.email }}</span>
          <q-checkbox v-model="user.confirmed" @click="updateConfirmed(user)"/>
        </div>

        <q-btn @click="toggleList" label="Siguiente" color="primary" class="q-mt-md"/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'

const showConfirmed = ref(false)
const users = ref([])

const cargarUsuarios = async () => {
  const usersSnapshot = await getDocs(collection(firestore, 'usersColecction'))
  users.value = usersSnapshot.docs.map(userDoc => {
    const userData = userDoc.data()
    userData.id = userDoc.id
    return userData
  })
}

const updateConfirmed = async (user) => {
  console.log('Cambié el estado del checkbox a:', user.confirmed)

  // Guarda el nuevo estado en Firestore
  try {
    const userRef = doc(firestore, 'usersColecction', user.id)
    await updateDoc(userRef, { confirmed: user.confirmed }) // Actualiza el campo confirmed
    console.log('Estado guardado correctamente:', user.confirmed)
  } catch (error) {
    console.error('Error al guardar el estado:', error)
  }
}

const toggleList = () => {
  showConfirmed.value = !showConfirmed.value
}

const filteredUsers = computed(() => {
  // Filtrar usuarios según el estado del checkbox
  return showConfirmed.value
    ? users.value.filter(user => user.confirmed) // Solo usuarios confirmados
    : users.value.filter(user => !user.confirmed) // Solo usuarios no confirmados
})

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px; /* Espaciado interno para mejor apariencia */
  border-radius: 8px; /* Bordes redondeados */
  background-color: rgb(95, 108, 110); /* Fondo blanco para cada fila */
  box-shadow: 0px 2px 5px rgba(200, 200, 200, 0.5); /* Sombra gris claro */
}
</style>
