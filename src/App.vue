<script setup lang="ts">
import RegisterCard from './components/RegisterCard.vue'
import { decoders } from './decoder'
import { ref, computed, watch } from 'vue'

const hexInput = ref('')
const errorMessage = ref('')

// Read initial selected state from localStorage, default to 'general.general' if not available
const getInitialSelectedDecoders = (): Set<string> => {
  try {
    const saved = localStorage.getItem('rvdecoder-selectedDecoders')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return new Set(parsed)
      }
    }
  } catch (error) {
    console.warn('Failed to load selected decoders from localStorage:', error)
  }
  return new Set(['general.general'])
}

// Selected decoders
const selectedDecoders = ref<Set<string>>(getInitialSelectedDecoders())

// Watch selectedDecoders changes, save to localStorage
watch(
  selectedDecoders,
  (newDecoders) => {
    try {
      const decodersArray = Array.from(newDecoders)
      localStorage.setItem('rvdecoder-selectedDecoders', JSON.stringify(decodersArray))
    } catch (error) {
      console.warn('Failed to save selected decoders to localStorage:', error)
    }
  },
  { deep: true },
)

// Filter decoder configurations based on selected state
const filteredDecoderConfigs = computed(() => {
  const result = []
  for (const category of decoders) {
    for (const item of category.items) {
      const key = `${category.name}.${item.name}`
      if (selectedDecoders.value.has(key)) {
        result.push({
          ...item,
          category: category.name,
          key,
        })
      }
    }
  }
  return result
})

// Toggle decoder selection state
const toggleDecoder = (decoderKey: string) => {
  if (selectedDecoders.value.has(decoderKey)) {
    selectedDecoders.value.delete(decoderKey)
  } else {
    selectedDecoders.value.add(decoderKey)
  }
  // Trigger reactive update
  selectedDecoders.value = new Set(selectedDecoders.value)
}

// Handle input change
const handleInputChange = () => {
  const originalInput = hexInput.value
  // Remove possible 0x prefix
  const withoutPrefix = originalInput.toLowerCase().replace(/^0x/, '')
  const hex = withoutPrefix.replace(/[^0-9a-f]/g, '')

  // If 0x prefix was removed, update input box
  if (originalInput.toLowerCase().startsWith('0x')) {
    hexInput.value = withoutPrefix
    return
  }

  // Check if contains non-hexadecimal characters
  if (withoutPrefix && withoutPrefix !== hex) {
    errorMessage.value = 'Only hexadecimal characters allowed (0-9, A-F)'
    return
  }

  // Check if exceeds 64-bit range
  if (hex) {
    try {
      const num = BigInt('0x' + hex)
      const binStr = num.toString(2)
      if (binStr.length > 64) {
        errorMessage.value = 'Value exceeds 64-bit range'
        return
      }
    } catch {
      errorMessage.value = 'Invalid hexadecimal number'
      return
    }
  }

  // Clear error state
  errorMessage.value = ''
}

// Handle bit toggle
const handleToggleBit = (bitIndex: number) => {
  const hex = hexInput.value.replace(/[^0-9a-fA-F]/g, '')

  // If no input, assume 0
  const num = hex ? BigInt('0x' + hex) : BigInt(0)
  const binStr = num.toString(2).padStart(64, '0')
  const binArray = binStr.split('').map((bit) => parseInt(bit))

  // Toggle specified bit
  binArray[63 - bitIndex] = binArray[63 - bitIndex] === 0 ? 1 : 0

  // Convert back to hexadecimal
  const newBinStr = binArray.join('')
  const newNum = BigInt('0b' + newBinStr)
  hexInput.value = newNum.toString(16).toUpperCase().padStart(16, '0')
}
</script>

<template>
  <div class="rvdecoder-container">
    <header class="page-header">
      <h1>RISC-V Decoder</h1>
    </header>
    <div class="main-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Decode mode</h3>
        </div>
        <div class="checkbox-list">
          <div v-for="category in decoders" :key="category.name" class="category-group">
            <div class="category-header">
              <h4>{{ category.name }}</h4>
            </div>
            <label
              v-for="item in category.items"
              :key="`${category.name}.${item.name}`"
              class="checkbox-item"
              :class="{ selected: selectedDecoders.has(`${category.name}.${item.name}`) }"
            >
              <input
                type="checkbox"
                :checked="selectedDecoders.has(`${category.name}.${item.name}`)"
                @change="toggleDecoder(`${category.name}.${item.name}`)"
              />
              <span class="checkbox-label">{{ item.name }}</span>
            </label>
          </div>
        </div>
      </aside>
      <div class="content-area">
        <div class="global-input">
          <div class="input-container">
            <div class="input-wrapper" :class="{ error: errorMessage }">
              <span class="hex-prefix">0x</span>
              <input
                v-model="hexInput"
                @input="handleInputChange"
                class="hex-input"
                placeholder="0000000000000000"
              />
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
        </div>
        <main class="page-content">
          <RegisterCard
            v-for="config in filteredDecoderConfigs"
            :key="config.key"
            :name="config.name"
            :fields="config.fields"
            :hex-value="hexInput"
            @toggle-bit="handleToggleBit"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rvdecoder-container {
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}
.page-header {
  text-align: center;
  padding: 24px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}
.main-layout {
  display: flex;
  flex: 1;
  gap: 0;
}
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
}
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}
.sidebar-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}
.checkbox-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.category-group {
  margin-bottom: 16px;
}
.category-header {
  padding: 8px 16px;
  background-color: #f1f3f4;
  border-radius: 4px;
  margin-bottom: 4px;
}
.category-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #5f6368;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  margin-left: 12px;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.checkbox-item:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}
.checkbox-item.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
}
.checkbox-item input[type='checkbox'] {
  margin-right: 12px;
  cursor: pointer;
  transform: scale(1.1);
}
.checkbox-label {
  font-family: monospace;
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
.global-input {
  margin-bottom: 32px;
}
.input-container {
  position: relative;
}
.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  background: white;
  transition: border-color 0.2s;
}
.input-wrapper.error {
  border-color: #e74c3c;
}
.error-message {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 0.75rem;
  color: #e74c3c;
  background: white;
  padding: 2px 6px;
  border-radius: 3px;
}
.hex-display {
  margin-top: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  letter-spacing: 2px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}
.hex-prefix {
  color: #666;
  font-weight: bold;
  margin-right: 6px;
  font-family: monospace;
  letter-spacing: 0.1em;
  font-size: 1.1rem;
}
.hex-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-family: monospace;
  letter-spacing: 0.1em;
}
.page-content {
  max-width: none;
  margin: 0;
}
</style>
