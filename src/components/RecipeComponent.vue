<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; align-items: center; margin-top: 5%;">
    <q-table
      v-model:pagination="pagination"
      :rows="filteredRecords"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[12]"
      class="q-mt-md custom-table"
      style="background-color: rgba(230, 230, 250, 0.9); border: 20px; width: 100%; height: 90%; margin-top: -5%; background-image: linear-gradient(#1989, #3333);">

      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title style="font-size: 1.9em; font-weight: bold;">Recipes de {{ nombrePaciente }}</q-toolbar-title>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" style="font-size: 2.0em;">
          <q-btn @click="consultar(props.row)" color="cyan-9" icon="person_search"/>
          <q-btn @click="impimir(props.row)" color="cyan-9" icon="print"/>
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from 'boot/firebase' // Ajusta la ruta según tu estructura
import { collection, getDocs } from 'firebase/firestore'

const pagination = ref({})
const columns = [
  { name: 'fecha', label: 'fecha', align: 'left', field: 'name' },
  { name: 'medicoRep', label: 'medicoRep', align: 'left', field: 'ingredients' },
  { name: 'recipe', label: 'recipe', align: 'left', field: 'instructions' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]
const filteredRecords = ref([])
const nombrePaciente = ref('Nombre del Paciente') // Cambia esto según sea necesario

async function loadRecipes () {
  const querySnapshot = await getDocs(collection(db, 'recipes'))
  filteredRecords.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

function consultar (row) {
  console.log('Consultar:', row)
}

function impimir (row) {
  console.log('Imprimir:', row)
}

onMounted(() => {
  loadRecipes()
})
</script>

<style scoped>
  /* Estilos personalizados si es necesario */

</style>
