<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

import { decoders } from '@/decoder'
import type { Tab } from '@/types/tab'

import DecoderCard from './DecoderCard.vue'

interface Props {
  tab: Tab
  isActive: boolean
  isDoubleRow: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-tab': [updates: Partial<Tab>]
  'select-tab': []
}>()

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
    emit('update-tab', { hexInput: withoutPrefix })
    return
  }

  // Check if contains non-hexadecimal characters
  if (withoutPrefix && withoutPrefix !== hex) {
    emit('update-tab', { errorMessage: 'Only hexadecimal characters allowed (0-9, A-F)' })
    return
  }

  // Check if exceeds 64-bit range
  if (hex) {
    try {
      const num = BigInt('0x' + hex)
      const binStr = num.toString(2)
      if (binStr.length > 64) {
        emit('update-tab', { errorMessage: 'Value exceeds 64-bit range' })
        return
      }
    } catch {
      emit('update-tab', { errorMessage: 'Invalid hexadecimal number' })
      return
    }
  }

  // Clear error state
  emit('update-tab', { errorMessage: '' })
}

// Handle blur event to auto-pad with zeros to 16 digits
const handleInputBlur = () => {
  const hex = props.tab.hexInput.replace(/[^0-9a-fA-F]/g, '').toLowerCase()

  // Only pad if there's valid hex input and no error
  if (hex && !props.tab.errorMessage) {
    const paddedHex = hex.padStart(16, '0')
    emit('update-tab', { hexInput: paddedHex })
  }
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
  const newHexInput = newNum.toString(16).toUpperCase().padStart(16, '0')

  emit('update-tab', { hexInput: newHexInput })
}

// Computed property for hex input v-model
const hexInputModel = computed({
  get: () => props.tab.hexInput,
  set: (value: string) => {
    emit('update-tab', { hexInput: value })
  },
})

// Handle tab pane click to select this tab
const handleTabPaneClick = () => {
  emit('select-tab')
}

// Handle tab name editing
const isEditingName = ref(false)
const tempTabName = ref('')
const tabNameInput = ref<HTMLInputElement>()

const startEditTabName = () => {
  isEditingName.value = true
  tempTabName.value = props.tab.name
  nextTick(() => {
    if (tabNameInput.value) {
      tabNameInput.value.focus()
      tabNameInput.value.select()
    }
  })
}

const saveTabName = () => {
  if (tempTabName.value.trim()) {
    emit('update-tab', { name: tempTabName.value.trim() })
  }
  isEditingName.value = false
  tempTabName.value = ''
}

const cancelEditTabName = () => {
  isEditingName.value = false
  tempTabName.value = ''
}
</script>

<template>
  <div class="tab-pane" :class="{ active: isActive, 'double-row': isDoubleRow }" @click="handleTabPaneClick">
    <div class="tab-header">
      <div class="tab-title-container">
        <button class="tab-edit-btn" @click.stop="startEditTabName" :title="`Edit ${tab.name}`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <h3 v-if="!isEditingName" class="tab-title">{{ tab.name }}</h3>
        <input
          v-else
          ref="tabNameInput"
          v-model="tempTabName"
          @blur="saveTabName"
          @keyup.enter="saveTabName"
          @keyup.escape="cancelEditTabName"
          @click.stop
          class="tab-title-input"
        />
      </div>
    </div>
    <div class="global-input">
      <div class="input-container">
        <div class="input-wrapper" :class="{ error: tab.errorMessage }">
          <span class="hex-prefix">0x</span>
          <input
            v-model="hexInputModel"
            @input="handleInputChange"
            @blur="handleInputBlur"
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
        :config="config"
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
  max-height: calc(100vh - 70px);
}

/* Custom scrollbar for tab pane */
.tab-pane::-webkit-scrollbar {
  width: 8px;
}

.tab-pane::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
  margin: 4px;
}

.tab-pane::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
  transition: background 0.2s;
}

.tab-pane::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.tab-pane.active::-webkit-scrollbar-thumb {
  background: #93c5fd;
}

.tab-pane.active::-webkit-scrollbar-thumb:hover {
  background: #60a5fa;
}
.tab-pane.active {
  border-color: #2196f3;
}
.tab-pane.double-row {
  max-height: calc(50vh - 40px);
}
.tab-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}
.tab-title-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-edit-btn {
  background: none;
  border: none;
  font-size: 14px;
  line-height: 1;
  padding: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  border-radius: 3px;
  flex-shrink: 0;
}
.tab-edit-btn:hover {
  background-color: #f0f0f0;
  color: #2196f3;
}
.tab-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  flex: 1;
}
.tab-title-input {
  background: white;
  border: 1px solid #2196f3;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  outline: none;
  flex: 1;
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
  letter-spacing: 0.1em;
  font-size: 0.9rem;
}
.hex-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}
.page-content {
  max-width: none;
  margin: 0;
}
</style>
