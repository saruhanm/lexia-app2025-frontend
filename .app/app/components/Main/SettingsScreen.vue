<script setup lang="ts">
import { ref } from 'vue'

// Emit events for parent components
const emit = defineEmits<{
  goBack: []
  saveSettings: [settings: any]
}>()

// Settings state
const settings = ref({
  fontName: 'Arial',
  fontColor: '#000000',
  fontSize: 14,
  backgroundColor: '#ffffff',
  letterSpacing: 2,
  lineSpacing: 14,
})

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

// Handle save
function handleSave() {
  emit('saveSettings', settings.value)
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

        <!-- Preview Box -->
        <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 mb-6">
          <p
            class="text-center leading-relaxed"
            :style="{
              fontFamily: settings.fontName,
              color: settings.fontColor,
              fontSize: `${settings.fontSize}px`,
              backgroundColor: settings.backgroundColor,
              letterSpacing: `${settings.letterSpacing}px`,
              lineHeight: settings.lineSpacing / 10,
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
                v-model="settings.fontName"
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
                    v-model="settings.fontColor"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 w-20"
                  >
                  <div
                    class="w-8 h-8 rounded-full border-2 border-gray-300"
                    :style="{ backgroundColor: settings.fontColor }"
                  />
                </div>
              </div>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="color in fontColorPalette"
                  :key="color"
                  class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                  :class="settings.fontColor === color ? 'border-blue-500' : 'border-gray-300'"
                  :style="{ backgroundColor: color }"
                  @click="settings.fontColor = color"
                />
              </div>
            </div>

            <!-- Font Size -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Font Size</label>
              <div class="flex items-center space-x-3">
                <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  @click="decrement('fontSize')"
                >
                  -
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ settings.fontSize }}</span>
                <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  @click="increment('fontSize')"
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
                    v-model="settings.backgroundColor"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 w-20"
                  >
                  <div
                    class="w-8 h-8 rounded-full border-2 border-gray-300"
                    :style="{ backgroundColor: settings.backgroundColor }"
                  />
                </div>
              </div>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="color in backgroundColorPalette"
                  :key="color"
                  class="w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform"
                  :class="settings.backgroundColor === color ? 'border-blue-500' : 'border-gray-300'"
                  :style="{ backgroundColor: color }"
                  @click="settings.backgroundColor = color"
                />
              </div>
            </div>

            <!-- Letter Spacing -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Letter Spacing</label>
              <div class="flex items-center space-x-3">
                <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  @click="decrement('letterSpacing')"
                >
                  -
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ settings.letterSpacing }}</span>
                <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  @click="increment('letterSpacing')"
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
                  @click="decrement('lineSpacing')"
                >
                  -
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ settings.lineSpacing }}</span>
                <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  @click="increment('lineSpacing')"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <button
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          @click="handleSave"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>
