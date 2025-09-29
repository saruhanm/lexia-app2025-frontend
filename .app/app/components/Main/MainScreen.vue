<script setup lang="ts">
import { ref } from 'vue'

// Emit events for parent components
const emit = defineEmits<{
  getStarted: []
  openSettings: []
  openAccount: []
}>()

// Function to handle get started click
function handleGetStarted() {
  console.log('Get started clicked!')
  navigateTo('/getStarted')
  emit('getStarted')
}

// Reactive state for user info (can be passed as props later)
const userInfo = ref({
  fullName: 'John Doe', // This would come from props or store
})

function handleLogout() {
  console.log('Logout clicked!')

  try {
    // Clear the auth cookie
    const authCookie = useCookie('authToken')
    authCookie.value = null

    // Clear localStorage token
    if (process.client) {
      localStorage.removeItem('authToken')
    }

    console.log('Tokens cleared successfully')

    // Navigate back to login page
    navigateTo('/')

    console.log('Redirected to login page')
  }
  catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
    <div class="w-full">
      <!-- Banner Section -->
      <div class="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div class="max-w-sm mx-auto px-6 py-8">
          <!-- Logo -->
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              LEXIA
            </h1>
          </div>

          <!-- Welcome Message -->
          <div class="text-center mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">
              Welcome to Lexia
            </h2>
            <p class="text-gray-600 text-sm leading-relaxed">
              Lexia makes reading easier by reformatting text in a way that works best for you. Just snap photo, and we'll do the rest.
            </p>
          </div>

          <!-- Menu Buttons -->
          <div class="space-y-3">
            <button
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              @click="handleGetStarted"
            >
              Get started
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button
                class="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                @click="navigateTo('/settings')"
              >
                Settings
              </button>
              <button
                class="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                @click="handleLogout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-sm mx-auto px-6 py-6">
        <!-- Features Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-700 uppercase tracking-wide">
            How it works
          </h4>
          <div class="space-y-3">
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                1
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Capture text
                </p>
                <p class="text-xs text-gray-600">
                  Take a photo or upload an image with text
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                2
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  AI processing
                </p>
                <p class="text-xs text-gray-600">
                  Our AI extracts and formats the text
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                3
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Read easier
                </p>
                <p class="text-xs text-gray-600">
                  Enjoy text formatted for better readability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
