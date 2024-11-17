<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; align-items: center; margin-top: 5%;">
      <q-table
        v-model:pagination="pagination"
        :rows="filteredRecords"
        :columns="columns"
        row-key="cedula"
        class="row"
        style="background-color: rgba(230, 230, 250, 0.0); border: 20px; width: 100%; height: 90%; margin-top: -5%; background-image: linear-gradient( #1989, #3333);"
        :rows-per-page-options="[11]"
      >
        <template v-slot:top>
            <q-toolbar >
              <q-btn @click="showPopup = true" class="custom-btn" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 60px; margin-top: 0%;">
                <h6 style="margin: 0;">Primera historia</h6>
            </q-btn>
            </q-toolbar>

          <q-toolbar>
            <q-toolbar-title  style="font-size: 1.2em; font-weight: bold; color: black;">Evolucion Recientes</q-toolbar-title>
            <div style="display: flex; align-items: center; margin-top: 3%;">
              <q-btn @click="showBtn = true" class="q-mb-md custom-btn" color="green" style="width: 60px; height: 60px; margin-left: 5%; display: flex; align-items: center; justify-content: center;">
              <q-icon name="add" size="24px" class="zoom-icon" />
               </q-btn>
               <q-btn @click="handleClick" class="q-mb-md custom-btn" color="teal-8" style="width: 60px; height: 60px; margin-left: 5%; display: flex; align-items: center; justify-content: center;">
                <q-icon name="print" size="24px" class="zoom-icon" />
                </q-btn>
            </div>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn @click="ver(props.row)" icon="troubleshoot" color="cyan-9" />
          </q-td>
        </template>
    </q-table>

<q-dialog v-model="showPopup" persistent>
  <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF; border-radius: 50px;">
    <q-btn @click="salir" icon="cancel" color="red" round style="margin-left: 100%; margin-top: -5%;"/>
        <q-card class="my-card bg-white text-black" style="margin-bottom: 1%; margin-top: -5%; border-radius: 50px; border: 2px solid #007A7C;">
          <div class="row justify-content-start align-items-center" style="margin-top: 5%;">
            <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 1300px; max-height: 1300px; margin-right: 20px; margin-left: 5%;"/>

            <div style="margin-top: 5%;">
            <div style="text-align: left;">
              <h5 style="margin: 10px 0 0 0; color: #4CAF50; font-weight: bold;">Fundación</h5>
                <h4 style="margin: 0;">Hospital Adventista de Venezuela</h4>
                <h6 style="align-self: flex-start; margin-top: 5px;">Rif J-08517758-2</h6>
            </div>
          </div>
        </div>
          <q-card-section>
          <div class="text-h6" style="margin: 3%;">HISTORIA CLINICA</div>
          </q-card-section>

          <q-card-section style="margin: 5%; margin-top: -3%;">
            <div class="text-h7">Datos personales</div>
            <q-card-section style="text-align: left;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="name" label="Nombre" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="surname" label="Apellido" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="age" label="Edad" :dense="dense" type="number" @input="validateAge" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>

                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled readonly v-model="birthDate" label="Fecha de Nacimiento" mask="##/##/####" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
              </div>

            </q-card-section>

            <q-card-section style="text-align: center;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; justify-content: center;">
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="idCard" label="Cédula" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="address" label="Dirección" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled readonly v-model="phone" label="Teléfono" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>
              </div>
            </q-card-section>
          </q-card-section>

          <q-card-section v-if="isAdult" style="margin: 3%; margin-top: -3%;">
            <div class="text-h7">Representante</div>
            <q-card-section style="text-align: left;">
              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">

                <div style="flex: 1; min-width: 200px; margin-right: 10px;">
                  <q-input ref="inputRef" filled readonly v-model="representativeName" label="Nombre y Apellido" :dense="dense"
                    style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>

                <div style="flex: 1; min-width: 200px;">
                  <q-input ref="inputRef" filled readonly v-model="relationship" label="Parentesco" :dense="dense"
                    style=" background-color: rgba(0, 122, 124, 0.7);"/>
                </div>

              </div>
            </q-card-section>
          </q-card-section>

        <q-card-section style="margin: 3%; margin-top: -3%;">
          <div class="text-h7">Motivo de consulta</div>
            <q-card-section style="text-align: left;">

              <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; margin-top: 0%;">
                <q-input
                filled readonly
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
                  <q-input rounded filled readonly v-model="ta" label="T.A" :dense="dense"
                    color="teal-9" style=" background-color: rgba(0, 122, 124, 0.7);">
                  </q-input>
                </div>

                <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                  <q-input rounded filled readonly v-model="fc" label="Fc" :dense="dense"
                    color="teal-9" style=" background-color: rgba(0, 122, 124, 0.7);">
                  </q-input>
                </div>

                <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                  <q-input rounded filled readonly v-model="fr" label="Fr" :dense="dense"
                    color="teal-9" style=" background-color: rgba(0, 122, 124, 0.7);">
                  </q-input>
                </div>

                <div style="flex: 1; min-width: 150px; margin-right: 10px;">
                  <q-input rounded filled readonly v-model="t" label="T°" :dense="dense"
                    color="teal-9" style=" background-color: rgba(0, 122, 124, 0.7);">
                  </q-input>
                </div>

                <div style="flex: 1; min-width: 150px;">
                  <q-input rounded filled readonly v-model="salt" label="SaltO2" :dense="dense"
                    color="teal-9" style=" background-color: rgba(0, 122, 124, 0.7);">
                  </q-input>
                </div>

              </div>

              <div style="margin-top: 5%;">

                <q-input
                filled readonly
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
            filled readonly
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
                filled readonly
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
              <q-input v-model="medico" readonly label="Medico" :dense="dense" style=" background-color: rgba(0, 122, 124, 0.7); "/>

               <q-file color="teal-9" filled v-model="model" label="Firma" style=" background-color: rgba(0, 122, 124, 0.7); ">
               <template v-slot:prepend>
                 <q-icon name="cloud_upload" />
               </template>
               </q-file>
              <q-input v-model="fechaRegistro" readonly mask="##/##/####" label="Fecha" style=" background-color: rgba(0, 122, 124, 0.7); "/>
              </div>
          </q-card-section>

        </q-card>
      </q-card>
</q-dialog>

<q-dialog v-model="showBtn" persistent >
  <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF;  border-radius: 50px;">
    <q-card class="my-card bg-gray text-white" style="margin-top: 20px;">
      <q-btn @click="atras" icon="cancel" color="red" round style="margin-left: 100%; margin-top: -5%;"/>
      <q-card-section>
        <div class="text-h6">EVOLUCION</div>
      </q-card-section>
      <q-card-section>
        <q-card-section style="text-align: left;">
          <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
         <q-input rounded filled readonly v-model="InterconsultaEV" label="Interconsulta" :dense="dense" :rules="[val => val && val.length > 0 || 'No Dejes campos vacios']"
         :error="name === ''" :error-message="name === '' ? 'No Dejes campos vacios' : ''" style="flex: 1; min-width: 200px; margin-right: 10px;"></q-input>

         <q-input rounded filled readonly v-model="cedulaEV" label="Cédula" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la cédula']"
          :error="idCard === ''" :error-message="idCard === '' ? 'Por favor ingresa la cédula' : ''" style="flex: 1; min-width: 200px;">
        </q-input>

         <q-input rounded filled v-model="edadEV" label="Edad" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la edad']"
         :error="age === ''" :error-message="age === '' ? 'Por favor ingresa la edad' : ''" type="number" @input="validateAge" style="flex: 1; min-width: 200px;"></q-input>

         <q-input rounded filled readonly v-model="fechaNEV" mask="##/##/####" label="Fecha de Nacimiento" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa fecha de nacimiento']"
         :error="birthDate === ''" :error-message="birthDate === '' ? 'Por favor ingresa fecha de nacimiento' : ''" style="flex: 1; min-width: 200px;"></q-input>
          </div>
        </q-card-section>

        <div style="margin-top: 5%;">
        <div class="text-h6">Subjetivo</div>
        <q-input filled type="textarea" v-model="subjetivosEV" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Objetivo</div>
        <q-input filled type="textarea" v-model="objetivoEV" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Analisis o Diagnóstico</div>
        <q-input filled type="textarea" v-model="analisiEV" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <div style="margin-top: 5%;">
        <div class="text-h6">Plan terapeutico</div>
        <q-input filled type="textarea" v-model="plantEV" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
        </div>

        <q-card-section>
          <q-card-section style="display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; justify-content: center; align-items: center;">
           <q-input v-model="medicoEEV"  label="Medico" style="max-width: 150px; margin: 0 5px;" />
           <q-file color="teal" filled v-model="model" label="Firma" style="max-width: 150px; margin: 0 5px;">
           <template v-slot:prepend>
           <q-icon name="cloud_upload" />
           </template>
          </q-file>
          <q-input v-model="fechaEV" readonly mask="##/##/####" label="Fecha" style="max-width: 150px; margin: 0 5px;" />
          </div>
          </q-card-section>
        </q-card-section>

        <q-card-section style="display: flex; flex-direction: column; align-items: center;">
         <q-btn color="teal" @click="save" icon="save_as"/>

        </q-card-section>
    </q-card-section>
   </q-card>
  </q-card>
</q-dialog>

<q-dialog v-model="showform" persistent>
    <q-card class="custom-dialog" style="background-color: #007A7C; border: 1px solid #FFFFFF;  border-radius: 50px;">
      <q-btn @click="patras" icon="cancel" color="red" round style="margin-left: 100%; margin-top: -5%;"/>

        <q-card-section>
          <div class="text-h6">EVOLUCION</div>
        </q-card-section>

        <q-card-section>
          <q-card-section style="text-align: left;">
            <div class="q-gutter-md" style="display: flex; flex-wrap: wrap;">
           <q-input rounded filled readonly v-model="Interconsulta" label="Interconsulta" :dense="dense" :rules="[val => val && val.length > 0 || 'No Dejes campos vacios']"
           :error="name === ''" :error-message="name === '' ? 'No Dejes campos vacios' : ''" style="flex: 1; min-width: 200px; margin-right: 10px;"></q-input>

           <q-input rounded filled readonly v-model="cedula" label="Cédula" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la cédula']"
            :error="idCard === ''" :error-message="idCard === '' ? 'Por favor ingresa la cédula' : ''" style="flex: 1; min-width: 200px;">
          </q-input>

           <q-input rounded filled readonly v-model="edad" label="Edad" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa la edad']"
           :error="age === ''" :error-message="age === '' ? 'Por favor ingresa la edad' : ''" type="number" @input="validateAge" style="flex: 1; min-width: 200px;"></q-input>

           <q-input rounded filled readonly v-model="fechaN" mask="##/##/####" label="Fecha de Nacimiento" :dense="dense" :rules="[val => val && val.length > 0 || 'Por favor ingresa fecha de nacimiento']"
           :error="birthDate === ''" :error-message="birthDate === '' ? 'Por favor ingresa fecha de nacimiento' : ''" style="flex: 1; min-width: 200px;"></q-input>
            </div>
          </q-card-section>

          <div style="margin-top: 5%;">
          <div class="text-h6">Subjetivo</div>
          <q-input filled type="textarea" readonly v-model="subjetivos" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
          </div>

          <div style="margin-top: 5%;">
          <div class="text-h6">Objetivo</div>
          <q-input filled type="textarea" readonly v-model="objetivo" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
          </div>

          <div style="margin-top: 5%;">
          <div class="text-h6">Analisis o Diagnóstico</div>
          <q-input filled type="textarea" readonly v-model="analisis" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
          </div>

          <div style="margin-top: 5%;">
          <div class="text-h6">Plan terapeutico</div>
          <q-input filled type="textarea" readonly v-model="plant" label="Otros" rows="5" counter maxlength="5000" style="flex: 1;" />
          </div>

          <q-card-section>
            <q-card-section style="display: flex; flex-direction: column; align-items: center;">
            <div style="display: flex; justify-content: center; align-items: center;">
             <q-input v-model="medico" readonly label="Medico" style="max-width: 150px; margin: 0 5px;" />
             <q-file color="teal" filled v-model="model" label="Firma" style="max-width: 150px; margin: 0 5px;">
             <template v-slot:prepend>
             <q-icon name="cloud_upload" />
             </template>
            </q-file>
            <q-input v-model="fecha" readonly mask="##/##/####" label="Fecha" style="max-width: 150px; margin: 0 5px;" />
            </div>
            </q-card-section>
          </q-card-section>

        </q-card-section>

  </q-card>
</q-dialog>

</div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { doc, setDoc, collection, getDocs, getDoc } from 'firebase/firestore'
import { firestore, db } from 'boot/firebase'
import { useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'

const route = useRoute()

const showPopup = ref(false)
const showBtn = ref(false)
const showform = ref(false)

const filteredRecords = ref([])

const showPage1 = ref(true)
const showPage2 = ref(true)

const handleClick = () => {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir</title>
        <style>
          @media print {
            .print-page {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
  `)

  if (showPage1.value) {
    printWindow.document.write(`
      <div class="print-page">

      <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 160px; max-height: 160px; margin-right: 20px;"/>
          <div style="margin-top: 6%">
              <h5 style="margin: 0; font-size: 1.6em; color: green;">Fundación</h5>
              <h4 style="margin: 0; font-size: 1.6em; color: #008080;">Hospital Adventista de Venezuela</h4>
              <h6 style="align-self: flex-start; margin-top: 5px; font-size: 1.2em; color: #008080;">Rif J-08517758-2</h6>
          </div>
      </div>

      <div class="text-h4" style="margin: 3%;">HISTORIA CLINICA</div>
      <div class="text-h2" style="margin: 3%; font-weight: bold; color: green; font-size: 1.3em;">Datos Personales</div>

      <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Nombre:</strong> <span style="text-decoration: underline;">${name.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Apellido:</strong> <span style="text-decoration: underline;">${surname.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Cédula:</strong> <span style="text-decoration: underline;">${idCard.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Edad:</strong> <span style="text-decoration: underline;">${age.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Fecha de Nacimiento:</strong> <span style="text-decoration: underline;">${birthDate.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Teléfono:</strong> <span style="text-decoration: underline;">${phone.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Dirección:</strong> <span style="text-decoration: underline;">${address.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Representante:</strong> <span style="text-decoration: underline;">${representativeName.value}</span></p>
          <p style="font-size: 1.1em; margin: 5px 0;"><strong>Relación:</strong> <span style="text-decoration: underline;">${relationship.value}</span></p>
      </div>

      <div class="text-h2" style="margin: 3%; font-weight: bold; color: green; font-size: 1.3em;">Motivos de Consulta</div>
      <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
       <p style="font-size: 1.1em; margin: 5px 0;"><strong>Subjetivo:</strong> <span style="text-decoration: underline;">${subjetivo.value}</span></p>
      </div>

    <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
        <p style="flex-basis: calc(33.33% - 20px); font-size: 1.1em; margin: 3px 0;"><strong>T.A:</strong> ${ta.value}</p>
        <p style="flex-basis: calc(33.33% - 20px); font-size: 1.1em; margin: 3px 0;"><strong>F.C:</strong> ${fc.value}</p>
        <p style="flex-basis: calc(33.33% - 20px); font-size: 1.1em; margin: 3px 0;"><strong>F.R:</strong> ${fr.value}</p>
        <p style="flex-basis: calc(33.33% - 20px); font-size: 1.1em; margin: 3px 0;"><strong>T:</strong> ${t.value}</p>
        <p style="flex-basis: calc(33.33% - 20px); font-size: 1.1em; margin: 3px 0;"><strong>Salt:</strong> ${salt.value}</p>
        <p style="flex-basis: 100%; font-size: 1.1em; margin: 3px 0;"><strong>Otros:</strong> ${otros.value}</p>
    </div>

      <div class="text-h2" style="margin: 3%; font-weight: bold; color: green; font-size: 1.3em;">Analisis</div>
      <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
       <p style="font-size: 1.1em; margin: 5px 0;"><strong>Diagnostico:</strong> <span style="text-decoration: underline;">${analisis.value}</span></p>
      </div>

       <div class="text-h2" style="margin: 3%; font-weight: bold; color: green; font-size: 1.3em;">Plan Terapeutico</div>
      <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
       <p style="font-size: 1.1em; margin: 5px 0;"><strong>Plan terapeutico:</strong> <span style="text-decoration: underline;">${planterapeutico.value}</span></p>
      </div>

      <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px">
            <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: center">
          <div style="text-align: left;">
              <p style="font-size: 1.1em; margin: 3px 0;"><strong>Médico:</strong> ${medico.value}</p>
              <p style="font-size: 1.1em; margin: 3px 0;"><strong>Fecha de Registro:</strong> ${fechaRegistro.value}</p>
          </div>

          <div style="margin-left: 200px">
              <strong>Firma:</strong>
              <div style="border: 1px solid #000; width: 200px; height: 30px; margin-top: 5px;">
                  <img src="ruta/a/la/firma.png" alt="Firma" style="max-width: 100%; max-height: 50%;"/>
              </div>
            </div>
          </div>
       </div>

      </div>
    `)
  }

  if (showPage2.value) {
    filteredRecords.value.forEach(record => {
      printWindow.document.write(`
        <div class="print-page">

          <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <img alt="Quasar logo" src="src/assets/images-removebg-preview.png" style="max-width: 160px; max-height: 160px; margin-right: 20px;"/>
          <div style="margin-top: 6%">
              <h5 style="margin: 0; font-size: 1.6em; color: green;">Fundación</h5>
              <h4 style="margin: 0; font-size: 1.6em; color: #008080;">Hospital Adventista de Venezuela</h4>
              <h6 style="align-self: flex-start; margin-top: 5px; font-size: 1.2em; color: #008080;">Rif J-08517758-2</h6>
          </div>
          </div>

           <div class="text-h4" style="margin: 3%;">EVOLUCION</div>
          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p><strong>Interconsulta:</strong> ${record.Interconsulta || ''} </p>
          <p><strong>Cédula:</strong> ${record.cedula || ''}</p>
          <p><strong>Edad:</strong> ${record.edad || ''}</p>
          <p><strong>Fecha de Nacimiento:</strong> ${record.fechaN || ''}</p>
          </div>

          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p style="font-size: 1.1em; margin: 3px 0;"><strong style="color: green; font-size: 1.2em;">Subjetivo:</strong> ${record.subjetivos || ''}</p>
          </div>

          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p style="font-size: 1.1em; margin: 3px 0;"><strong style="color: green; font-size: 1.2em;">Objetivo:</strong> ${record.objetivo || ''}</p>
          </div>

          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p style="font-size: 1.1em; margin: 3px 0;"><strong style="color: green; font-size: 1.2em;">Análisis:</strong> ${record.analisi || ''}</p>
          </div>

          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px;">
          <p style="font-size: 1.1em; margin: 3px 0;"><strong style="color: green; font-size: 1.2em;">Plan Terapéutico:</strong> ${record.plant || ''}</p>
          </div>

          <div style="margin: 3%; display: flex; flex-wrap: wrap; gap: 20px">
          <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: center">
          <div style="text-align: left;">
          <p style="font-size: 1.1em; margin: 3px 0;"><strong>Médico:</strong>${record.medicoE || ''}</p>
          <p style="font-size: 1.1em; margin: 3px 0;"><strong>Fecha de Registro:</strong> ${record.fecha || ''}</p>
          </div>

          <div style="margin-left: 200px">
          <strong>Firma:</strong>
          <div style="border: 1px solid #000; width: 200px; height: 30px; margin-top: 5px;">
          <img src="ruta/a/la/firma.png" alt="Firma" style="max-width: 100%; max-height: 50%;"/>
          </div>
          </div>
          </div>
          </div>

        </div>
      `)
    })
  }

  printWindow.document.write(`
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.print()
}

const columns = [
  { name: 'Interconsulta', label: 'Interconsulta', align: 'left', field: 'Interconsulta' },
  { name: 'cedula', label: 'cedula', align: 'center', field: 'cedula' },
  { name: 'edad', label: 'edad', align: 'center', field: 'edad' },
  { name: 'medicoE', label: 'Médico', align: 'left', field: 'medicoE' },
  { name: 'fecha', label: 'Fecha Registro', align: 'left', field: 'fecha' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const pagination = ref({
  sortBy: 'Interconsulta',
  descending: true,
  page: 1,
  rowsPerPage: 11
})

const Interconsulta = ref('')

const ver = (data) => {
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
const cedula = ref('')
const edad = ref('')
const fechaN = ref('')
const subjetivos = ref('')
const objetivo = ref('')
const analisi = ref('')
const plant = ref('')
const medicoE = ref('')
const fecha = ref('')

const subjetivosEV = ref('')
const objetivoEV = ref('')
const analisiEV = ref('')
const plantEV = ref('')
const medicoEEV = ref('')
const fechaEV = ref('')

const cedulaEV = ref('')
const edadEV = ref('')
const fechaNEV = ref('')

cedulaEV.value = route.query.idCard || ''
edadEV.value = route.query.age || ''
fechaNEV.value = route.query.birthDate || ''
const dense = ref(false)

const currentInterconsulta = ref(1)
const InterconsultaEV = ref(`#${currentInterconsulta.value}`)

const loadMaxInterconsulta = async (userDocRef) => {
  const evolucionesRef = collection(userDocRef, 'Evolucion')
  const querySnapshot = await getDocs(evolucionesRef)

  const interconsultas = querySnapshot.docs.map(doc => parseInt(doc.data().Interconsulta.replace('#', '')))

  if (interconsultas.length > 0) {
    currentInterconsulta.value = Math.max(...interconsultas) + 1 // Establecer el siguiente número
  }

  InterconsultaEV.value = `#${currentInterconsulta.value}` // Actualizar el valor de Interconsulta
}

const getEvoluciones = async (userDocRef) => {
  try {
    const evolucionesRef = collection(userDocRef, 'Evolucion')
    const querySnapshot = await getDocs(evolucionesRef)

    evolucionn.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    filteredRecords.value = evolucionn.value
    await loadMaxInterconsulta(userDocRef)
  } catch (error) {
    console.error('Error al obtener las evoluciones:', error)
  }
}

import useNotificaciones from 'boot/useNotificaciones'

const { agregarNotificacion } = useNotificaciones()

async function save () {
  try {
    const idCard = cedulaEV.value
    const userDocRef = doc(firestore, 'DatosPersonales', idCard)
    const evolucionesRef = collection(userDocRef, 'Evolucion')

    const newRecord = {
      Interconsulta: InterconsultaEV.value,
      cedula: cedulaEV.value,
      edad: edadEV.value,
      fechaN: fechaNEV.value,
      subjetivos: subjetivosEV.value,
      objetivo: objetivoEV.value,
      analisi: analisiEV.value,
      plant: plantEV.value,
      medicoE: medicoEEV.value,
      fecha: new Date().toISOString(),
      usuarioregistro: medicoEEV.value
    }

    await setDoc(doc(evolucionesRef), newRecord)
    filteredRecords.value.push(newRecord)
    currentInterconsulta.value += 1
    InterconsultaEV.value = `#${currentInterconsulta.value}`

    agregarNotificacion(`${medicoEEV.value} añadio una evolucion del paciente ${name.value} ${surname.value} el.`)

    limpiarCampos()
  } catch (error) {
    console.error('Error al guardar evolución:', error)
  }
}

const setFechaActual = () => {
  const hoy = new Date()
  const dia = String(hoy.getDate()).padStart(2, '0')
  const mes = String(hoy.getMonth() + 1).padStart(2, '0') // Los meses son base cero
  const año = hoy.getFullYear()

  fechaEV.value = `${dia}/${mes}/${año}`
}

onMounted(async () => {
  setFechaActual()
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const userId = user.email
    const docRef = doc(db, 'usersColecction', userId)

    try {
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        medicoEEV.value = docSnap.data().username
      } else {
        console.log('El documento no existe')
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error)
    }
  } else {
    console.log('No hay usuario autenticado')
  }
})
function limpiarCampos () {
  subjetivosEV.value = ''
  objetivoEV.value = ''
  analisiEV.value = ''
  plantEV.value = ''
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
