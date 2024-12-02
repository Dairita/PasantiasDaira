<template>
  <div class="login-page">
    <q-img
      src="~assets/Hospital-Adventista.jpg"
      class="background-image">
    </q-img>
    <div class="login-container">
      <LoginComponent />
    </div>
  </div>
</template>

<script>
import LoginComponent from 'src/components/LoginComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  components: {
    LoginComponent
  }
})
</script>

<style>
.login-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    transform: translateY(-50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.9s ease forwards;
}

.login-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute; /* Cambia a absoluto para cubrir todo el contenedor */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra todo el área */
}

.login-container {
  position: absolute; /* Permite superponer el componente */
  top: 50%; /* Centra verticalmente */
  left: 50%; /* Centra horizontalmente */
  transform: translate(-50%, -50%); /* Ajusta para centrar exactamente */
  display: flex;
  justify-content: center;
  align-items: center;

}

.q-card.login {
    max-width: inherit; /* Hereda el ancho máximo del contenedor */
    width: auto; /* Permite que se ajuste automáticamente al contenedor */
    padding: 60px; /* Espaciado interno para mejorar la apariencia */
}
</style>
