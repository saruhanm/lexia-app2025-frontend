<script setup lang="ts">
// Emit events for parent components
const emit = defineEmits<{
  takePhoto: []
  uploadImage: []
  goBack: []
}>()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
    <div class="w-full">
      <div class="max-w-sm mx-auto px-6 py-8">
        <!-- Header with Back Button -->
        <div class="flex items-center mb-6">
          <button
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            @click="navigateTo('/main')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Get Started
          </h1>
        </div>

        <!-- Main Action Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Capture or Upload Text
            </h3>
            <p class="text-gray-600 text-sm">
              Take a photo of any text or upload an existing image to get started with personalized formatting.
            </p>
          </div>

          <div class="space-y-3">
            <!-- Take Photo Button -->
            <button
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2"
              @click="emit('takePhoto')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Take Photo</span>
            </button>

            <!-- Upload Image Button -->
            <button
              class="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 py-4 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              @click="emit('uploadImage')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        <!-- Tips Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-700 uppercase tracking-wide">
            Tips for best results
          </h4>
          <div class="space-y-3">
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Good lighting
                </p>
                <p class="text-xs text-gray-600">
                  Make sure the text is well-lit and clearly visible
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Hold steady
                </p>
                <p class="text-xs text-gray-600">
                  Keep your phone steady for sharp, clear text
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">
                  Fill the frame
                </p>
                <p class="text-xs text-gray-600">
                  Get close enough so the text fills most of the screen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
