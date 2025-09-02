<script setup lang="ts">
import DecoderCard from './DecoderCard.vue'
import { decoders } from '../decoder'
import { computed } from 'vue'
import type { Tab } from '../types/tab'

interface Props {
  tab: Tab
  isActive: boolean
}

const props = defineProps<Props>()

// Get filtered decoder configs for this tab
const getFilteredDecoderConfigs = () => {
  const result = []
  for (const category of decoders) {
    for (const item of category.items) {
      const key = `${category.name}.${item.name}`
      if (props.tab.selectedDecoders.has(key)) {
        result.push({
          ...item,
          category: category.name,
          key,
        })
      }
    }
  }
  return result
}

// Handle input change for this tab
const handleInputChange = () => {
  const originalInput = props.tab.hexInput
  // Remove possible 0x prefix
  const withoutPrefix = originalInput.toLowerCase().replace(/^0x/, '')
  const hex = withoutPrefix.replace(/[^0-9a-f]/g, '')

  // If 0x prefix was removed, update input box
  if (originalInput.toLowerCase().startsWith('0x')) {
    props.tab.hexInput = withoutPrefix
    return
  }

  // Check if contains non-hexadecimal characters
  if (withoutPrefix && withoutPrefix !== hex) {
    props.tab.errorMessage = 'Only hexadecimal characters allowed (0-9, A-F)'
    return
  }

  // Check if exceeds 64-bit range
  if (hex) {
    try {
      const num = BigInt('0x' + hex)
      const binStr = num.toString(2)
      if (binStr.length > 64) {
        props.tab.errorMessage = 'Value exceeds 64-bit range'
        return
      }
    } catch {
      props.tab.errorMessage = 'Invalid hexadecimal number'
      return
    }
  }

  // Clear error state
  props.tab.errorMessage = ''
}

// Handle bit toggle for this tab
const handleToggleBit = (bitIndex: number) => {
  const hex = props.tab.hexInput.replace(/[^0-9a-fA-F]/g, '')

  // If no input, assume 0
  const num = hex ? BigInt('0x' + hex) : BigInt(0)
  const binStr = num.toString(2).padStart(64, '0')
  const binArray = binStr.split('').map((bit) => parseInt(bit))

  // Toggle specified bit
  binArray[63 - bitIndex] = binArray[63 - bitIndex] === 0 ? 1 : 0

  // Convert back to hexadecimal
  const newBinStr = binArray.join('')
  const newNum = BigInt('0b' + newBinStr)
  props.tab.hexInput = newNum.toString(16).toUpperCase().padStart(16, '0')
}

// Computed property for hex input v-model
const hexInputModel = computed({
  get: () => props.tab.hexInput,
  set: (value: string) => {
    props.tab.hexInput = value
  }
})
</script>

<template>
  <div class="tab-pane" :class="{ active: isActive }">
    <div class="tab-header">
      <h3>{{ tab.name }}</h3>
    </div>
    <div class="global-input">
      <div class="input-container">
        <div class="input-wrapper" :class="{ error: tab.errorMessage }">
          <span class="hex-prefix">0x</span>
          <input
            v-model="hexInputModel"
            @input="handleInputChange"
            class="hex-input"
            placeholder="0000000000000000"
          />
        </div>
        <div v-if="tab.errorMessage" class="error-message">{{ tab.errorMessage }}</div>
      </div>
    </div>
    <div class="page-content">
      <DecoderCard
        v-for="config in getFilteredDecoderConfigs()"
        :key="config.key"
        :name="config.name"
        :fields="config.fields"
        :hex-value="tab.hexInput"
        @toggle-bit="handleToggleBit"
      />
    </div>
  </div>
</template>

<style scoped>
.tab-pane {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: border-color 0.2s;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}
.tab-pane.active {
  border-color: #2196f3;
}
.tab-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}
.tab-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}
.global-input {
  margin-bottom: 20px;
}
.input-container {
  position: relative;
}
.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
  transition: border-color 0.2s;
}
.input-wrapper.error {
  border-color: #e74c3c;
}
.error-message {
  position: absolute;
  bottom: -18px;
  right: 0;
  font-size: 0.7rem;
  color: #e74c3c;
  background: white;
  padding: 2px 6px;
  border-radius: 3px;
}
.hex-prefix {
  color: #666;
  font-weight: bold;
  margin-right: 4px;
  font-family: monospace;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
}
.hex-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  font-family: monospace;
  letter-spacing: 0.1em;
}
.page-content {
  max-width: none;
  margin: 0;
}
</style>
