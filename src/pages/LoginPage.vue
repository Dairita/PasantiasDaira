<template>
  <div style="position: relative;">
    <q-img
      src="src/assets/Hospital-Adventista.jpg"
      style="max-width: 2000px; max-height: 958px;">
    </q-img>

    <div class="centered-rectangle" style="opacity: 4.0; margin-left: 4%;">
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

.centered-rectangle {
  position: absolute;
  top: 48%;
  left: 48%;
  transform: translate(-50%, -50%);
  background-color: #15c8ff;
  opacity: 0.5;
  padding: 1px 2px;
  border-radius: 30px;
}
</style>
