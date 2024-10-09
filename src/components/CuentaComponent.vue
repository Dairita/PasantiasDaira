<template>
    <div>
      <div class="q-pa-md">
        <form style=" padding: 150px; text-align: center; min-width: 100%; background-image: linear-gradient(#a9a9a977, #33333377); border-radius: 30px;">
          <div class="q-gutter-md">

            <div class="circular-input" style="margin-top: -19%; margin-left: 8%;">
              <input type="file" id="profilePic" accept="image/*" @change="previewImage" style="display: none;" ref="fileInput"/>
              <div class="image-preview" @click="selectFile">
                <img :src="imageSrc" alt="Profile Picture" v-if="imageSrc" />
                <span v-else>Upload Image</span>
              </div>
            </div>

          </div>

            <div style="margin-top: 7%;">
              <div class="q-gutter-md" style="margin-left: 3px;">
                <q-input v-model="username" :class="{'error-input': usernameError}" filled label="Nombre de usuario" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                />
                <q-input v-model="email" :class="{'error-input': emailError}" filled label="Email" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                />
                <q-input v-model="pass" :class="{'error-input': passError}" filled :type="isPwd ? 'password' : 'text'" label="Contraseña" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                > <template v-slot:append>   <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"  style="cursor: pointer;"   /> </template>
                </q-input>

                <q-input v-model="verifiPass" :class="{'error-input': verifiPassError}" filled :type="isPwd ? 'password' : 'text'" label="Verifique su contraseña" :dense="dense" style="width: 50%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                />

                <div v-if="errorMessage" style="color: red; margin-top: 10px;">
                  {{ errorMessage }}
                </div>

                <div style="margin-left: -54%; margin-top: 10%; margin-bottom: -9%;">
                  <q-btn
                    push
                    type="submit"
                    style="width: 30%; margin-left: -8%; background-color: #1e1e2f; border-radius: 16px; color: white;"
                    label="REGISTRATE"
                    color="green-8"
                    @click.prevent="registrar()"
                  />
                  <div v-if="errorMessage">{{ errorMessage }}</div>
                </div>
              </div>
            </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// Variables reactivas
const imageSrc = ref('')
const username = ref('')
const email = ref('')
const pass = ref('')
const verifiPass = ref('')
const errorMessage = ref('')
const isPwd = ref(true)
const router = useRouter()

const usernameError = ref(false)
const emailError = ref(false)
const passError = ref(false)
const verifiPassError = ref(false)

const registrar = async () => {
  // Validar campos
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
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, pass.value)

    // Guardar los datos del usuario en Firestore
    const userDocRef = doc(firestore, 'usersColecction', userCredential.user.email)
    await setDoc(userDocRef, {
      username: username.value,
      email: userCredential.user.email,
      role: 'user',
      confirmed: false
    })

    // Limpiar los campos después del registro
    username.value = ''
    email.value = ''
    pass.value = ''
    verifiPass.value = ''
    errorMessage.value = ''

    alert('Registro exitoso')
    router.push('/')
  } catch (error) {
    console.error('Error al registrar el usuario:', error)
    errorMessage.value = error.message
  }
}

const selectFile = () => {
  const fileInput = document.getElementById('profilePic')
  fileInput.click()
}

// Función para validar la contraseña
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[._-])[A-Za-z\d._-]{1,8}$/
  return regex.test(password)
}

// Observador para validar las contraseñas
watch([pass, verifiPass], () => {
  if (pass.value !== verifiPass.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    passError.value = true
    verifiPassError.value = true
  } else if (!validatePassword(pass.value)) {
    errorMessage.value =
      'La contraseña debe tener entre 1 y 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos como ".", "_", "-"'
    passError.value = true
    verifiPassError.value = true
  } else {
    errorMessage.value = ''
    passError.value = false
    verifiPassError.value = false
  }
})

// Función para previsualizar la imagen
const previewImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style>
.circular-input {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular-input input {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
}

.image-preview img {
  width: 100%;
  height: auto;
}

.error-input {
  border-color: red !important;
}
</style>
