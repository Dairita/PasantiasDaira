<template>
  <div>
    <div style="position: relative; display: flex;">
      <q-img
        src="src/assets/Hospital-Adventista.jpg"
        style="max-width: 2000px; max-height: 958px;">
      </q-img>
      <div class="centered-rectangle" style="margin-left: 4%;">
        <CuentaComponent/>
      </div>
    </div>
  </div>
</template>

<script setup>
import CuentaComponent from 'src/components/CuentaComponent.vue'
</script>

<style scoped>
.centered-rectangle {
  position: absolute;
  top: 50%;
  left: 46%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 650px;
  background-color: #232627;
  border-radius: 5%;
}
</style>
