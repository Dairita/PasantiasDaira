<template>
  <div class="q-pa-md" style="height: 100vh; display: flex; flex-direction: column; align-items: center; margin-top: 5%;">
    <div v-if="showActualizacion">
    </div>
    <div style="display: flex; align-items: center;"/>

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
          <q-toolbar-title style="font-size: 1.9em; font-weight: bold;">Registros Médicos</q-toolbar-title>
          <div style="display: flex; align-items: center;">
            <q-input standout v-model="text" label="Buscar Cédula" mask="##.###.###" style="border-radius: 5px; background-color: rgba(3, 122, 124, 0.7);"/>
            <q-btn @click="exportToExcel" class="q-mb-md" color="red" style="margin-top: 5%; width: 40px; height: 40px; margin-left: 5%; display: flex; align-items: center; justify-content: center; padding: 20px;">
              <q-icon name="view_list" size="24px" class="zoom-icon" />
            </q-btn>
          </div>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" style="font-size: 2.0em;">
          <q-btn @click="consultar(props.row)" color="cyan-9" icon="person_search"/>
          <q-btn @click="deleteRecord(props.row.idCard)" icon="delete" v-if="isDeleteButtonVisible(props.row.fechaRegistro, props.row.fecha)" color="negative" style="margin-left: -10px;"/>
        </q-td>
      </template>

</q-table>
    <q-dialog v-model="persistent" transition-show="scale" transition-hide="scale">
      <q-card class="black patients.idCard-white" style="width: 400px">
        <q-card-section>
          <div class="patients.idCard-h6">Historia Medica</div>
          <q-card-section style="margin-left: 10%;">
            <q-btn @click="acceder(selectedRow)" label="Acceso a historia medica" icon="search" color="teal-9"/>
          </q-card-section>
        </q-card-section>
        <q-inner-loading
          :showing="visible"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </q-dialog>
  </div>

</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy, limit, query, addDoc } from 'firebase/firestore'
import { firestore } from 'boot/firebase'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
// import useNotificaciones from 'boot/useNotificaciones'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

function exportToExcel () {
  const worksheet = XLSX.utils.json_to_sheet(patients.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients')
  XLSX.writeFile(workbook, 'patients_data.xlsx')
}

// const { agregarNotificacion } = useNotificaciones()

const router = useRouter()
const persistent = ref(false)
const selectedRow = ref(null)
const patients = ref([])
const records = ref([])
const passError = ref(false)
const visible = ref(false)

onMounted(() => {
  getRecords()
  getPatientsWithLastConsultation()
})

const text = ref('')

const columns = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'age', label: 'Edad', align: 'center', field: 'age' },
  { name: 'idCard', label: 'Cédula', align: 'center', field: 'idCard' },
  { name: 'medico', label: 'Médico', align: 'left', field: 'medico' },
  { name: 'fechaRegistro', label: 'Fecha Registro', align: 'left', field: 'fechaRegistro' },
  { name: 'fecha', label: 'Última Consulta', align: 'left', field: 'fecha' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const filteredRecords = computed(() => {
  if (!text.value) {
    return patients.value
  }

  const lowerCaseText = text.value.toLowerCase()

  return patients.value.filter(patient =>
    patient.idCard.toLowerCase().includes(lowerCaseText)
  )
})

const pagination = ref({
  sortBy: 'fechaRegistro',
  descending: true,
  page: 1,
  rowsPerPage: 11
})

async function getPatientsWithLastConsultation () {
  const patientsRef = collection(firestore, 'DatosPersonales')
  const patientsSnapshot = await getDocs(patientsRef)

  patients.value = []
  for (const doc of patientsSnapshot.docs) {
    const patientData = doc.data()
    const evolutionsRef = collection(doc.ref, 'Evolucion')
    const evolutionsQuery = query(evolutionsRef, orderBy('fecha', 'desc'), limit(1))

    try {
      const evolutionsSnapshot = await getDocs(evolutionsQuery)
      let lastConsultationDate = null

      if (!evolutionsSnapshot.empty) {
        lastConsultationDate = evolutionsSnapshot.docs[0].data().fecha
        console.log(`Última fecha de evolución para ${patientData.name}: ${lastConsultationDate}`)
      }

      const fechaRegistro = patientData.fechaRegistro || null

      patients.value.push({
        ...patientData,
        fecha: lastConsultationDate,
        fechaRegistro
      })
    } catch (error) {
      console.error(`Error al obtener las evoluciones para ${patientData.name}:`, error)
    }
  }
}

function isDeleteButtonVisible (fechaRegistro, lastConsultationDate) {
  const today = dayjs()
  const expirationDate = lastConsultationDate
    ? dayjs(lastConsultationDate).add(10, 'year')
    : dayjs(fechaRegistro).add(10, 'year')
  console.log(`Fecha de vencimiento: ${expirationDate.format('DD/MM/YYYY')}`)
  return expirationDate.isBefore(today)
}

const deleteRecord = async (idCard) => {
  const index = records.value.findIndex(record => record.idCard === idCard)

  if (index !== -1) {
    const archivedRecord = records.value[index]

    const archivedCollectionRef = collection(firestore, 'archivedRecords')
    const archivedDocRef = doc(archivedCollectionRef, archivedRecord.idCard)

    try {
      await setDoc(archivedDocRef, archivedRecord)
      console.log('Registro archivado en Firestore:', archivedRecord)

      const recordsCollectionRef = collection(firestore, 'DatosPersonales')
      const recordDocRef = doc(recordsCollectionRef, idCard)

      await deleteDoc(recordDocRef)
      console.log('Registro eliminado de la colección activa:', idCard)
    } catch (error) {
      console.error('Error al archivar o eliminar el registro:', error)
    }

    console.log('Registro archivado:', archivedRecord)
  }
}

const consultar = (rowData) => {
  persistent.value = true
  selectedRow.value = rowData
}

async function acceder (rowData) {
  visible.value = true
  try {
    passError.value = false

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

      visible.value = false
      // agregarNotificacion(`${combinedData.medico} consulto la historia medica del paciente ${combinedData.name} ${combinedData.surname} el `)

      const auth = getAuth()
      const user = auth.currentUser

      if (user) {
        const userDocRef = doc(firestore, 'usersColecction', user.email)
        const mensaje = `Accedió la historia medica del paciente ${combinedData.name} ${combinedData.surname} el ${formatDate(new Date())}`
        const actividadCollectionRef = collection(userDocRef, 'actividad')
        try {
          await addDoc(actividadCollectionRef, { mensaje })
          console.log('Mensaje guardado en la subcolección actividad.')
        } catch (error) {
          console.error('Error al guardar el mensaje:', error)
        }
      }
    } else {
      if (!docSnap.exists()) {
        console.log('No se encontró el documento de DatosPersonales!')
      }
      if (!motivoc.exists()) {
        console.log('No se encontró el documento de MotivosConsulta!')
      }
    }
  } catch (error) {
    visible.value = false
    console.error('Error al consultar los datos personales:', error)
    passError.value = true
  }
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return formattedDate.replace(',', '').replace('AM', 'AM').replace('PM', 'PM')
}

const getRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'DatosPersonales'))
    records.value = querySnapshot.docs.map(doc => ({ idCard: doc.id, ...doc.data() }))
    filteredRecords.value = records.value
  } catch (error) {
    console.error('Error al obtener registros:', error)
  }
}

</script>

<style scoped>

.error-input {
  border-color: red !important; /* Cambia el color del borde a rojo */
}

.error-message {
  color: red; /* Color del mensaje de error */
  margin-top: 5px; /* Espaciado superior para el mensaje */
}

.my-card {
  height: 100vh;
}

.custom-table {
  color: black; /* Set text color to black */

}

</style>
