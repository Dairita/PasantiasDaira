<template>
  <q-card  class="my-card bg-white text-black" style="border-radius: 50px; border: 20px solid #007A7C; width: 90%; margin-top: 2%; margin-left: 5%">

    <q-card class="my-card bg-gray bg-transparent text-white" style="margin-top: 3%; margin-bottom: 5%; overflow: auto;">
    <div class="q-gutter-md row items-center">

    <q-btn @click="showPopup = true" class="custom-btn" style="display: flex; align-items: right;">
    <img src="src\assets\medical_information_24dp_E8EAED_FILL0_wght700_GRAD200_opsz24.png" alt="Descripción de la imagen" class="btn-image" />
    <h6 style="margin-bottom: 5%; margin-top: 5%;">Primera historia</h6>
    </q-btn>

    <div>
      <q-btn @click="showBtn = true" class="q-mb-md custom-btn" color="green" style="width: 400px; height: 100px; margin-left: 130%;">
        <q-icon name="add" size="40px" class="zoom-icon" />
        <span style="margin-left: 10px;">Crear Nueva Evolución</span>
      </q-btn>
    </div>

      <q-table
        :rows="filteredRecords"
        :columns="columns"
        row-key="cedula"
        class="row"
        style="margin-left: 25%; margin-top: 3%; margin-bottom: 5%; overflow: auto;"
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>Evolucion Recientes</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn @click="ver(props.row)" label="Consultar" color="green" />
          </q-td>
        </template>
    </q-table>

<q-dialog v-model="showPopup" persistent>
  <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF;  border-radius: 50px;">
    <q-card class="my-card bg-whithe text-white">
        <q-card class="my-card bg-white text-black" style="margin-bottom: 5%; margin-top: 3%; border-radius: 50px; border: 20px solid #007A7C;">
            <div class="row justify-content-center q-mb-md" style=" align-items: center; margin-top: 5%;">
              <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 1300px; max-height: 1300px; margin-left: 40%; margin-right: 50%; margin-top: -5%; flex-wrap: wrap;"/>
            </div>
            <div style="text-align: center;">
              <h5 style="margin: 0;">Fundación</h5>
              <h4 style="margin: 0;">Hospital Adventista de Venezuela</h4>
              <h6 style="align-self: flex-start; margin-top: 5px;">Rif J-08517758-2</h6>
            </div>

          <q-card-section>
          <div class="text-h6" style="margin: 3%;">HISTORIA CLINICA</div>
          </q-card-section>

          <q-card-section style="margin: 5%; margin-top: -3%;">
            <div class="text-h7">Datos personales</div>
            <q-card-section style="text-align: left;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="name" label="Nombre" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="surname" label="Apellido" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="age" label="Edad" :dense="dense" type="number" @input="validateAge" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>

                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled v-model="birthDate" label="Fecha de Nacimiento" mask="##/##/####" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
              </div>

            </q-card-section>

            <q-card-section style="text-align: center;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; justify-content: center;">
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="idCard" label="Cédula" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="address" label="Dirección" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled v-model="phone" label="Teléfono" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
              </div>
            </q-card-section>
          </q-card-section>

          <q-card-section v-if="isAdult" style="margin: 3%; margin-top: -3%;">
            <div class="text-h7">Representante</div>
            <q-card-section style="text-align: left;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">

                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled v-model="representativeName" label="Nombre y Apellido" :dense="dense" :rules="[val => !!val || 'Field is required']"
                    style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7);"/>
                </div>

                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled v-model="relationship" label="Parentesco" :dense="dense" :rules="[val => !!val || 'Field is required']"
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
              <q-input v-model="medico" label="Medico" :dense="dense" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); "/>

               <q-file color="teal-9" filled v-model="model" label="Firma" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); ">
               <template v-slot:prepend>
                 <q-icon name="cloud_upload" />
               </template>
               </q-file>
              <q-input v-model="fechaRegistro" mask="##/##/####" label="Fecha" :rules="[val => !!val || 'Field is required']" style="border-radius: 30px; background-color: rgba(0, 122, 124, 0.7); "/>
              </div>
          </q-card-section>

            <q-card-section style="display: flex; flex-direction: column; ">
               <div class="q-pa-md q-gutter-md">
                <q-btn @click="salir" icon="cancelar"  class="q-mb-md" color="red"/>
              </div>
            </q-card-section>

        </q-card>
      </q-card>
  </q-card>
</q-dialog>

<q-dialog v-model="showBtn" persistent >
  <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF;  border-radius: 50px;">
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
        <q-input filled type="textarea" v-model="subjetivos" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Objetivo</div>
        <q-input filled type="textarea" v-model="objetivo" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Analisis o Diagnóstico</div>
        <q-input filled type="textarea" v-model="analisi" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Plan terapeutico</div>
        <q-input filled type="textarea" v-model="plant" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <q-card-section>
          <q-card-section style="display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; justify-content: center; align-items: center;">
           <q-input v-model="medicoE" label="Medico" style="max-width: 150px; margin: 0 5px;" />
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

        <q-btn @click="atras" icon="cancelar"  class="q-mb-md" color="red"/>
        </q-card-section>
    </q-card-section>
   </q-card>
  </q-card>
</q-dialog>

<q-dialog v-model="showform" persistent>
    <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF;  border-radius: 50px;">
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
           <q-btn @click="patras" icon="cancelar"  class="q-mb-md" color="red"/>
        </q-card-section>

  </q-card>
</q-dialog>

</div>
</q-card>

</q-card>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRoute } from 'vue-router'

const route = useRoute()
const showPopup = ref(false)
const showBtn = ref(false)
const showform = ref(false)

const filteredRecords = ref([])

const columns = [
  { name: 'Interconsulta', label: 'Interconsulta', align: 'left', field: 'Interconsulta' },
  { name: 'cedula', label: 'cedula', align: 'center', field: 'cedula' },
  { name: 'edad', label: 'edad', align: 'center', field: 'edad' },
  { name: 'medicoE', label: 'Médico', align: 'left', field: 'medicoE' },
  { name: 'fecha', label: 'Fecha Registro', align: 'left', field: 'fecha' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const ver = (data) => {
  // Cargar los datos en las variables reactivas
  Interconsulta.value = data.Interconsulta || ''
  cedula.value = data.cedula || ''
  edad.value = data.edad || ''
  fechaN.value = data.fechaN || ''
  subjetivos.value = data.subjetivos || ''
  objetivo.value = data.objetivo || ''
  analisi.value = data.analisi || ''
  plant.value = data.plant || ''
  medicoE.value = data.medicoE || ''
  fecha.value = data.fecha || ''

  // Mostrar el botón o diálogo
  showform.value = true
}

const isAdult = computed(() => age.value <= 18)

const name = ref(route.query.name || '')
const surname = ref(route.query.surname || '')
const age = ref(route.query.age || '')
const birthDate = ref(route.query.birthDate || '')
const idCard = ref(route.query.idCard || '')
const phone = ref(route.query.phone || '')
const address = ref(route.query.address || '')
const representativeName = ref(route.query.representativeName || '')
const relationship = ref(route.query.relationship || '')
const medico = ref(route.query.medico || '')
const fechaRegistro = ref(route.query.fechaRegistro || '')
const subjetivo = ref(route.query.subjetivo || '')
const ta = ref(route.query.ta || '')
const fc = ref(route.query.fc || '')
const fr = ref(route.query.fr || '')
const t = ref(route.query.t || '')
const salt = ref(route.query.salt || '')
const otros = ref(route.query.otros || '')
const analisis = ref(route.query.analisis || '')
const planterapeutico = ref(route.query.planterapeutico || '')

const evolucionn = ref([])

const cedula = ref('') // Cambia esto a un ref si lo necesitas reactivo
const edad = ref('')
const fechaN = ref('')
const subjetivos = ref('')
const objetivo = ref('')
const analisi = ref('')
const plant = ref('')
const medicoE = ref('')
const fecha = ref('')

cedula.value = route.query.idCard || ''
edad.value = route.query.age || ''
fechaN.value = route.query.birthDate || ''
const dense = ref(false)

const currentInterconsulta = ref(1)
const Interconsulta = ref(`#${currentInterconsulta.value}`)

const storedInterconsulta = localStorage.getItem('currentInterconsulta')
if (storedInterconsulta) {
  currentInterconsulta.value = parseInt(storedInterconsulta, 10)
}

const generateInterconsulta = () => {
  localStorage.setItem('currentInterconsulta', currentInterconsulta.value)
  Interconsulta.value = `#${currentInterconsulta.value}`
  currentInterconsulta.value++
}

const getEvoluciones = async (userDocRef) => {
  try {
    const evolucionesRef = collection(userDocRef, 'Evolucion')
    const querySnapshot = await getDocs(evolucionesRef)

    evolucionn.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    filteredRecords.value = evolucionn.value
  } catch (error) {
    console.error('Error al obtener las evoluciones:', error)
  }
}

async function save () {
  try {
    const userId = cedula.value
    const userDocRef = doc(firestore, 'DatosPersonales', userId)
    const evolucionesRef = collection(userDocRef, 'Evolucion')

    await setDoc(doc(evolucionesRef), {
      Interconsulta: Interconsulta.value,
      cedula: cedula.value,
      edad: edad.value,
      fechaN: fechaN.value,
      subjetivos: subjetivos.value,
      objetivo: objetivo.value,
      analisi: analisi.value,
      plant: plant.value,
      medicoE: medicoE.value,
      fecha: fecha.value
    })
    generateInterconsulta()
    limpiarCampos()
    await getEvoluciones(userDocRef)
  } catch (error) {
    console.error('Error al guardar evolución:', error)
  }
}
function limpiarCampos () {
  subjetivos.value = ''
  objetivo.value = ''
  analisi.value = ''
  plant.value = ''
  medicoE.value = ''
  fecha.value = ''
}

const salir = () => {
  showPopup.value = false
}

const atras = () => {
  showBtn.value = false
}
const patras = () => {
  showform.value = false
}

const getRecords = async () => {
  const querySnapshot = await getDocs(collection(firestore, 'Evolucion'))
  evolucionn.value = querySnapshot.docs.map(doc => doc.data())
  filteredRecords.value = evolucionn.value
  console.log(evolucionn.value)
}

onMounted(() => {
  getRecords()
})

onMounted(() => {
  const userDocRef = doc(firestore, 'DatosPersonales', idCard.value)
  getEvoluciones(userDocRef)
})
</script>

<style scoped>
.custom-btn {
  background-color: rgba(73, 164, 170);
  width: 20%;
  padding: 10px;
  border-radius: 80px;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-btn:hover {
  background-color: rgba(70, 165, 168, 0.9);
  transform: translateY(-10px);
}
.custom-dialog {
  max-width:1000%;
  padding: 50px;
  border-radius: 10px;
}

.btn-image {
  width: 100px; /* Ajusta el tamaño de la imagen según sea necesario */
  height: auto; /* Mantiene la proporción de la imagen */
  margin-bottom: -5%;
}
.btn-images {
  margin-top: -5%;
  margin-left: -10%;
  width: 100px; /* Ajusta el tamaño de la imagen según sea necesario */
  height: auto; /* Mantiene la proporción de la imagen */
  margin-bottom: -5%;
}
</style>
