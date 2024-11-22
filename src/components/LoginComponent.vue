<template>
    <q-card class="login slide-in">
      <img alt="Quasar logo" src="~assets/images-removebg-preview.png" style="max-height: 150px; max-width: 150px; margin-top: -30%; margin-bottom: 20%; margin-left: 15%;"/>
      <q-input v-model="email" type="email" filled label="Email" style="min-width: 120%; margin-left: 10px; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white; margin-bottom: 10%;"/>
      <q-input
      v-model="passw"
      filled
      :type="showPassword ? 'text' : 'password'"
      label="Contraseña"
      style="min-width: 120%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
    >
      <template v-slot:append>
        <q-icon
          :name="showPassword ? 'visibility' : 'visibility_off'"
          @click="togglePasswordVisibility"
          class="cursor-pointer"
        />
      </template>
    </q-input>
      <q-btn push type="submit" style="width: 80%; margin-top: 10%; margin-left: 10%; margin-bottom:20px ;" label="INGRESAR" color="teal-9" @click="login()"/>

      <h8 class="texto-recuperacion" style="margin-left: 16%; margin-top: 20%;" @click="irArecuperacion">Olvidaste tu contraseña?</h8>

      <hr style="margin: 20px; border-top: 1px solid #ccc;"/>

      <q-btn push type="submit" style="width: 80%; margin-top: 5%; margin-left: 10%;" label="REGISTRATE" color="teal-8" @click="irARegistro()"/>

      <div v-if="errorMessage" style="margin-left: 15%; margin-top: 15px;">{{ errorMessage }}</div>

      <q-inner-loading
        :showing="visible && !errorMessage"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)

const email = ref('')
const passw = ref('')
const emailError = ref(false)
const passError = ref(false)
const errorMessage = ref('')
const userRole = ref('')

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const irARegistro = () => {
  router.push('/registro')
}

const irArecuperacion = () => {
  router.push('/correo')
}

const login = async () => {
  visible.value = true
  emailError.value = false
  passError.value = false
  errorMessage.value = ''

  if (!email.value) {
    emailError.value = true
    errorMessage.value = 'El email es requerido.'
    return
  }

  if (!passw.value) {
    passError.value = true
    errorMessage.value = 'La contraseña es requerida.'
    return
  }

  const auth = getAuth()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, passw.value)
    const userDocRef = doc(firestore, 'usersColecction', userCredential.user.email)
    const userSnapshot = await getDoc(userDocRef)

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data()
      userRole.value = userData.role
      if (!userData.confirmed) {
        errorMessage.value = 'Tu cuenta no está confirmada. No puedes acceder.'
        return
      }
      if (userData.email === 'clinica@gmail.com' && !userData.confirmed) {
        errorMessage.value = 'La cuenta del administrador debe estar confirmada por defecto.'
        return
      }
      if (userData.role === 'admin') {
        console.log('Entraste como usuario administrador')
        router.replace('/usuarios')
      } else if (userData.role === 'user') {
        console.log('Entraste como usuario común')
        router.replace('/registros')
      }

      const horaIngreso = formatDate(new Date())
      await updateDoc(userDocRef, { horaIngreso })
      visible.value = false
    } else {
      console.log('El usuario no existe en la base de datos')
    }
  } catch (error) {
    visible.value = false
    console.error('Error durante la autenticación:', error)
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'Usuario no encontrado.'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Contraseña incorrecta.'
        break
      default:
        errorMessage.value = 'Error en la autenticación. Inténtalo de nuevo.'
        break
    }
  }
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return formattedDate.replace(',', '').replace('AM', 'AM').replace('PM', 'PM')
}
</script>

<style scoped>

@keyframes slideIn {
  from {
    transform: translateY(-50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.8s ease forwards;
}

.text-red-500 {
  color: red;
}

.login{
  width: 100%;
  padding: 80px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(30, 182, 187, 0.418);
  margin-left: 0%;
}
.texto-recuperacion {
  color: white;
  text-decoration: underline;
  font-style: italic;
  transition: color 0.3s;
}

.texto-recuperacion:hover {
  color: blue;
}

@media (max-width: 600px) {
  body {
    font-size: 1.2em; /* Aumentar el tamaño de fuente en pantallas pequeñas */
  }
}

</style>
