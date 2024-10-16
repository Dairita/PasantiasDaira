<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; align-items: center; margin-top: 5%;">
    <div style="display: flex; align-items: center;"></div>

    <q-table
      :rows="filteredRecords"
      :columns="columns"
      row-key="id"
      class="q-mt-md custom-table"
      style="background-color: white; border: 20px solid #007A7C; width: 100%; height: 90%; margin-top: -5%"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Registros Médicos</q-toolbar-title>
          <div style="display: flex; align-items: center;">
            <q-input standout v-model="text" label="Cédula" @input="search" />
            <q-btn @click="search" color="secondary" label="Buscar" style="margin-left: 10px;" />
          </div>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="consultar(props.row)" label="Consultar" color="primary"/>
          <q-btn @click="deleteRecord(props.row.idCard)" label="Eliminar" color="negative" style="margin-left: 10px;" />

    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="black text-white" style="width: 3000px">
        <q-card-section>
          <div class="text-h6">Acceso a historia medica</div>
        </q-card-section>

        <q-card-section class="q-pa-md" style="margin-left: 20%;" >
          <p>ingresa tu contraseña</p>
          <q-input
          v-model="pass"
          :class="{'error-input': passError}"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Contraseña"
          :dense="dense"
          style="width: 50%; margin-left: 10%; background-color: #1e1e2f; border-radius: 16px; color: white;"
        />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn @click="acceder(selectedRow)" label="Consultar" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
        </q-td>

      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const filteredRecords = ref([])

const text = ref('')
const persistent = ref(false)
const selectedRow = ref(null) // New ref to hold selected row data

const columns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { birthDate: 'age', label: 'Edad', align: 'center', field: 'age' },
  { idCard: 'idCard', label: 'Cédula', align: 'center', field: 'idCard' },
  { medico: 'medico', label: 'Médico', align: 'left', field: 'medico' },
  { fechaRegistro: 'fechaRegistro', label: 'Fecha Registro', align: 'left', field: 'fechaRegistro' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const records = ref([])

const deleteRecord = async (idCard) => {
  const index = records.value.findIndex(record => record.idCard === idCard)

  if (index !== -1) {
    const archivedRecord = records.value[index] // Guardar el registro a archivar

    // Eliminar el registro de la lista activa
    records.value.splice(index, 1)

    // Guardar el registro archivado en Firestore
    const archivedCollectionRef = collection(firestore, 'archivedRecords')
    const archivedDocRef = doc(archivedCollectionRef, archivedRecord.idCard)

    try {
      await setDoc(archivedDocRef, archivedRecord) // Guarda el registro en Firestore
      console.log('Registro archivado en Firestore:', archivedRecord)

      // También eliminar el registro de la colección activa
      const recordsCollectionRef = collection(firestore, 'DatosPersonales') // Cambia 'DatosPersonales' por tu colección real
      const recordDocRef = doc(recordsCollectionRef, idCard)
      await deleteDoc(recordDocRef) // Eliminar el documento de la colección activa

      console.log('Registro eliminado de la colección activa:', idCard)

      // Actualiza la lista de registros activos después de archivar
      await loadRecords()
    } catch (error) {
      console.error('Error al archivar o eliminar el registro:', error)
    }

    router.push({
      path: '/archivosmuertos',
      query: { archivedRecord: JSON.stringify(archivedRecord) }
    })

    console.log('Registro archivado:', archivedRecord)
  }
}

const loadRecords = async () => {
  try {
    const recordsCollection = collection(firestore, 'DatosPersonales') // Cambia 'DatosPersonales' por tu colección real
    const recordsSnapshot = await getDocs(recordsCollection)

    // Cargar solo los registros que no están archivados
    records.value = recordsSnapshot.docs.map(doc => ({
      idCard: doc.id,
      ...doc.data()
    }))

    console.log('Registros activos:', records.value) // Para verificar los datos cargados
  } catch (error) {
    console.error('Error al cargar registros:', error)
  }
}

const consultar = (rowData) => {
  persistent.value = true
  selectedRow.value = rowData
}

async function acceder (rowData) {
  try {
    console.log('Consultando datos para idCard:', rowData.idCard)
    const docRef = doc(firestore, 'DatosPersonales', rowData.idCard)
    const motivosC = doc(firestore, 'MotivosConsulta', rowData.idCard)

    const docSnap = await getDoc(docRef)
    const motivoc = await getDoc(motivosC)

    if (docSnap.exists() && motivoc.exists()) {
      const personalData = docSnap.data()
      const motivoData = motivoc.data()

      console.log('Datos personales:', personalData)
      console.log('Motivo de consulta:', motivoData)

      const combinedData = { ...personalData, ...motivoData }

      router.push({
        path: '/actualizar',
        query: {
          name: combinedData.name,
          surname: combinedData.surname,
          age: combinedData.age,
          birthDate: combinedData.birthDate,
          idCard: combinedData.idCard,
          address: combinedData.address,
          phone: combinedData.phone,
          representativeName: combinedData.representativeName,
          relationship: combinedData.relationship,
          medico: combinedData.medico,
          fechaRegistro: combinedData.fechaRegistro,
          analisis: combinedData.analisis,
          fc: combinedData.fc,
          fr: combinedData.fr,
          otros: combinedData.otros,
          planterapeutico: combinedData.planterapeutico,
          salt: combinedData.salt,
          subjetivo: combinedData.subjetivo,
          t: combinedData.t,
          ta: combinedData.ta
        }
      })
    } else {
      if (!docSnap.exists()) {
        console.log('No se encontró el documento de DatosPersonales!')
      }
      if (!motivoc.exists()) {
        console.log('No se encontró el documento de MotivosConsulta!')
      }
    }
  } catch (error) {
    console.error('Error al consultar los datos personales:', error)
  }
}

onMounted(() => {
  getRecords()
  loadRecords()
})

const getRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'DatosPersonales'))
    records.value = querySnapshot.docs.map(doc => ({ idCard: doc.id, ...doc.data() }))
    filteredRecords.value = records.value
  } catch (error) {
    console.error('Error al obtener registros:', error)
  }
}

const search = () => {
  if (text.value) {
    const searchText = text.value.toLowerCase()
    filteredRecords.value = records.value.filter(record =>
      record.idCard.toLowerCase().includes(searchText)
    )
  } else {
    filteredRecords.value = records.value
  }
}
</script>

<style scoped>
.my-card {
  height: 100vh;
}

.custom-table {
  color: black; /* Set text color to black */
}

/* Increase font size for table headers */
.custom-table .q-th {
  font-size: 30px !important; /* Use !important to enforce the style */
}
/* Increase font size for table cells */
.custom-table .q-td {
  font-size: 18px; /* Adjust as needed */
}
</style>
