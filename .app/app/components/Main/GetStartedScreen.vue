<script setup lang="ts">
import { nextTick, ref } from 'vue'

// Emit events for parent components
const emit = defineEmits<{
  takePhoto: []
  uploadImage: []
  goBack: []
  photoTaken: [imageData: string]
  imageUploaded: [imageData: string]
  analysisComplete: [result: any]
}>()

// Camera state
const showCamera = ref(false)
const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const stream = ref<MediaStream | null>(null)
const isCameraLoading = ref(false)
const cameraError = ref('')

// File upload state
const fileInputRef = ref<HTMLInputElement>()

// Analysis state
const isAnalyzing = ref(false)
const analysisError = ref('')
// Shared state to pass analysis result across pages (Nuxt useState)
const analysisText = useState<string>('lexiaAnalysisText', () => '')

// Convert base64 to File object
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',')

  // Validate the base64 format
  if (arr.length !== 2) {
    throw new Error('Invalid base64 format')
  }

  // Safely extract MIME type
  const mimeMatch = arr[0]?.match(/:(.*?);/)
  if (!mimeMatch || !mimeMatch[1]) {
    throw new Error('Unable to determine MIME type from base64 string')
  }

  const mime = mimeMatch[1]
  const base64Data = arr[1] // Now TypeScript knows this exists

  if (!base64Data) {
    throw new Error('No base64 data found')
  }

  const bstr = atob(base64Data)
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

// Send image to backend for analysis
async function analyzeImage(imageData: string, source: 'camera' | 'upload') {
  try {
    isAnalyzing.value = true
    analysisError.value = ''

    // Convert base64 to File
    const filename = `image_${Date.now()}.jpg`
    const file = base64ToFile(imageData, filename)
    const token = localStorage.getItem('authToken') || ''

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prompt', 'Extract text and share only the text in the image')

    // Send to backend API
    const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/images/analyze-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Add this header
      },
      body: formData,
    })

    console.log('Analysis result:', response)

    // Emit result to parent component
    emit('analysisComplete', {
      source,
      imageData,
      analysis: response,

    })

    // Persist analysis text for result page
    try {
      // Prefer response.analysis if present, else stringify response
      const text = (response as any)?.analysis ?? (typeof response === 'string' ? response : JSON.stringify(response))
      analysisText.value = text ?? ''
      // Also store in localStorage as a fallback for unexpected reloads
      if (typeof window !== 'undefined') {
        localStorage.setItem('lexiaAnalysisText', analysisText.value)
      }
    }
    catch (e) {
      console.warn('Unable to persist analysis text:', e)
    }

    // Navigate to result page
    await navigateTo({
      path: '/result',
    })
  }
  catch (error) {
    console.error('Error analyzing image:', error)
    analysisError.value = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.'
  }
  finally {
    isAnalyzing.value = false
  }
}

async function startCamera() {
  try {
    isCameraLoading.value = true
    cameraError.value = ''

    // Request camera access
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    })

    stream.value = mediaStream
    showCamera.value = true

    // Wait for DOM update
    await nextTick()

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      await videoRef.value.play()
    }
  }
  catch (error) {
    console.error('Error accessing camera:', error)
    cameraError.value = 'Unable to access camera. Please check permissions.'
  }
  finally {
    isCameraLoading.value = false
  }
}

async function capturePhoto() {
  if (!videoRef.value || !canvasRef.value)
    return

  const video = videoRef.value
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context)
    return

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  // Get image data as base64
  const imageData = canvas.toDataURL('image/jpeg', 0.8)

  // Emit the captured photo
  emit('photoTaken', imageData)

  // Close camera
  closeCamera()

  // Send to backend for analysis
  await analyzeImage(imageData, 'camera')
}

function closeCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  showCamera.value = false
  cameraError.value = ''
}

function handleTakePhoto() {
  startCamera()
}

function handleUploadImage() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const imageData = e.target?.result as string
      emit('imageUploaded', imageData)

      // Send to backend for analysis
      await analyzeImage(imageData, 'upload')
    }

    reader.readAsDataURL(file)
  }
  else {
    console.error('Please select a valid image file')
  }

  // Reset the input value so the same file can be selected again
  if (target) {
    target.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
    <div class="w-full">
      <div class="max-w-sm mx-auto px-6 py-8">
        <!-- Analysis Loading Overlay -->
        <div v-if="isAnalyzing" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div class="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Analyzing Image
              </h3>
              <p class="text-gray-600 text-sm">
                Please wait while we process your image...
              </p>
            </div>
          </div>
        </div>

        <!-- Camera View -->
        <div
          v-if="showCamera"
          class="fixed inset-0 h-[100dvh] overflow-hidden bg-black z-50 flex flex-col"
        >
          <!-- Camera Header -->
          <div
            class="flex items-center justify-between p-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] bg-black/50 text-white"
          >
            <button
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              @click="closeCamera"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 class="text-lg font-semibold">
              Take Photo
            </h2>
            <div class="w-10" />
          </div>

          <!-- Video Preview -->
          <div class="flex-1 relative pb-28">
            <video
              ref="videoRef"
              class="w-full h-full object-cover"
              playsinline
              muted
            />

            <!-- Overlay for better UX -->
            <div class="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none" />
          </div>

          <!-- Camera Controls -->
          <div
            class="fixed bottom-0 left-0 right-0 z-10 p-6 pb-[calc(env(safe-area-inset-bottom)+1rem)] bg-black/50"
          >
            <div class="flex items-center justify-center space-x-8">
              <!-- Cancel Button -->
              <button
                class="w-12 h-12 border-2 border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                @click="closeCamera"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Capture Button -->
              <button
                class="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                :disabled="isAnalyzing"
                @click="capturePhoto"
              >
                <div class="w-16 h-16 bg-white border-4 border-gray-300 rounded-full" />
              </button>

              <!-- Settings Button (placeholder) -->
              <button
                class="w-12 h-12 border-2 border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Hidden canvas for photo capture -->
          <canvas ref="canvasRef" class="hidden" />
        </div>

        <!-- Normal UI (when camera is not active) -->
        <div v-if="!showCamera">
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

          <!-- Camera Loading State -->
          <div v-if="isCameraLoading" class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
            <div class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <span class="text-gray-600">Starting camera...</span>
            </div>
          </div>

          <!-- Camera Error -->
          <div v-if="cameraError" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p class="text-red-700 text-sm">
              {{ cameraError }}
            </p>
          </div>

          <!-- Analysis Error -->
          <div v-if="analysisError" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-700 text-sm">
                {{ analysisError }}
              </p>
            </div>
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
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="isCameraLoading || isAnalyzing"
                @click="handleTakePhoto"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ isCameraLoading ? 'Starting Camera...' : 'Take Photo' }}</span>
              </button>

              <!-- Upload Image Button -->
              <button
                class="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 py-4 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isAnalyzing"
                @click="handleUploadImage"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Image</span>
              </button>

              <!-- Hidden file input -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              >
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
  </div>
</template>
