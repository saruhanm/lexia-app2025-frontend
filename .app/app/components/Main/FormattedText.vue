<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

// Props
interface Props {
  text?: string
  userId?: string | number
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Lexia makes reading easier by reformatting text in a way that works best for you. Just snap a photo, and we\'ll do the rest. This text preview shows how your content will appear with your personalized formatting settings.',
  showControls: false,
})

// Settings interface matching your existing structure
interface SettResponse {
  font_name: string
  font_color: string
  font_size: number
  background_color: string
  letter_spacing: number
  line_spacing: number
  custom_issue: string
}

// State
const settings = ref<SettResponse>({
  font_name: 'Arial',
  font_color: '#000000',
  font_size: 14,
  background_color: '#ffffff',
  letter_spacing: 2,
  line_spacing: 14,
  custom_issue: '',
})

const displayText = ref(props.text)
const isLoading = ref(false)
const error = ref('')

// Computed styles for text display
const textDisplayStyles = computed(() => ({
  fontFamily: settings.value.font_name,
  color: settings.value.font_color,
  fontSize: `${settings.value.font_size}px`,
  backgroundColor: settings.value.background_color,
  letterSpacing: `${settings.value.letter_spacing}px`,
  lineHeight: settings.value.line_spacing / 10, // Convert to line-height ratio
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  minHeight: '200px',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word' as const,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}))

// Text statistics
const textStats = computed(() => {
  const text = displayText.value
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.split(/\s+/).filter(word => word.length > 0).length,
    sentences: text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
    paragraphs: text.split('\n\n').filter(paragraph => paragraph.trim().length > 0).length,
    lines: text.split('\n').length,
    readingTime: Math.ceil(text.split(/\s+/).filter(word => word.length > 0).length / 200), // 200 words per minute
  }
})

// API Functions
async function loadUserSettings() {
  try {
    isLoading.value = true
    error.value = '' // Clear previous errors

    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.warn('No user ID found in localStorage')
      return
    }

    const config = useRuntimeConfig()
    const response = await $fetch<SettResponse>(`${config.public.apiBaseUrl}/api/user-settings/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Update settings with user's current settings
    if (response) {
      settings.value = {
        font_name: response.font_name || settings.value.font_name,
        font_color: response.font_color || settings.value.font_color,
        font_size: response.font_size || settings.value.font_size,
        background_color: response.background_color || settings.value.background_color,
        letter_spacing: response.letter_spacing || settings.value.letter_spacing,
        line_spacing: response.line_spacing || settings.value.line_spacing,
        custom_issue: response.custom_issue || settings.value.custom_issue || '',
      }
    }
  }
  catch (err: any) {
    console.error('Error loading user settings:', err)
    error.value = err.message || 'Failed to load user settings'
    // Continue with default settings
  }
  finally {
    isLoading.value = false
  }
}

// Utility functions
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(displayText.value)
    console.log('Text copied to clipboard')
    // You can add a toast notification here
  }
  catch (err: any) {
    console.error('Failed to copy text:', err)
  }
}

function downloadText() {
  const blob = new Blob([displayText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `formatted-text-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(async () => {
  await loadUserSettings()

  if (props.text) {
    displayText.value = props.text
  }
})

// Watch for prop changes
watch(() => props.text, (newText) => {
  if (newText) {
    displayText.value = newText
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-dvh">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p class="text-gray-600">
          Loading your formatted text...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-dvh">
      <div class="text-center max-w-md mx-auto p-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p class="text-gray-600 mb-4">
          {{ error }}
        </p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          @click="loadUserSettings"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="w-full">
      <div class="max-w-sm mx-auto px-6 py-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Formatted Text Preview
            </h1>
            <p class="text-gray-600">
              {{ textStats.words }} words • {{ textStats.readingTime }} min read
            </p>
          </div>

          <!-- Actions: Back always, others optional -->
          <div class="flex items-center">
            <button
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              title="Back to main"
              aria-label="Back to main"
              @click="navigateTo('/main')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div v-if="props.showControls" class="flex items-center space-x-2">
              <button
                class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy text"
                @click="copyToClipboard"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download text"
                @click="downloadText"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Text Display Area -->
        <div class="grid grid-cols-1 gap-4 md:gap-6 flex-1">
          <!-- Main Text Content -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div :style="textDisplayStyles" class="min-h-[40dvh] md:min-h-[400px] max-h-[70dvh] overflow-auto overscroll-contain break-words">
                {{ displayText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for all formatting changes */
* {
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
