<script setup>
// Page metadata
useHead({
  title: 'Lexia - Enhanced Reading Experience',
  meta: [
    { name: 'description', content: 'Make reading easier with personalized text formatting' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// Handle authentication success
const handleLoginSuccess = (credentials) => {
  console.log('Login successful:', credentials)
  // TODO: Navigate to dashboard or main app
  // await navigateTo('/dashboard')
}

const handleSignupSuccess = (userData) => {
  console.log('Signup successful:', userData)
  // TODO: Navigate to onboarding or login
  // await navigateTo('/onboarding')
}

const handleGoogleLoginSuccess = (googleUser) => {
  console.log('Google login successful:', googleUser)
  // TODO: Process Google user data and navigate to dashboard
  // You can send this data to your backend to create/authenticate the user
  // await navigateTo('/dashboard')
}
</script>

<template>
  <div>
    <!-- Use your custom Lexia authentication -->
    <AuthLoginForm
      @login-success="handleLoginSuccess"
      @signup-success="handleSignupSuccess"
      @google-login-success="handleGoogleLoginSuccess"
    />
  </div>
</template>

