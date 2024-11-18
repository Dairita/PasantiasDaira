<template>
  <div style="position: relative;">
    <q-img
      src="~assets/Hospital-Adventista.jpg"
      style="max-width: 2000px; max-height: 100vh;">
    </q-img>

    <div class="centered-rectangle slide-in slideInDown">
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

.centered-rectangle {
  position: absolute;
  top: 15%;
  left: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5); /* Cambia a un color negro con 50% de opacidad */
  padding: 1px 2px;
  border-radius: 10px;
}
</style>
