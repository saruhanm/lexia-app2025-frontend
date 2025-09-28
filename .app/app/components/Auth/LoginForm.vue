<script setup lang="ts">
import type { GoogleUser } from '../../composables/useGoogleAuth'
import { ref } from 'vue'
import { useGoogleAuth } from '../../composables/useGoogleAuth'
// Define interfaces for form data
interface LoginForm {
  username: string
  password: string
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
  googleLoginSuccess: [data: GoogleUser]
  error: [message: string]
  notification: [message: string]
}>()

// Reactive state
const showSignup = ref(false)

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

// Use Google Auth composable
const { loginWithGoogle } = useGoogleAuth()

// Methods
async function handleLogin() {
  try {
    // console.log('Login attempt:', loginForm.value) // Debug logging removed

    if (!loginForm.value.username || !loginForm.value.password) {
      emit('error', 'Please fill in all fields')
      return
    }

    // Emit success event to parent
    emit('loginSuccess', loginForm.value)

    // Reset form
    loginForm.value = {
      username: '',
      password: '',
    }
  }
  catch (error) {
    console.error('Login error:', error)
    emit('error', 'Login failed. Please try again.')
  }
}

async function handleGoogleLogin() {
  try {
    // console.log('Starting Google login...') // Debug logging removed
    const googleUser = await loginWithGoogle()

    if (googleUser) {
      // console.log('Google login successful:', googleUser) // Debug logging removed
      emit('googleLoginSuccess', googleUser)
    }
  }
  catch (error) {
    console.error('Google login error:', error)
    emit('error', 'Google login failed. Please try again.')
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
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <!-- Google Sign In Button -->
            <button
              type="button"
              class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="handleGoogleLogin"
            >
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

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
                <span class="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <!-- Google Sign Up Button -->
            <button
              type="button"
              class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="handleGoogleLogin"
            >
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

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

        <!-- Trust indicators -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500 mb-2">
            Trusted by thousands of readers worldwide
          </p>
          <div class="flex items-center justify-center space-x-4">
            <div class="flex items-center space-x-1 text-yellow-400">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs text-gray-600">4.9/5</span>
            </div>
            <div class="text-xs text-gray-500">
              •
            </div>
            <div class="text-xs text-gray-600">
              50k+ downloads
            </div>
            <div class="text-xs text-gray-500">
              •
            </div>
            <div class="text-xs text-gray-600">
              Privacy focused
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
