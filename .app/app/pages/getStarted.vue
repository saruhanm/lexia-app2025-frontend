<script setup>
import { MainGetStartedScreen } from '#components'

// Page metadata
useHead({
  title: 'Lexia - Enhanced Reading Experience',
  meta: [
    { name: 'description', content: 'Make reading easier with personalized text formatting' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})

// Handle authentication success
function handleGetStarted() {
  // console.log('Login successful:', credentials) // Debug logging removed
  // TODO: Navigate to dashboard or main app
  navigateTo('/getStarted')
}
</script>

<template>
  <div>
    <!-- Use your custom Lexia authentication -->
    <MainGetStartedScreen />
  </div>
</template>
