<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const authCookie = useCookie<string | null>('authToken')
  let hasToken = !!authCookie.value

  if (!hasToken && process.client) {
    hasToken = !!localStorage.getItem('authToken')
  }

  if (!hasToken) {
    navigateTo('/', { replace: true })
  }
})
</script>

<template>
  <div>
    <!-- Use your custom Lexia authentication -->
    <MainScreen />
  </div>
</template>
