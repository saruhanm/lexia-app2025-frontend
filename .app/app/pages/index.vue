<script setup>
// Page metadata
useHead({
  title: 'Lexia - Enhanced Reading Experience',
  meta: [
    { name: 'description', content: 'Make reading easier with personalized text formatting' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})

// Handle authentication success
function handleLoginSuccess(credentials) {
  // console.log('Login successful:', credentials) // Debug logging removed
  // TODO: Navigate to dashboard or main app
  // await navigateTo('/dashboard')
}

function handleSignupSuccess(userData) {
  // console.log('Signup successful:', userData) // Debug logging removed
  // TODO: Navigate to onboarding or login
  // await navigateTo('/onboarding')
}

function handleGoogleLoginSuccess(googleUser) {
  // console.log('Google login successful:', googleUser) // Debug logging removed
  // TODO: Process Google user data and navigate to dashboard
  // You can send this data to your backend to create/authenticate the user
  // await navigateTo('/dashboard')
}

function handleError(message) {
  console.error('Auth error:', message)
  // TODO: Show error notification to user
  // alert(message) // Temporary - replace with proper notification system
  // For now, just log the error - replace with proper notification system later
}

function handleNotification(message) {
  // console.log('Notification:', message) // Debug logging removed
  // TODO: Show notification to user
  // alert(message) // Temporary - replace with proper notification system
  // For now, just ignore - replace with proper notification system later
}
</script>

<template>
  <div>
    <!-- Use your custom Lexia authentication -->
    <AuthLoginForm
      @login-success="handleLoginSuccess"
      @signup-success="handleSignupSuccess"
      @google-login-success="handleGoogleLoginSuccess"
      @error="handleError"
      @notification="handleNotification"
    />
  </div>
</template>
