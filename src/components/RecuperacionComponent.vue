<template>
  <div class="card-container">
    <q-card class="my-card" style="width: 300px;">
      <div class="input-container">

        <form @submit.prevent="handleRecoverEmail">
        <q-input
          v-model="newPassword"
          :class="{'error-input': passError}"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Nueva Contraseña"
          :dense="dense"
          style="width: 100%; background-color: #1e1e2f; border-radius: 16px; color: white; margin-bottom: 20px;">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" style="cursor: pointer;" />
          </template>
        </q-input>

        <q-input
          v-model="verifiPass"
          :class="{'error-input': verifiPassError}"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Verifique su contraseña"
          :dense="dense"
          style="width: 100%; background-color: #1e1e2f; border-radius: 16px; color: white;" />

        <q-btn @click="handleResetPassword" label="Cambiar Contraseña" color="primary" style="margin-top: 20px;" />

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
      </div>
    </q-card>
  </div>
</template>

<script setup>
/* import { ref } from 'vue'
import { getAuth, confirmPasswordReset } from 'firebase/auth'
import { useRoute } from 'vue-router'

async function handleResetPassword () {
  const auth = getAuth()
  const route = useRoute()
  const code = route.query.oobCode // Token enviado por correo
  const newPassword = ref('') // Nueva contraseña
  const verifiPass = ref('') // Confirmación de nueva contraseña

  if (newPassword.value !== verifiPass.value) {
    alert('Las contraseñas no coinciden.')
    return
  }

  try {
    await confirmPasswordReset(auth, code, newPassword.value)
    alert('Contraseña restablecida con éxito.')
  } catch (error) {
    console.error('Error al restablecer la contraseña: ', error)
    alert('Ocurrió un error: ' + error.message)
  }
}
*/
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10%;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
