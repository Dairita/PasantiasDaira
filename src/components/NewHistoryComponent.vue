<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; align-items: center;">
    <q-card class="my-card text-black" style="margin-bottom: 5%; min-width: 100%; background-image: linear-gradient( #1989, #3333);">
      <q-card class="my-card text-black" style="margin-left: 25%; width: 100vh; height: 100vh; background-color: transparent; border: 2px solid white;">

    <q-card-section>
    <div class="text-h5" style="margin: 3%; ">HISTORIA CLINICA</div>
    </q-card-section>

<div v-if="currentStep === 1">
 <form id="app" @submit="checkForm" action="https://vuejs.org/" method="post">
  <q-card-section style="margin: 5%; margin-top: -3%;">
      <div class="text-h6">Datos personales</div>
      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="name" label="Nombre" maxlength="20" :class="{'error': nameError}" :dense="dense" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="nameError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="surname" label="Apellido" maxlength="20" :class="{'error': surnameError}" :dense="dense" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="surnameError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="age" label="Edad" type="number" min="0" max="110" :class="{'error': ageError}" :dense="dense" @input="validateAge" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="ageError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <q-input v-model="formattedDate" style="border-radius: 5px; background-color: rgba(0, 122, 124);"
            label="Fecha de Nacimiento" readonly @click="showDatePicker = true" hint="Haz clic para seleccionar una fecha" :error="birthDateError"/>
            <q-popup-proxy v-model="showDatePicker" transition-show="scale" transition-hide="scale">
              <q-date v-model="birthDate" mask="DD/MM/YYYY" @input="onDateSelected" :options="dateOptions"/>
            </q-popup-proxy>
            <span v-if="birthDateError" class="error-message">Fecha inválida</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section style="text-align: center;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="idCard" label="Cédula" maxlength="10" mask="##.###.####" :class="{'error': idCardError}" :dense="dense" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="idCardError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="address" label="Dirección" :class="{'error': addressError}" :dense="dense" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="addressError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <q-input ref="inputRef" filled v-model="phone" label="Teléfono" maxlength="11" :class="{'error': phoneError}" :dense="dense" style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
            <span v-if="phoneError" class="error-message">{{ phoneErrorMessage }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </form>

    <q-card-section v-if="isAdult" style="margin: 5%; margin-top: -8%;">
      <div class="text-h6">Representante</div>
      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">

          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="representativeName" label="Nombre y Apellido" :dense="dense"
              style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
          </div>

          <div style="flex: 1; min-width: 200px;">
            <q-input ref="inputRef" filled v-model="relationship" label="Parentesco" :dense="dense"
              style="border-radius: 5px; background-color: rgba(0, 122, 124);"/>
          </div>
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section style="margin: 5%; margin-top: -8%;">
      <div class="text-h6">Motivo de consulta</div>
      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; margin-top: 0%;">
        <q-input filled type="textarea" v-model="subjetivo" label="Subjetivo" rows="5" counter maxlength="5000" color="teal-9" style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
        input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;">
        </q-input>
        </div>
      </q-card-section>
    </q-card-section>
</div>

    <div v-if="currentStep === 2">
      <q-card-section style="margin: 6%; margin-top: -3%;">
        <div class="text-h6">Objetivo</div>
            <div class="q-gutter-md" style="display: flex; margin-top: 1%; flex-wrap: wrap;">

              <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                <q-input rounded filled v-model="ta" label="T.A" :dense="dense"
                  color="teal-9" style="border-radius: 5px; background-color: rgba(0, 122, 124);">
                </q-input>
              </div>

              <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                <q-input rounded filled v-model="fc" label="Fc" :dense="dense"
                  color="teal-9" style="border-radius: 5px; background-color: rgba(0, 122, 124);">
                </q-input>
              </div>

              <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                <q-input rounded filled v-model="fr" label="Fr" :dense="dense"
                  color="teal-9" style="border-radius: 5px; background-color: rgba(0, 122, 124);">
                </q-input>
              </div>

              <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                <q-input rounded filled v-model="t" label="T°" :dense="dense"
                  color="teal-9" style="border-radius: 5px; background-color: rgba(0, 122, 124);">
                </q-input>
              </div>

              <div style="flex: 1; min-width: 150px;">
                <q-input rounded filled v-model="salt" label="SaltO2" :dense="dense"
                  color="teal-9" style="border-radius: 5px; background-color: rgba(0, 122, 124);">
                </q-input>
              </div>
            </div>

                <div style="margin-top: 5%;">
                  <q-input filled type="textarea" v-model="otros" label="Otros" rows="5" counter maxlength="5000" color="teal-9" style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
                  input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"/>
                </div>

                <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; margin-top: 3%;">
                  <q-input filled type="textarea" v-model="analisis" label="Diagnóstico" rows="5" counter maxlength="5000" color="teal-9"
                  style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
                  input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"/>
                </div>

      </q-card-section>
    </div>

    <div v-if="currentStep === 3">
      <q-card-section style="margin: 5%; margin-top: -3%;">
        <div class="text-h6">Plan terapéutico</div>
          <q-card-section style="text-align: left;">
            <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
            <q-input filled type="textarea" v-model="planterapeutico" label="Plan terapéutico" rows="5" counter maxlength="5000"
              color="teal-9" style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
              input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"/>
            </div>
          </q-card-section>
      </q-card-section>

      <q-card-section style="margin: 10%; margin-top: -3%;">
        <q-card-section style="display: flex; align-items: flex-start; gap: 3%;">
            <div style="display: flex; flex-direction: column; gap: 3%;">
                <q-input
                    v-model="medico"
                    label="Medico"
                    :dense="dense"
                    readonly
                    style="border-radius: 5px; background-color: rgba(0, 122, 124, 0.7);"
                />
                <q-input
                    v-model="fechaRegistro"
                    mask="##/##/####"
                    label="Fecha Registro"
                    readonly
                    style="border-radius: 5px; background-color: rgba(0, 122, 124, 0.7); margin-top: 10%;"
                />
            </div>
            <div style="margin-left: 200px;">
                <q-uploader
                    url="http://localhost:4444/upload"
                    color="teal"
                    flat
                    bordered
                    style="max-width: 300px; "
                />
            </div>
        </q-card-section>

        <div v-if="firmaUrl">
            <img :src="firmaUrl" alt="Firma Digital" style="max-width: 100%; border-radius: 10px;" />
        </div>
    </q-card-section>

  </div>

  <q-card-section style="display:flex; justify-content:center; margin-top: -5%; margin-bottom: 1%;">
    <q-btn
      v-if='currentStep > 1'
      @click='prevStep'
      round
      color='transparent'
      icon="arrow_back"
      class="ripple-effect large-btn"
      style="margin-right: 50%;"
    />
    <q-btn
      v-if='currentStep < totalSteps'
      @click='nextStep'
      round
      color='transparent'
      icon="arrow_forward"
      class="ripple-effect large-btn"
    />
    <q-btn
      v-if='currentStep === totalSteps'
      @click="save"
      color="teal-9"
      label="Registrar"
    />

  </q-card-section>

<q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
  <q-card :class="{'border-red': !isValid, 'border-green': isValid}" style="width: 300px; margin-left: 14%;">
    <q-card-section>
      <div class="text-h6">¿Deseas Guardar esta historia médica?</div>
      <div class="text-h9">{{ message }}</div>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md">
      <q-btn @click="saveuno(selectedRow)" label="Guardar" color="primary"/>
      <q-btn @click="back" label="Cancelar" color="red"/>
    </q-card-actions>
  </q-card>
</q-dialog>

</q-card>
</q-card>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore'
import { firestore, db } from 'boot/firebase'
import { getAuth } from 'firebase/auth'
import useNotificaciones from 'boot/useNotificaciones'

const { agregarNotificacion } = useNotificaciones()

onMounted(async () => {
  setFechaActual()
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const userId = user.email
    const docRef = doc(db, 'usersColecction', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      medico.value = docSnap.data().username
    } else {
      console.log('El documento no existe')
    }
  } else {
    console.log('No hay usuario autenticado')
  }
})

const currentStep = ref(1)
const totalSteps = ref(3)
const name = ref('')
const surname = ref('')
const age = ref(null)
const birthDate = ref('')
const idCard = ref('')
const address = ref('')
const phone = ref('')
const representativeName = ref('')
const relationship = ref('')
const subjetivo = ref('')
const ta = ref('')
const fc = ref('')
const fr = ref('')
const t = ref('')
const salt = ref('')
const otros = ref('')
const analisis = ref('')
const planterapeutico = ref('')
const medico = ref('')
const fechaRegistro = ref('')
const dense = ref(false)
const isAdult = computed(() => age.value <= 18)
const nameError = ref(false)
const surnameError = ref(false)
const ageError = ref(false)
const birthDateError = ref(false)
const idCardError = ref(false)
const addressError = ref(false)
const phoneError = ref(false)
const phoneErrorMessage = ref('')
const showDatePicker = ref(false)

const firmaUrl = ref('')

const persistent = ref(false)
const selectedRow = ref(null)
const back = () => {
  persistent.value = false
}
const save = (rowData) => {
  persistent.value = true
  selectedRow.value = rowData
}

const formattedDate = computed(() => {
  if (!birthDate.value) return ''
  const dateParts = birthDate.value.split('-')
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
})

function onDateSelected (date) {
  birthDate.value = date
  showDatePicker.value = false
}

const validateBirthDate = () => {
  return !!birthDate.value
}

const checkForm = () => {
  nameError.value = !name.value
  surnameError.value = !surname.value
  ageError.value = age.value === null || age.value < 1 || age.value > 110
  birthDateError.value = !validateBirthDate()
  idCardError.value = !idCard.value
  addressError.value = !address.value

  const validPrefixes = ['0412', '0414', '0424', '0416', '0254']

  if (!phone.value || !validPrefixes.some(prefix => phone.value.startsWith(prefix))) {
    phoneError.value = true
    phoneErrorMessage.value = 'Número inválido'
  } else {
    phoneError.value = false
    phoneErrorMessage.value = ''
  }

  const isValid =
    !nameError.value &&
    !surnameError.value &&
    !ageError.value &&
    !birthDateError.value &&
    !idCardError.value &&
    !addressError.value &&
    !phoneError.value

  return isValid
}

const guardar = async () => {
  const idCardRef = doc(firestore, 'DatosPersonales', idCard.value)

  const idCardDoc = await getDoc(idCardRef)

  if (idCardDoc.exists()) {
    alert('La cédula ya está registrada. Por favor revise los registros.')
    return
  }

  try {
    await setDoc(idCardRef, {
      name: name.value,
      surname: surname.value,
      age: age.value,
      birthDate: birthDate.value,
      idCard: idCard.value,
      address: address.value,
      phone: phone.value,
      medico: medico.value,
      fechaRegistro: new Date().toISOString(),
      usuarioregistro: medico.value
    })

    // Guardar en MotivosConsulta
    const motivo = doc(firestore, 'MotivosConsulta', idCard.value)
    await setDoc(motivo, {
      idCard: idCard.value,
      subjetivo: subjetivo.value,
      ta: ta.value,
      fc: fc.value,
      fr: fr.value,
      t: t.value,
      salt: salt.value,
      otros: otros.value,
      analisis: analisis.value,
      planterapeutico: planterapeutico.value,
      usuarioregistro: medico.value
    })

    // Guardar en Representante
    const repre = doc(firestore, 'Representante', medico.value)
    await setDoc(repre, {
      idCard: idCard.value,
      representativeName: representativeName.value,
      relationship: relationship.value,
      usuarioregistro: medico.value
    })

    console.log('Datos guardados correctamente')

    agregarNotificacion(`${medico.value} creó una historia médica del paciente ${name.value} ${surname.value} el `)

    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      const userDocRef = doc(firestore, 'usersColecction', user.email)
      const mensaje = `creó una historia médica del paciente ${name.value} ${surname.value} el ${formatDate(new Date())}`

      // Reference to the 'actividad' subcollection
      const actividadCollectionRef = collection(userDocRef, 'actividad')

      // Add the new message to the 'actividad' subcollection
      try {
        await addDoc(actividadCollectionRef, { mensaje })
        console.log('Mensaje guardado en la subcolección actividad.')
      } catch (error) {
        console.error('Error al guardar el mensaje:', error)
      }
    }

    name.value = ''
    surname.value = ''
    age.value = ''
    birthDate.value = ''
    idCard.value = ''
    address.value = ''
    phone.value = ''
    idCard.value = ''
    subjetivo.value = ''
    ta.value = ''
    fc.value = ''
    fr.value = ''
    t.value = ''
    salt.value = ''
    otros.value = ''
    analisis.value = ''
    planterapeutico.value = ''
    representativeName.value = ''
    relationship.value = ''
    persistent.value = false
  } catch (error) {
    console.error('Error al guardar los datos:', error)
  }
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return formattedDate.replace(',', '').replace('AM', 'AM').replace('PM', 'PM')
}

const message = ref('')

const isValid = ref(true)

const saveuno = async () => {
  isValid.value = checkForm()
  if (!isValid.value) {
    message.value = 'Los campos no están correctamente llenados'
    return
  }

  try {
    message.value = 'Registro exitoso'
    isValid.value = true
    await guardar()
  } catch (error) {
    message.value = 'Error al guardar el registro'
    isValid.value = false
  } finally {
    persistent.value = false
  }
}

function nextStep () {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  }
}

function prevStep () {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const setFechaActual = () => {
  const hoy = new Date()
  const dia = String(hoy.getDate()).padStart(2, '0')
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const año = hoy.getFullYear()

  fechaRegistro.value = `${dia}/${mes}/${año}`
}

</script>

<style scoped>

.large-btn {
  width: 80px; /* Adjust width as needed */
  height: 80px; /* Adjust height as needed */
  font-size: 30px; /* Adjust icon size if necessary */
}

.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5); /* Adjust color and opacity */
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.border-red {
  border: 2px solid red;
}
.border-green {
  border: 2px solid green;
}

.close-button {
  color: #c25252;
  float: right;
  font-size: 28px;
}
.error {
  border: 2px solid red; /* Estilo para el borde de error */
}

.error-message {
  color: red; /* Color del mensaje de error */
  font-size: 12px; /* Tamaño de fuente del mensaje de error */
  margin-top: -5px; /* Espaciado negativo para ajustar la posición */
}

.custom-tab-panel {
  padding: 0; /* Sin padding para el panel de pestañas personalizado */
}

.my-card {
  background-color: transparent; /* Fondo completamente transparente para la tarjeta */
}

.q-input__label {
  color: black !important; /* Cambia el color del label a negro */
  font-weight: bold; /* Hace que el texto del label sea negrita */
  /* Ajusta el tamaño de la fuente según sea necesario */
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>
