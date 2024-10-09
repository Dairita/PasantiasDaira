<template>
<div>
<q-btn @click="showPopup = true" label="evolucion" class="custom-btn"/>
  <q-dialog v-model="showPopup" persistent>
    <q-card class="my-card bg-gray text-white" style="margin-top: 20px;">
      <q-card-section>
        <div class="text-h6">EVOLUCION</div>
      </q-card-section>

      <q-card-section>
        <q-card-section style="text-align: left;">
          <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
         <q-input rounded filled v-model="Interconsulta" label="Interconsulta" :dense="dense" :rules="[val => val && val.length > 0 || 'No Dejes campos vacios']"
         :error="name === ''" :error-message="name === '' ? 'No Dejes campos vacios' : ''" style="flex: 1; min-width: 200px; margin-right: 10px;"></q-input>

         <q-input rounded filled v-model="cedula" label="Cédula" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la cédula']"
          :error="idCard === ''" :error-message="idCard === '' ? 'Por favor ingresa la cédula' : ''" style="flex: 1; min-width: 200px;">
        </q-input>

         <q-input rounded filled v-model="edad" label="Edad" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la edad']"
         :error="age === ''" :error-message="age === '' ? 'Por favor ingresa la edad' : ''" type="number" @input="validateAge" style="flex: 1; min-width: 200px;"></q-input>

         <q-input rounded filled v-model="fechaN" mask="##/##/####" label="Fecha de Nacimiento" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa fecha de nacimiento']"
         :error="birthDate === ''" :error-message="birthDate === '' ? 'Por favor ingresa fecha de nacimiento' : ''" style="flex: 1; min-width: 200px;"></q-input>
          </div>
        </q-card-section>

        <div style="margin-top: 5%;">
        <div class="text-h6">Subjetivo</div>
        <q-input filled type="textarea" v-model="subjetivo" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Objetivo</div>
        <q-input filled type="textarea" v-model="objetivo" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Analisis o Diagnóstico</div>
        <q-input filled type="textarea" v-model="analisis" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Plan terapeutico</div>
        <q-input filled type="textarea" v-model="plant" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <q-card-section>
          <q-card-section style="display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; justify-content: center; align-items: center;">
           <q-input v-model="medico" label="Medico" style="max-width: 150px; margin: 0 5px;" />
           <q-file color="teal" filled v-model="model" label="Firma" style="max-width: 150px; margin: 0 5px;">
           <template v-slot:prepend>
           <q-icon name="cloud_upload" />
           </template>
          </q-file>
          <q-input v-model="fecha" mask="##/##/####" label="Fecha" style="max-width: 150px; margin: 0 5px;" />
          </div>
          </q-card-section>
        </q-card-section>

          <q-card-section style="display: flex; flex-direction: column; align-items: center;">
          <div class="q-pa-md q-gutter-md"> <q-btn color="teal" @click="save">
          <q-icon left size="3em" name="map" />
          <div>Actualizar</div> </q-btn>
         </div>

         <div class="q-pa-md q-gutter-md"> <q-btn color="teal" @click="salir">
          <q-icon left size="3em" name="map" />
          <div>Salir</div> </q-btn>
         </div>
      </q-card-section>
    </q-card-section>
   </q-card>
 </q-dialog>
</div>

</template>
<script setup>
import { ref } from 'vue'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'

const Interconsulta = ref('')
const cedula = ref('')
const edad = ref('')
const fechaN = ref('')
const subjetivo = ref('')
const objetivo = ref('')
const analisis = ref('')
const plant = ref('')
const medico = ref('')
const fecha = ref('')
const dense = ref(false) // o true según tu requerimiento
const showDialog = ref(true)

async function save () {
  const repre = doc(firestore, 'Evolucion')
  await setDoc(repre, {
    Interconsulta: Interconsulta.value,
    cedula: cedula.value,
    edad: edad.value,
    fechaN: fechaN.value,
    objetivo: objetivo.value,
    analisis: analisis.value,
    plant: plant.value,
    medico: medico.value,
    fecha: medico.value
  })
}

const salir = () => {
  showDialog.value = false
}

</script>
