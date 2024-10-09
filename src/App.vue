<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: 'App',
  mounted () {
    this.$q.dark.set(true)
  }
})
</script>
