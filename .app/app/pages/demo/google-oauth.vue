<!-- Demo page showing Google OAuth integration -->
<script setup>
// Page metadata
useHead({
  title: 'Google OAuth Demo - Lexia',
  meta: [
    { name: 'description', content: 'Test Google OAuth integration for Lexia authentication' },
  ],
})

// State
const user = ref(null)
const loading = ref(false)

// Use the Google Auth composable
const { loginWithGoogle } = useGoogleAuth()

// Methods
async function handleGoogleLogin() {
  loading.value = true

  try {
    const googleUser = await loginWithGoogle()
    if (googleUser) {
      user.value = googleUser
      console.log('Demo: Google user authenticated:', googleUser)
    }
  }
  catch (error) {
    console.error('Google login failed:', error)
    console.log('Google login failed. Please try again.')
  }
  finally {
    loading.value = false
  }
}

function logout() {
  user.value = null
  console.log('Demo: User logged out')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Google OAuth Demo
        </h1>
        <p class="text-gray-600">
          Test the Google authentication integration
        </p>
      </div>

      <!-- Authentication Status -->
      <div v-if="user" class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <img :src="user.picture" :alt="user.name" class="w-12 h-12 rounded-full">
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-green-900">
              Welcome, {{ user.name }}!
            </h3>
            <p class="text-green-700">
              {{ user.email }}
            </p>
          </div>
        </div>
        <div class="text-sm text-green-600">
          <p><strong>Provider:</strong> {{ user.provider }}</p>
          <p><strong>User ID:</strong> {{ user.id }}</p>
        </div>
        <button
          class="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">
          Try Google Login
        </h2>
        <p class="text-gray-600 mb-6">
          Click the button below to test the Google OAuth integration.
          This is currently in demo mode and will return mock user data.
        </p>

        <button
          :disabled="loading"
          class="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
          @click="handleGoogleLogin"
        >
          <svg v-if="!loading" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <div v-else class="w-5 h-5 mr-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          {{ loading ? 'Authenticating...' : 'Continue with Google' }}
        </button>
      </div>

      <!-- Integration Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-blue-900 mb-3">
          Integration Details
        </h3>
        <div class="text-sm text-blue-700 space-y-2">
          <p><strong>Current Mode:</strong> Demo (returns mock data)</p>
          <p><strong>OAuth Flow:</strong> Popup-based authentication</p>
          <p><strong>Configuration:</strong> Ready for production with proper Google Client ID</p>
          <p><strong>Composable:</strong> <code>useGoogleAuth()</code> available</p>
        </div>

        <div class="mt-4">
          <a
            href="/docs/GOOGLE_OAUTH_SETUP.md"
            target="_blank"
            class="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            📚 View Setup Documentation
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
