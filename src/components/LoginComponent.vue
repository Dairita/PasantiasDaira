<template>
<div>
  <q-inner-loading
    style="display: flex; position: fixed;"
    :showing="visible"
    label="Please wait..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
  <div class="q-pa-md">
    <form style=" padding: 50px; text-align: center; min-width: 100%; height: 100%; background-image: linear-gradient(#a9a9a977, #33333377); border-radius: 30px;">

      <div class="q-gutter-md">
        <div>
          <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 200px; max-height: 150px; margin-left: -8%; margin-top: -20%;"/>
        </div>
        <div style="margin-bottom: -20%;">
        <div style="margin-top: -10%;">
        <h5><em>Ingresa con tu cuenta</em></h5>
      </div>
        <div class="q-gutter-md" style="margin: 30px; padding: 0px">
          <q-input v-model="email" type="email" filled label="Email" style="min-width: 120%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"  />
          <q-input v-model="passw" filled :type="isPwd ? 'password' : 'text'" label="Contraseña" style="min-width: 120%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"/>
          <h6>Olvidaste tu contraseña?</h6>
        </div>
      </div>
        <div class="flex flex-center q-pa-md" style="justify-content: space-around; margin: 2%">
        </div>
        <q-btn push type="submit" style="width: 80%; margin-top: -5%;" label="INGRESAR" color="green-8" @click="login()"/>

        <div style="display: flex; margin-top: 20%;">
          <h10>Crea tu cuenta propia</h10>
          <q-btn push type="submit" style="width: 80%; margin-top: -5%;" label="RRGISTRATE" color="green-8" @click="irARegistro()"/>
          <div v-if="errorMessage">{{ errorMessage }}</div>
        </div>

        <div class="flex flex-center q-gutter-md"/>

      </div>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter } from 'vue-router'

// Inicializar el router
const router = useRouter()

// Variables reactivas
const email = ref('')
const passw = ref('')
const emailError = ref(false)
const passError = ref(false)
const errorMessage = ref('')
const userRole = ref('') // Reactive property to store user role

// Función para navegar a la página de registro
const irARegistro = () => {
  router.push('/registro') // Cambia '/registro' por la ruta correcta de tu página de registro
}

// Función para verificar las credenciales del usuario

const login = async () => {
  // Resetear errores
  emailError.value = false
  passError.value = false
  errorMessage.value = ''

  // Validar campos
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
    // Intentar iniciar sesión con Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email.value, passw.value)

    // Obtener el documento del usuario desde Firestore
    const userDocRef = doc(firestore, 'usersColecction', userCredential.user.email)
    const userSnapshot = await getDoc(userDocRef)

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data()
      userRole.value = userData.role // Almacenar el rol del usuario

      // Verificar si el usuario está confirmado
      if (!userData.confirmed) {
        errorMessage.value = 'Tu cuenta no está confirmada. No puedes acceder.'
        return
      }

      // Asegurarse de que la cuenta del administrador esté confirmada por defecto
      if (userData.email === 'clinica@gmail.com' && !userData.confirmed) {
        errorMessage.value = 'La cuenta del administrador debe estar confirmada por defecto.'
        return
      }

      // Log message based on user role
      if (userData.role === 'admin') {
        console.log('Entraste como usuario administrador')
      } else if (userData.role === 'user') {
        console.log('Entraste como usuario común')
      }

      // Navegar al menú después de un inicio de sesión exitoso
      router.push('/menu')
    } else {
      console.log('El usuario no existe en la base de datos')
    }
  } catch (error) {
    // Manejo de errores de autenticación
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
</script>

<style scoped>
/* Estilos opcionales */
.text-red-500 {
  color: red;
}
</style>
