<script setup lang="ts">
definePageMeta({
  middleware: [
    () => {
      const token = useCookie<string | null>('token')
      if (!token.value) {
        return navigateTo('/')
      }
    },
  ],
})
</script>

<template>
  <div>
    <!-- Use your custom Lexia authentication -->
    <MainScreen />
  </div>
</template>
