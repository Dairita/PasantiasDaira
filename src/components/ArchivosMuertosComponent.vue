<template>
  <div class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>Registros Archivados</q-toolbar-title>
    </q-toolbar>

    <q-table
      v-if="archivedRecords.length > 0"
      :rows="archivedRecords"
      :columns="columns"
      row-key="idCard"
      class="q-mt-md custom-table"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Registros Archivados</q-toolbar-title>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="restaurar(props.row)" label="restaurar" color="primary" />
          <q-btn @click="deleteRecord(props.row.idCard)" label="Eliminar" color="negative" />
        </q-td>
      </template>
    </q-table>

    <div v-else class="q-mt-md">
      <p>No hay registros archivados disponibles.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase' // Asegúrate de que esta ruta es correcta
import { useRoute } from 'vue-router'

const columns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'age', label: 'Edad', align: 'center', field: 'age' },
  { name: 'idCard', label: 'Cédula', align: 'center', field: 'idCard' },
  { name: 'medico', label: 'Médico', align: 'left', field: 'medico' },
  { name: 'fechaRegistro', label: 'Fecha Registro', align: 'left', field: 'fechaRegistro' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const archivedRecords = ref([])

const records = ref([]) // Registros activos

const route = useRoute()

const loadArchivedRecords = async () => {
  try {
    const archivedCollection = collection(firestore, 'archivedRecords')
    const archivedSnapshot = await getDocs(archivedCollection)

    archivedRecords.value = archivedSnapshot.docs.map(doc => ({
      idCard: doc.id,
      ...doc.data()
    }))

    if (route.query.archivedRecord) {
      const newRecord = JSON.parse(route.query.archivedRecord)
      archivedRecords.value.push(newRecord)
    }

    console.log('Registros archivados:', archivedRecords.value) // Para verificar los datos cargados
  } catch (error) {
    console.error('Error al cargar registros archivados:', error)
  }
}

const restaurar = async (record) => {
  // Primero, eliminamos el registro de la colección de archivados
  const archivedCollectionRef = collection(firestore, 'archivedRecords')
  const archivedDocRef = doc(archivedCollectionRef, record.idCard)

  try {
    // Eliminar el registro de Firestore
    await deleteDoc(archivedDocRef)
    console.log('Registro eliminado de los archivados:', record)

    // Luego, lo agregamos a la colección principal
    const recordsCollectionRef = collection(firestore, 'DatosPersonales') // Cambia 'DatosPersonales' por tu colección real
    const newDocRef = doc(recordsCollectionRef, record.idCard)

    await setDoc(newDocRef, record) // Guarda el registro en Firestore
    console.log('Registro restaurado a la colección principal:', record)

    // Actualizar el estado local
    archivedRecords.value = archivedRecords.value.filter(archived => archived.idCard !== record.idCard) // Eliminamos de archivados
    records.value.push(record) // Agregamos a registros activos
  } catch (error) {
    console.error('Error al restaurar el registro:', error)
  }
}

const deleteRecord = (idCard) => {
  // Lógica para eliminar el registro
  console.log('Eliminando registro con ID:', idCard)
}

onMounted(() => {
  loadArchivedRecords()
})
</script>

<style scoped>
.custom-table {
  background-color: #646464; /* Color gris claro */
  border: 2px solid #a9d7d8; /* Mantiene el borde que ya tenías */
  border-radius: 8px;
}

.q-table .q-td {
  color: black; /* Cambia el color del texto a negro */
}
</style>
