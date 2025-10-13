<script setup lang="ts">
// Read analysis text from Nuxt state with a localStorage fallback
const analysisText = useState<string>('lexiaAnalysisText', () => '')
if (process.client && !analysisText.value) {
  const cached = localStorage.getItem('lexiaAnalysisText')
  if (cached) {
    analysisText.value = cached
  }
}
</script>

<template>
  <div>
    <MainFormattedText :text="analysisText" />
  </div>
</template>
