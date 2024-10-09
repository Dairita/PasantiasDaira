<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; overflow: auto; align-items: center;">
    <q-card  class="my-card bg-white text-black" style="margin-bottom: 5%; margin-top: 3%; border-radius: 50px; border: 20px solid #007A7C; opacity: 100; width: 90%; margin-top: 0%;">
      <div class="row justify-content-center q-mb-md" style=" align-items: center; margin-top: 5%;">
        <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 1300px; max-height: 1300px; margin-left: 4%; margin-right: 50%; margin-top: -5%; flex-wrap: wrap;"/>
      </div>
      <div style="text-align: center; margin-top: -12%; margin-left: -20%;">
        <h5 style="margin: 0;"><strong>Fundación</strong></h5>
        <h4 style="margin: 0;"><strong>Hospital Adventista de Venezuela</strong></h4>
        <h6 style="align-self: flex-start; margin-top: 5px;"><strong>Rif J-08517758-2</strong></h6>
      </div>

    <q-card-section>
    <div class="text-h6" style="margin: 3%;">HISTORIA CLINICA</div>
    </q-card-section>

<form id="app" @submit="checkForm" action="https://vuejs.org/" method="post">
  <q-card-section style="margin: 5%; margin-top: -3%;">
      <div class="text-h7">Datos personales</div>

      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="name" label="Nombre" maxlength="20" :class="{'error': nameError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="nameError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="surname" label="Apellido" maxlength="20" :class="{'error': surnameError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="surnameError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="age" label="Edad" type="number" min="0" max="110" :class="{'error': ageError}" :dense="dense" @input="validateAge" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="ageError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <q-input ref="inputRef" filled v-model="birthDate" label="Fecha de Nacimiento" mask="##/##/####" :class="{'error': birthDateError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="birthDateError" class="error-message">Llena el campo correctamente</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section style="text-align: center;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="idCard" label="Cédula" maxlength="10" mask="##.###.####" :class="{'error': idCardError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="idCardError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="address" label="Dirección" :class="{'error': addressError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="addressError" class="error-message">Llena el campo correctamente</span>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <q-input ref="inputRef" filled v-model="phone" label="Teléfono" maxlength="11" :class="{'error': phoneError}" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
            <span v-if="phoneError" class="error-message">Llena el campo correctamente, </span>
            <span v-if="phoneError" class="error-message">{{ phoneErrorMessage }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </form>

    <q-card-section v-if="isAdult" style="margin: 3%; margin-top: -3%;">
      <div class="text-h7">Representante</div>
      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">

          <div style="flex: 1; min-width: 200px; margin-right: 10px;">
            <q-input ref="inputRef" filled v-model="representativeName" label="Nombre y Apellido" :dense="dense"
              style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
          </div>

          <div style="flex: 1; min-width: 200px;">
            <q-input ref="inputRef" filled v-model="relationship" label="Parentesco" :dense="dense"
              style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
          </div>

        </div>
      </q-card-section>
    </q-card-section>

  <q-card-section style="margin: 3%; margin-top: -3%;">
    <div class="text-h7">Motivo de consulta</div>
      <q-card-section style="text-align: left;">

        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; margin-top: 0%;">
          <q-input
          filled
          type="textarea"
          v-model="subjetivo"
          label="Subjetivo"
          rows="10"
          counter
          maxlength="5000"
          color="teal-9"
          style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
          input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"
        >
        </q-input>
        </div>

        <div class="text-h6">Objetivo</div>
        <div class="q-gutter-md" style="display: flex; margin-top: 1%; flex-wrap: wrap;">

          <div style="flex: 1; min-width: 150px; margin-right: 10px;">
            <q-input rounded filled v-model="ta" label="T.A" :dense="dense"
              color="teal-9" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);">
            </q-input>
          </div>

          <div style="flex: 1; min-width: 150px; margin-right: 10px;">
            <q-input rounded filled v-model="fc" label="Fc" :dense="dense"
              color="teal-9" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);">
            </q-input>
          </div>

          <div style="flex: 1; min-width: 150px; margin-right: 10px;">
            <q-input rounded filled v-model="fr" label="Fr" :dense="dense"
              color="teal-9" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);">
            </q-input>
          </div>

          <div style="flex: 1; min-width: 150px; margin-right: 10px;">
            <q-input rounded filled v-model="t" label="T°" :dense="dense"
              color="teal-9" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);">
            </q-input>
          </div>

          <div style="flex: 1; min-width: 150px;">
            <q-input rounded filled v-model="salt" label="SaltO2" :dense="dense"
              color="teal-9" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);">
            </q-input>
          </div>

        </div>

        <div style="margin-top: 5%;">

          <q-input
          filled
          type="textarea"
          v-model="otros"
          label="Otros"
          rows="10"
          counter
          maxlength="5000"
          color="teal-9"
          style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
          input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"
        />
        </div>
  </q-card-section>
  </q-card-section>

    <q-card-section style="margin: 3%; margin-top: -3%;">
  <div class="text-h7">Análisis</div>
    <q-card-section style="text-align: left;">
     <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
      <q-input
      filled
      type="textarea"
      v-model="analisis"
      label="Diagnóstico"
      rows="10"
      counter
      maxlength="5000"
      color="teal-9"
      style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
      input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"
    />
      </div>
  </q-card-section>
    </q-card-section>

    <q-card-section style="margin: 3%; margin-top: -3%;">
    <div class="text-h7">Plan terapéutico</div>
      <q-card-section style="text-align: left;">
        <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
          <q-input
          filled
          type="textarea"
          v-model="planterapeutico"
          label="Plan terapéutico"
          rows="10"
          counter
          maxlength="5000"
          color="teal-9"
          style="flex: 1; background-color: rgba(0, 122, 124, 1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; font-size: 15px;"
          input-style="color: white; line-height: 2; background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 200%); background-size: auto 10px; background-repeat: repeat-y;"
        />
    </div>
         </q-card-section>
    </q-card-section>

    <q-card-section style="display: flex; flex-direction: column; align-items: center;">
      <div style="display: flex; justify-content: center; align-items: center;">
        <q-input v-model="medico" label="Medico" :dense="dense" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); "/>

         <q-file color="teal-9" filled v-model="model" label="Firma" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); ">
         <template v-slot:prepend>
           <q-icon name="cloud_upload" />
         </template>
         </q-file>
        <q-input v-model="fechaRegistro" mask="##/##/####" label="Fecha" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); "/>
        </div>
    </q-card-section>

    <q-card-section style="display: flex; flex-direction: column; ">
         <div class="q-pa-md q-gutter-md">
         <q-btn @click="save" color="teal" label="Registrar" style="padding: 3%; width: 50%; align-items: center; margin-left: 25%;"/>
        </div>
    </q-card-section>

  </q-card>
</div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'

// Reactive state variables
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
const formErrorMessage = ref('') // Initialize form error message

const nameError = ref(false)
const surnameError = ref(false)
const ageError = ref(false)
const birthDateError = ref(false)
const idCardError = ref(false)
const addressError = ref(false)
const phoneError = ref(false)
const phoneErrorMessage = ref('')

const checkForm = () => {
  // Reset error flags
  nameError.value = !name.value
  surnameError.value = !surname.value
  ageError.value = age.value === null || age.value < 1 || age.value > 110

  // Validate birthDate
  birthDateError.value = !birthDateError.value

  idCardError.value = !idCard.value
  addressError.value = !address.value

  // Phone number validation
  const validPrefixes = ['0412', '0414', '0424', '0416', '0254']
  if (!phone.value || !validPrefixes.some(prefix => phone.value.startsWith(prefix))) {
    phoneError.value = true // Set error flag
    phoneErrorMessage.value = 'Número inválido' // Set error message
  } else {
    phoneError.value = false // Clear error flag
    phoneErrorMessage.value = '' // Clear error message
  }

  // If there are errors, do not continue with submission
  if (nameError.value || surnameError.value || ageError.value || birthDateError.value || idCardError.value || addressError.value || phoneError.value) {
    return
  }

  guardar()
}

const guardar = async () => { // Declarar la función como async
  const idCardRef = doc(firestore, 'DatosPersonales', idCard.value)

  // Usar await para obtener el documento
  const idCardDoc = await getDoc(idCardRef)

  if (idCardDoc.exists()) {
    alert('La cédula ya está registrada. Por favor revise los registros.')
    return
  }

  try {
    // Guardar en DatosPersonales
    await setDoc(idCardRef, {
      name: name.value,
      surname: surname.value,
      age: age.value,
      birthDate: birthDate.value,
      idCard: idCard.value,
      address: address.value,
      phone: phone.value,
      medico: medico.value,
      fechaRegistro: fechaRegistro.value
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
      planterapeutico: planterapeutico.value
    })

    // Guardar en Representante
    const repre = doc(firestore, 'Representante', idCard.value)
    await setDoc(repre, {
      idCard: idCard.value,
      representativeName: representativeName.value,
      relationship: relationship.value
    })

    console.log('Datos guardados correctamente')
  } catch (error) {
    console.error('Error al guardar los datos:', error)
  }
}

async function save () {
  const isValid = checkForm()
  if (!isValid) {
    return
  }
  try {
    await guardar()
    alert('Los datos se han guardado correctamente.')
  } catch (error) {
    console.error('Error al intentar guardar los datos:', error)
    formErrorMessage.value = 'Ocurrió un error al guardar los datos. Por favor, inténtelo de nuevo más tarde.'
  }
}

</script>

<style scoped>
.error {
  border: 2px solid red;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: -5px;
}

.custom-tab-panel {
 padding: 0;
}
.my-card {
  background-color: #242424; /* Color gris sólido */
}
.q-input__label {
  color: black !important; /* Cambia el color del label a negro */
  font-weight: bold; /* Hace que el texto del label sea negrita */
  /* Ajusta el tamaño de la fuente según sea necesario */
}
</style>
