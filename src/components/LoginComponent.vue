<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <q-card class="login slide-in card-style">
      <img alt="Quasar logo" src="~assets/images-removebg-preview.png" style="max-height: 150px; max-width: 150px; margin-bottom: 15%; margin-left: 16%;"/>
      <q-input v-model="email" type="email" filled label="Email" class="q-mb-md" style="background-color: #1e1e2f; border-radius: 16px; color: white;"/>
      <q-input
        v-model="passw"
        filled
        :type="showPassword ? 'text' : 'password'"
        label="Contraseña"
        class="q-mb-md"
        style="background-color: #1e1e2f; border-radius: 16px; color: white;"
      >
        <template v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility' : 'visibility_off'"
            @click="togglePasswordVisibility"
            class="cursor-pointer"
          />
        </template>
      </q-input>
      <q-btn push type="submit" class="full-width q-mb-md" label="INGRESAR" color="teal-9" @click="login()"/>
      <h8 class="texto-recuperacion text-center q-mb-md" @click="irArecuperacion">Olvidaste tu contraseña?</h8>
      <hr/>
      <q-btn push type="submit" class="full-width q-mb-md" label="REGISTRATE" color="teal-8" @click="irARegistro()"/>
      <div v-if="errorMessage" class="text-center q-mt-md">{{ errorMessage }}</div>
      <q-inner-loading
        :showing="visible && !errorMessage"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
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
    const emailDocRef = doc(firestore, 'usersColecction', email.value)
    const emailDoc = await getDoc(emailDocRef)

    if (emailDoc.exists() && emailDoc.data().pass === passw.value) {
      await createUserWithEmailAndPassword(auth, email.value, passw.value)
      await updateDoc(emailDocRef, { pass: deleteField() })
      router.replace('/registros')
    } else {
      console.log('El usuario no existe en la base de datos o las credenciales son incorrectas')
    }

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

.texto-recuperacion {
  color: white;
  text-decoration: underline;
  font-style: italic;
  transition: color 0.3s;
}

.texto-recuperacion:hover {
  color: blue;
}

.card-style {
  position: relative;
  border-radius: 16px; /* Bordes redondeados */

  /* Estilos de borde luminoso */
  border: 5px solid transparent; /* Borde transparente para el degradado */
  background-image: linear-gradient(rgb(7, 12, 15), rgb(2, 19, 37)), linear-gradient(to right, #085546, #085546); /* Fondo blanco con borde degradado */
  background-clip: padding-box, border-box; /* Para que el fondo blanco no se superponga al borde */

  box-shadow:
    0px 0px 10px rgba(225, 240, 237, 0.7), /* Sombra verde clara */
    inset 0px 0px 15px #00ccff80; /* Sombra interna celeste */
}
</style>
