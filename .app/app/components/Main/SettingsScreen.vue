<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Emit events for parent components
const emit = defineEmits<{
  goBack: []
  saveSettings: [settings: any]
}>()
interface SettResponse {
  font_name: string
  font_color: string
  font_size: number
  background_color: string
  letter_spacing: number
  line_spacing: number
  custom_issue: string
}
// Settings state
const settings = ref({
  font_name: 'Arial',
  font_color: '#000000',
  font_size: 14,
  background_color: '#ffffff',
  letter_spacing: 2,
  line_spacing: 14,
})

// Custom lexia issue input
const customIssue = ref('')

// Loading states
const isSaving = ref(false)
const isLoading = ref(true)
const loadError = ref('')

// Font options
const fontOptions = [
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
]

// Color palettes
const fontColorPalette = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ffa500',
]

const backgroundColorPalette = [
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#d0d0d0',
  '#000000',
  '#ffe4e1',
  '#e1f5fe',
  '#e8f5e8',
  '#fff9c4',
  '#f3e5f5',
  '#fce4ec',
  '#fff3e0',
]

// Load user settings on component mount
onMounted(async () => {
  await loadUserSettings()
})

async function loadUserSettings() {
  try {
    isLoading.value = true
    loadError.value = ''

    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.warn('No user ID found in localStorage')
      return
    }

    const response = await $fetch<SettResponse>(`${useRuntimeConfig().public.apiBaseUrl}/api/user-settings/${userId}`, {
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
      }
      customIssue.value = response.custom_issue || ''
    }
  }
  catch (error) {
    console.error('Error loading user settings:', error)
    loadError.value = 'Failed to load your settings. Using default values.'
    // Continue with default settings
  }
  finally {
    isLoading.value = false
  }
}

async function handleSave() {
  try {
    isSaving.value = true

    const userId = localStorage.getItem('userId')
    if (!userId) {
      throw new Error('No user ID found')
    }

    const settingsPayload = {
      font_name: settings.value.font_name,
      font_color: settings.value.font_color,
      font_size: settings.value.font_size,
      background_color: settings.value.background_color,
      letter_spacing: settings.value.letter_spacing,
      line_spacing: settings.value.line_spacing,
      custom_issue: customIssue.value,
    }

    const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/api/user-settings/${userId}`, {
      method: 'PUT',
      body: settingsPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Emit success to parent component
    emit('saveSettings', response)

    // Optional: Show success message
    console.log('Settings saved successfully:', response)
  }
  catch (error) {
    console.error('Error saving settings:', error)
    // Handle error (show toast, alert, etc.)
  }
  finally {
    isSaving.value = false
  }
}

// Helper functions for increment/decrement
function increment(field: keyof typeof settings.value) {
  if (typeof settings.value[field] === 'number') {
    (settings.value[field] as number)++
  }
}

function decrement(field: keyof typeof settings.value) {
  if (typeof settings.value[field] === 'number' && settings.value[field] > 1) {
    (settings.value[field] as number)--
  }
}
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
            Settings
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
          <div class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <span class="text-gray-600">Loading your settings...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="loadError" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p class="text-red-700 text-sm">
            {{ loadError }}
          </p>
        </div>

        <!-- Settings Content (show when not loading) -->
        <div v-if="!isLoading">
          <!-- Preview Box -->
          <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
            <p
              class="text-center leading-relaxed"
              :style="{
                fontFamily: settings.font_name,
                color: settings.font_color,
                fontSize: `${settings.font_size}px`,
                backgroundColor: settings.background_color,
                letterSpacing: `${settings.letter_spacing}px`,
                lineHeight: settings.line_spacing / 10,
              }"
            >
              Lexia makes reading easier by reformatting text in a way that works best for you. Just snap photo, and we'll do the rest.
            </p>
          </div>

          <!-- Settings Controls -->
          <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
            <div class="space-y-6">
              <!-- Font -->
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Font</label>
                <select
                  v-model="settings.font_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                >
                  <option v-for="font in fontOptions" :key="font" :value="font">
                    {{ font }}
                  </option>
                </select>
              </div>

              <!-- Font Color -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700">Font Color</label>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="settings.font_color"
                      type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 w-20"
                    >
                    <div
                      class="w-8 h-8 rounded-full border-2 border-gray-300"
                      :style="{ backgroundColor: settings.font_color }"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="color in fontColorPalette"
                    :key="color"
                    class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                    :class="settings.font_color === color ? 'border-blue-500' : 'border-gray-300'"
                    :style="{ backgroundColor: color }"
                    @click="settings.font_color = color"
                  />
                </div>
              </div>

              <!-- Font Size -->
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Font Size</label>
                <div class="flex items-center space-x-3">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="decrement('font_size')"
                  >
                    -
                  </button>
                  <span class="text-sm font-medium w-8 text-center">{{ settings.font_size }}</span>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="increment('font_size')"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Background -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700">Background</label>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="settings.background_color"
                      type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 w-20"
                    >
                    <div
                      class="w-8 h-8 rounded-full border-2 border-gray-300"
                      :style="{ backgroundColor: settings.background_color }"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="color in backgroundColorPalette"
                    :key="color"
                    class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                    :class="settings.background_color === color ? 'border-blue-500' : 'border-gray-300'"
                    :style="{ backgroundColor: color }"
                    @click="settings.background_color = color"
                  />
                </div>
              </div>

              <!-- Letter Spacing -->
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Letter Spacing</label>
                <div class="flex items-center space-x-3">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="decrement('letter_spacing')"
                  >
                    -
                  </button>
                  <span class="text-sm font-medium w-8 text-center">{{ settings.letter_spacing }}</span>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="increment('letter_spacing')"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Line Spacing -->
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Line Spacing</label>
                <div class="flex items-center space-x-3">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="decrement('line_spacing')"
                  >
                    -
                  </button>
                  <span class="text-sm font-medium w-8 text-center">{{ settings.line_spacing }}</span>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    @click="increment('line_spacing')"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Issue Input -->
          <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
            <div class="space-y-3">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <label class="text-sm font-medium text-gray-700">
                  AI-Powered Personalization
                </label>
              </div>
              <textarea
                v-model="customIssue"
                placeholder="Describe your reading challenges (e.g., 'I struggle with small text', 'Words blend together', 'I lose my place while reading')..."
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 resize-none"
                rows="4"
              />
              <div class="bg-blue-50 rounded-lg p-3">
                <p class="text-xs text-blue-700 font-medium">
                  🤖 Our AI will analyze your description and create personalized formatting solutions specifically for you
                </p>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="isSaving"
            @click="handleSave"
          >
            {{ isSaving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
