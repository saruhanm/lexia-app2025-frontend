<script setup lang="ts">
import { ref } from 'vue'

// Define interface for form data
interface CreateAccountForm {
  fullName: string
  email: string
  password: string
}

// Emit events for parent components
const emit = defineEmits<{
  createAccountSuccess: [form: CreateAccountForm]
  error: [message: string]
  switchToLogin: []
}>()

// Reactive state
const createAccountForm = ref({
  fullName: '',
  email: '',
  password: '',
})

// Methods
async function handleCreateAccount() {
  try {
    if (!createAccountForm.value.fullName || !createAccountForm.value.email || !createAccountForm.value.password) {
      emit('error', 'Please fill in all fields')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    if (!emailRegex.test(createAccountForm.value.email)) {
      emit('error', 'Please enter a valid email address')
      return
    }

    // Basic password validation
    if (createAccountForm.value.password.length < 6) {
      emit('error', 'Password must be at least 6 characters long')
      return
    }

    // Emit success event to parent
    emit('createAccountSuccess', createAccountForm.value)

    // Reset form
    createAccountForm.value = {
      fullName: '',
      email: '',
      password: '',
    }
  }
  catch (error) {
    console.error('Create account error:', error)
    emit('error', 'Account creation failed. Please try again.')
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

        <!-- Create Account Form -->
        <div class="w-full">
          <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Create Account
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Join Lexia to make reading easier with personalized formatting
              </p>
            </div>

            <form class="space-y-4" @submit.prevent="handleCreateAccount">
              <div class="space-y-4">
                <div>
                  <label for="full-name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    id="full-name"
                    v-model="createAccountForm.fullName"
                    type="text"
                    placeholder="Enter your full name"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    v-model="createAccountForm.email"
                    type="email"
                    placeholder="Enter your email"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    id="password"
                    v-model="createAccountForm.password"
                    type="password"
                    placeholder="Create a password"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                  <p class="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
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
              @click="emit('switchToLogin')"
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
