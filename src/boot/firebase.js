import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDCRNhrADPIYdfdPF1MNe5NgBRNQyX_NgA',
  authDomain: 'proyectoclinica-9c40c.firebaseapp.com',
  projectId: 'proyectoclinica-9c40c',
  storageBucket: 'proyectoclinica-9c40c.appspot.com',
  messagingSenderId: '922458389781',
  appId: '1:922458389781:web:92ba85d6f01d2b2e81bd1c',
  measurementId: 'G-8DEYSJ1671'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
const auth = getAuth(app)
const firestore = getFirestore(app)

export { auth, firestore }
