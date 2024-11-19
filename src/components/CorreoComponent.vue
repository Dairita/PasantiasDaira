<template>
  <q-card class="my-card" style="width: 300px ">
    <q-card-section>
      <div class="text-h6">Ingresa tu email</div>
      <q-input
        v-model="emailAddress"
        type="email"
        label="Tu email"
        filled
      />
    </q-card-section>
    <q-card-actions>
      <q-btn @click="recoverPass" label="Enviar" color="green" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { ref } from 'vue'

const emailAddress = ref('')

async function recoverPass () {
  const auth = getAuth()

  if (!emailAddress.value) {
    alert('Por favor, ingresa un correo electrónico.')
    return
  }

  try {
    await sendPasswordResetEmail(auth, emailAddress.value)

    alert('Alerta, se ha enviado un correo a su cuenta. Por favor sigue los pasos')
  } catch (error) {
    console.error('Error al enviar el correo: ', error)
    alert('Ocurrió un error: ' + error.message)
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  margin-left: 43%;
  margin-top: 18%;
}
</style>
