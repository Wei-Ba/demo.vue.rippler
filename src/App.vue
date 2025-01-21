<script setup lang="ts">
import TypeA from './components/type-a.vue'
import TypeB from './components/type-b.vue'
</script>

<template>
  <div class="ripple-view">
    <type-a />
    <type-b />
  </div>
</template>

<style>
.ripple-view{
  padding: 20px;
  display: grid;
  grid-auto-columns: 1fr;
  gap: 20px;
}
</style>
