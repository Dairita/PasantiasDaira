<template>
  <div class="q-pa-md">
    <form @submit.prevent="updateUsername" style="padding: 150px; text-align: center; min-width: 100%; background-image: linear-gradient( #1989,#3333); border-radius: 30px;">
      <div class="q-pa-md" style="max-width: 1000px; margin-left: 20%;">
        <q-list padding bordered class="rounded-borders">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            icon="perm_identity"
            label="Ajustes de la cuenta"

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
                      @click="$router.push('/correo')"
                      style="width: 50%; margin-left: -7%;"
                    />
                  </div>

                  <div style="margin-top: 20px;">
                    <q-btn
                      type="button"
                      label="Eliminar Cuenta"
                      color="teal-9"
                      style="width: 50%; margin-left: -7%;"
                      @click="showConfirmation = !showConfirmation"
                    />

                    <div v-if="showConfirmation" style="margin-top: 20px;">
                      <h5 style="color: green; font-weight: bold;">Eliminar Cuenta</h5>
                      <input
                        type="password"
                        v-model="password"
                        placeholder="Ingresa tu contraseña"
                        style="margin-bottom: 10px; width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
                      />

                      <button @click="deleteAccount" style="padding: 10px 15px; border-radius: 4px; background-color: teal; color: white; border: none;">
                        Eliminar Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <div style="margin-top: 7%;"></div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, query, getDocs, where } from 'firebase/firestore'
import { useRouter } from 'vue-router' // Import useRoute
const router = useRouter() // Create a router instance

const username = ref('')
const email = ref('')

const auth = getAuth()
const db = getFirestore()

const showConfirmation = ref(false)
const password = ref('')

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    const userDocRef = doc(db, 'usersColecction', user.email)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const data = userDoc.data()
      username.value = data.username || ''
      email.value = data.email || ''
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

async function deleteAccount () {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const credential = EmailAuthProvider.credential(user.email, password.value)

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential)

      const db = getFirestore()
      const usersCollectionRef = collection(db, 'usersColecction')
      const q = query(usersCollectionRef, where('email', '==', user.email))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref
        const userData = querySnapshot.docs[0].data()

        if (userData.role === 'admin') {
          alert('Eres administrador, no puedes eliminar tu cuenta')
          return
        }
        await deleteDoc(userDocRef)
        await user.delete()

        alert('Cuenta eliminada con éxito.')
        router.push('/')
      } else {
        alert('No se encontró la cuenta en la colección.')
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error)
      alert('Ocurrió un error: ' + error.message)
    }
  } else {
    alert('No hay ningún usuario autenticado.')
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
</style>
