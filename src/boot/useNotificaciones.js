import { ref } from 'vue'
import { db } from './firebase' // Ajusta la ruta según sea necesario
import { collection, addDoc } from 'firebase/firestore'

const notificaciones = ref([])

const agregarNotificacion = async (mensaje) => {
  // Función para formatear la fecha y la hora
  const formatearFechaYHora = (fecha) => {
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }

    const fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha)
    const horaFormateada = fecha.toLocaleTimeString('en-US', opcionesHora)

    return {
      fecha: fechaFormateada,
      hora: horaFormateada
    }
  }

  try {
    const ahora = new Date()
    const { fecha, hora } = formatearFechaYHora(ahora)
    const docRef = await addDoc(collection(db, 'Movimientos'), {
      Actividad: mensaje,
      fecha,
      hora,
      visto: false
    })

    notificaciones.value.push({ id: docRef.id, Actividad: mensaje, fecha, hora, visto: false })
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}
const contarNotificacionesNoVistas = () => {
  return notificaciones.value.filter(notif => !notif.visto).length
}

const obtenerNotificaciones = () => {
  return notificaciones.value
}

export default function useNotificaciones () {
  return {
    agregarNotificacion,
    obtenerNotificaciones,
    contarNotificacionesNoVistas
  }
}
