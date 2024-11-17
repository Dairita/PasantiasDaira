/* const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:9000', // Cambia esto si tu frontend está en otro dominio
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))
app.use(bodyParser.json()) // Para parsear el cuerpo de las solicitudes JSON

// Endpoint para enviar correos de restablecimiento de contraseña
app.post('/api/send-reset-email', async (req, res) => {
  const { email, message } = req.body

  // Validar el correo electrónico
  if (!email || !message) {
    return res.status(400).send('Faltan parámetros requeridos.')
  }

  // Configura tu transportador de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // o cualquier otro servicio
    auth: {
      user: 'clinicadventistab@gmail.com', // Reemplaza con tu dirección de correo electrónico
      pass: 'llii wyvk vdot lrbn' // Usa un token de aplicación en lugar de la contraseña si es posible
    }
  })

  const mailOptions = {
    from: 'clinicadventistab@gmail.com', // Reemplaza con tu dirección de correo electrónico
    to: email,
    subject: 'Restablecimiento de Contraseña',
    text: message
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).send('Correo enviado')
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    res.status(500).send('Error al enviar el correo')
  }
})

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
}) */
