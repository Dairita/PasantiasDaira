<template>
  <div :class="{'dark-mode': isDarkMode}">
    <div class="q-pa-md">
      <form @submit.prevent="updateUser" style="padding: 150px; text-align: center; min-width: 100%; background-image: linear-gradient(#a9a9a977, #33333377); border-radius: 30px;">
        <div class="q-gutter-md">
        </div>
        <div style="margin-top: 7%;">
          <div class="q-gutter-md" style="margin-left: 3px;">
            <q-input v-model="username" filled label="Nombre de usuario" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;" />
            <q-input v-model="email" filled label="Email" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;" />
            <q-input v-model="pass" filled :type="isPwd ? 'password' : 'text'" label="Contraseña" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" style="cursor: pointer;" />
              </template>
            </q-input>
            <q-input v-model="verifiPass" :class="{'error-input': verifiPassError}" filled :type="isPwd ? 'password' : 'text'" label="Verifique su contraseña" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;" />

            <div v-if="errorMessage" style="color: green; margin-top: 10px;">
              {{ errorMessage }}
            </div>
            <div style="margin-top: 20px;">
              <q-toggle v-model="isDarkMode" label="Modo Oscuro"></q-toggle>
            </div>
            <div style="margin-top: 20px;">
              <q-select
                v-model="selectedTime"
                :options="[ { label: '10 años', value: 10 }, { label: '5 años', value: 5 }, { label: '1 año', value: 1 } ]"
                label="Tiempo hasta eliminar (años)"
                @change="checkDeleteButton"
              />
            </div>
            <div v-if="showDeleteButton">
              <q-btn label="Eliminar Cuenta" color="negative" @click.prevent="deleteAccount"/>
            </div>
            <div style="margin-top: 20px;">
              <q-btn type="submit" label="Actualizar Usuario" color="primary"/>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth' // Eliminar duplicado
import { getFirestore, doc, getDoc } from 'firebase/firestore'
// import nodemailer from 'nodemailer'

const isDarkMode = ref(false)
const selectedTime = ref(10)
const showDeleteButton = ref(false)
const username = ref('')
const email = ref('')
const pass = ref('')
const verifiPass = ref('')
const errorMessage = ref('')
const isPwd = ref(true)
const verifiPassError = ref(false)
// const generatedCode = ref('')
// const userEnteredCode = ref('')
const auth = getAuth()
const db = getFirestore()

/* async function initiatePasswordChange (userEmail) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  generatedCode.value = code
  try {
    await sendEmailVerification(code, userEmail)
    showVerificationForm.value = true
  } catch (error) {
    errorMessage.value = error.message
  }
} */

/* const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendEmailVerification (code, userEmail) {
  const emailContent = `Su código de verificación para cambiar la contraseña es: ${code}`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Código de Verificación para Cambio de Contraseña',
    text: emailContent
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Correo enviado exitosamente')
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    throw new Error('No se pudo enviar el correo de verificación')
  }
} */

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

/* const requestPasswordReset = async () => {
  const userEmail = email.value
  const auth = getAuth()

  try {
    await sendPasswordResetEmail(auth, userEmail)
    errorMessage.value = 'Se ha enviado un correo para restablecer la contraseña.'
  } catch (error) {
    errorMessage.value = 'Error al enviar el correo de restablecimiento: ' + error.message
  }
}

const updateUserPassword = async () => {
  if (userEnteredCode.value === generatedCode.value) {
    const user = auth.currentUser
    if (user) {
      try {
        await updateDoc(doc(db, 'usersColecction', user.email), { password: pass.value })
        errorMessage.value = 'Contraseña actualizada exitosamente'
        pass.value = ''
        verifiPass.value = ''
      } catch (error) {
        errorMessage.value = 'Error al actualizar la contraseña: ' + error.message
      }
    }
  } else {
    errorMessage.value = 'El código ingresado es incorrecto.'
  }
}

const updateUser = async () => {
  const user = auth.currentUser
  if (user) {
    const userDocRef = doc(db, 'usersColecction', user.email)

    try {
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        console.error('No existe el documento:', user.email)
        await setDoc(userDocRef, { username: username.value, email: email.value })
      } else {
        await updateDoc(userDocRef, { username: username.value, email: email.value })
      }

      initiatePasswordChange(user.email) // Iniciar cambio de contraseña
      updateUserPassword()
      requestPasswordReset()

      errorMessage.value = 'Usuario actualizado exitosamente'
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        errorMessage.value = 'Necesitas iniciar sesión nuevamente para realizar esta acción.'
      } else {
        errorMessage.value = 'Error al actualizar el usuario: ' + error.message
      }
    }
  }
}
function checkDeleteButton () {
  const currentYear = new Date().getFullYear()
  showDeleteButton.value = (currentYear - selectedTime.value) >= 10
}

function deleteAccount () {
  console.log('Account deleted')
}

watch(selectedTime, checkDeleteButton) */

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
