/* const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('firebase-admin')

const serviceAccount = require('./path/to/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const app = express()
app.use(cors({
  origin: 'http://localhost:9000' // Cambia esto al puerto donde corre tu frontend
}))
app.use(bodyParser.json())

const deleteUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid)
    return { success: true, message: `Usuario con UID: ${uid} eliminado exitosamente.` }
  } catch (error) {
    return { success: false, message: `Error al eliminar el usuario: ${error.message}` }
  }
}

// Endpoint para eliminar un usuario
app.delete('/deleteUser/:uid', async (req, res) => {
  const uid = req.params.uid
  const result = await deleteUser(uid)
  res.status(result.success ? 200 : 500).json(result)
})

// Inicia el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
}) */
