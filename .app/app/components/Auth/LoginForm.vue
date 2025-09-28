<script setup lang="ts">
import { ref } from 'vue'

// Define interfaces for form data
interface LoginForm {
  username: string
  password: string
  token?: string
}

interface AuthResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
}

interface SignupForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Emit events for parent components
const emit = defineEmits<{
  loginSuccess: [form: LoginForm]
  signupSuccess: [form: SignupForm]
  error: [message: string]
  notification: [message: string]
  redirectToMain: []
}>()

// Reactive state
const showSignup = ref(false)
const isLoading = ref(false)

const loginForm = ref({
  username: '',
  password: '',
})

const signupForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Methods
async function handleLogin() {
  console.log('handleLogin called') // Debug log

  if (isLoading.value) {
    console.log('Already loading, returning') // Debug log
    return
  }

  try {
    isLoading.value = true
    console.log('Starting login process') // Debug log

    if (!loginForm.value.username || !loginForm.value.password) {
      console.log('Validation failed - missing fields') // Debug log
      emit('error', 'Please fill in all fields')
      return
    }

    console.log('Form data:', { username: loginForm.value.username, password: '***' }) // Debug log

    // For form-urlencoded data, we should use URLSearchParams instead of FormData
    const formData = new URLSearchParams()
    formData.append('grant_type', 'password')
    formData.append('username', loginForm.value.username)
    formData.append('password', loginForm.value.password)

    console.log('Making API call to /auth/login') // Debug log

    // Get the API base URL from runtime config
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    const loginUrl = `${apiBaseUrl}/auth/login`

    console.log('Making API call to:', loginUrl) // Debug log

    // Make API call to login endpoint
    const response = await $fetch<AuthResponse>(loginUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    console.log('API response:', response) // Debug log

    // Store authentication token if provided
    if (response?.access_token) {
      console.log('Login successful, token received')

      // Store token in localStorage for persistence
      localStorage.setItem('authToken', response.access_token)

      // Or use Nuxt cookie (recommended)
      const authToken = useCookie('authToken', {
        maxAge: response.expires_in || 60 * 60 * 24 * 7, // 7 days default
      })
      authToken.value = response.access_token
    }

    // Create login form data with token
    const loginData: LoginForm = {
      ...loginForm.value,
      token: response?.access_token,
    }

    // If login is successful, emit success events
    emit('loginSuccess', loginData)
    emit('redirectToMain')

    // Show success notification
    emit('notification', 'Login successful! Redirecting...')

    // Navigate to main screen - ADD THIS LINE
    await navigateTo('/main')

    // Reset form
    loginForm.value = {
      username: '',
      password: '',
    }

    console.log('Successfully navigated to main screen')
  }
  catch (error: any) {
    console.error('Login error:', error)
    console.log('Error details:', { status: error?.status, message: error?.message, data: error?.data }) // Debug log

    // Handle different types of errors
    if (error?.status === 401 || error?.status === 400) {
      emit('error', 'Invalid username or password')
    }
    else if (error?.status >= 500) {
      emit('error', 'Server error. Please try again later.')
    }
    else {
      emit('error', 'Login failed. Please check your credentials and try again.')
    }
  }
  finally {
    console.log('Login process finished, setting loading to false') // Debug log
    isLoading.value = false
  }
}

async function handleSignup() {
  try {
    // console.log('Signup attempt:', signupForm.value) // Debug logging removed

    if (!signupForm.value.username || !signupForm.value.email
      || !signupForm.value.password || !signupForm.value.confirmPassword) {
      emit('error', 'Please fill in all fields')
      return
    }

    if (signupForm.value.password !== signupForm.value.confirmPassword) {
      emit('error', 'Passwords do not match')
      return
    }

    // Emit success event to parent
    emit('signupSuccess', signupForm.value)

    // Reset form and switch to login
    signupForm.value = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    showSignup.value = false
  }
  catch (error) {
    console.error('Signup error:', error)
    emit('error', 'Signup failed. Please try again.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center">
    <!-- Mobile-like container that stays centered on large screens -->
    <div class="w-full max-w-sm mx-auto flex flex-col">
      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <!-- Logo/Title Section -->
        <div class="text-center mb-8">
          <div class="mb-6">
            <h1 class="text-2xl font-light mb-2 text-gray-700">
              Welcome to
            </h1>
            <h2 class="text-4xl font-bold tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LEXIA
            </h2>
          </div>
          <div class="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto" />
        </div>

        <!-- Auth Forms Container -->
        <div class="w-full">
          <!-- Login Form -->
          <div v-if="!showSignup" class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Sign In
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Continue your reading journey with personalized text formatting
              </p>
            </div>

            <form class="space-y-4" @submit.prevent="handleLogin">
              <div class="space-y-4">
                <div>
                  <label for="login-username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    id="login-username"
                    v-model="loginForm.username"
                    type="text"
                    placeholder="Enter your username"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    id="login-password"
                    v-model="loginForm.password"
                    type="password"
                    placeholder="Enter your password"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
              </div>

              <div class="flex items-center justify-between text-sm pt-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <span class="text-gray-600">Remember me</span>
                </label>
                <button type="button" class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:hover:scale-100"
              >
                <span v-if="isLoading" class="flex items-center justify-center space-x-2">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </span>
                <span v-else>Sign In</span>
              </button>
            </form>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">New to Lexia?</span>
              </div>
            </div>

            <button
              class="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 hover:bg-blue-50 rounded-xl transition-all duration-200"
              @click="showSignup = true"
            >
              Create an account
            </button>
          </div>

          <!-- Signup Form -->
          <div v-else class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Create Account
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Join Lexia to make reading easier with personalized formatting
              </p>
            </div>

            <form class="space-y-4" @submit.prevent="handleSignup">
              <div class="space-y-4">
                <div>
                  <label for="signup-username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    id="signup-username"
                    v-model="signupForm.username"
                    type="text"
                    placeholder="Choose a username"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    id="signup-email"
                    v-model="signupForm.email"
                    type="email"
                    placeholder="Enter your email"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    id="signup-password"
                    v-model="signupForm.password"
                    type="password"
                    placeholder="Create a password"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="signup-confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    id="signup-confirm-password"
                    v-model="signupForm.confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
              </div>

              <div class="flex items-start space-x-2 pt-2">
                <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1" required>
                <label class="text-sm text-gray-600 leading-relaxed">
                  I agree to the <button type="button" class="text-blue-600 hover:underline">Terms of Service</button> and <button type="button" class="text-blue-600 hover:underline">Privacy Policy</button>
                </label>
              </div>

              <button
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              >
                Create Account
              </button>
            </form>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <button
              class="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 hover:bg-blue-50 rounded-xl transition-all duration-200"
              @click="showSignup = false"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
