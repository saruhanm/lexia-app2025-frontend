<script setup lang="ts">
import { ref } from 'vue'

// Define interface for form data
interface CreateAccountForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
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
  confirmPassword: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

// Methods
async function handleCreateAccount(event?: Event) {
  if (isLoading.value) {
    return
  }

  event?.preventDefault()
  event?.stopPropagation()

  try {
    isLoading.value = true
    errorMessage.value = '' // Clear previous errors

    // Validate all fields are filled
    if (!createAccountForm.value.fullName?.trim() || !createAccountForm.value.email?.trim() || !createAccountForm.value.password?.trim()) {
      errorMessage.value = 'Please fill in all fields'
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    const emailValid = emailRegex.test(createAccountForm.value.email.trim())

    if (!emailValid) {
      errorMessage.value = 'Please enter a valid email address'
      return
    }

    // Basic password validation
    if (createAccountForm.value.password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters long'
      return
    }

    // Check if passwords match
    if (createAccountForm.value.password !== createAccountForm.value.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    // Check if terms checkbox is checked
    const termsCheckbox = document.querySelector('#terms-checkbox') as HTMLInputElement

    if (!termsCheckbox?.checked) {
      errorMessage.value = 'Please agree to the Terms of Service and Privacy Policy'
      return
    }

    // Store form data before API call
    const formData = {
      fullName: createAccountForm.value.fullName.trim(),
      email: createAccountForm.value.email.trim(),
      password: createAccountForm.value.password,
      confirmPassword: createAccountForm.value.confirmPassword,
    }
    console.log('Form Data:', formData)
    // Make API call using Nuxt's $fetch

    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    const registerUrl = `${apiBaseUrl}/auth/register`
    const data = await $fetch(registerUrl, {
      method: 'POST',
      credentials: 'include', // ensure Set-Cookie from cross-origin is accepted
      body: {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      },
    })

    // Only emit success if API call was successful
    if (data) {
      console.log('Account created successfully:', data)
      // Reset form after successful creation
      createAccountForm.value = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

      // Reset checkbox
      if (termsCheckbox) {
        termsCheckbox.checked = false
      }

      // Emit success event with the original form data (not the reset values)
      emit('createAccountSuccess', formData)
      navigateTo('/main')
    }
  }
  catch (error: any) {
    // Handle different types of errors
    if (error.status === 400) {
      errorMessage.value = error.data?.message || 'Invalid registration data. Please check your information.'
    }
    else if (error.status === 409) {
      errorMessage.value = 'An account with this email already exists.'
    }
    else if (error.status === 422) {
      errorMessage.value = 'Please check your input data and try again.'
    }
    else if (error.status >= 500) {
      errorMessage.value = 'Server error. Please try again later.'
    }
    else {
      errorMessage.value = error.data?.message || 'Account creation failed. Please try again.'
    }

    emit('error', errorMessage.value)
  }
  finally {
    isLoading.value = false
  }
}

// Clear error when user starts typing
function clearError() {
  if (errorMessage.value) {
    errorMessage.value = ''
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
                Join Lexia to make reading easier with personalized
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-red-700">
                  {{ errorMessage }}
                </p>
              </div>
            </div>

            <form
              class="space-y-4"
              novalidate
              @submit.prevent.stop="handleCreateAccount($event)"
            >
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
                    :disabled="isLoading"
                    @input="clearError"
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
                    :disabled="isLoading"
                    @input="clearError"
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
                    :disabled="isLoading"
                    @input="clearError"
                  >
                  <p class="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
                <div>
                  <label for="signup-confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    id="signup-confirm-password"
                    v-model="createAccountForm.confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    required
                  >
                </div>
              </div>

              <div class="flex items-start space-x-2 pt-2">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  :disabled="isLoading"
                  required
                >
                <label for="terms-checkbox" class="text-sm text-gray-600 leading-relaxed">
                  I agree to the <button type="button" class="text-blue-600 hover:underline">Terms of Service</button> and <button type="button" class="text-blue-600 hover:underline">Privacy Policy</button>
                </label>
              </div>

              <button
                type="button"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                @click="handleCreateAccount($event)"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
                <span v-else>Create Account</span>
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
              @click="navigateTo('/')"
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
