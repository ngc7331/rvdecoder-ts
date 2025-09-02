<script setup lang="ts">
import RegisterCard from './components/RegisterCard.vue'
import { decoders } from './decoder'
import { ref, computed, watch } from 'vue'

// Tab interface
interface Tab {
  id: string
  name: string
  hexInput: string
  errorMessage: string
  selectedDecoders: Set<string>
}

// Get initial selected state from localStorage, default to 'general.general' if not available
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

// Tabs management
const tabs = ref<Tab[]>([
  {
    id: '1',
    name: 'Tab 1',
    hexInput: '0000000000000000',
    errorMessage: '',
    selectedDecoders: new Set(getInitialSelectedDecoders()) // Create a new Set instance
  }
])
const activeTabId = ref('1')
const sidebarCollapsed = ref(false)

// Get active tab
const activeTab = computed(() => tabs.value.find(tab => tab.id === activeTabId.value) || tabs.value[0])

// Watch selectedDecoders changes for active tab, save to localStorage
watch(
  () => activeTab.value?.selectedDecoders,
  (newDecoders) => {
    if (newDecoders) {
      try {
        const decodersArray = Array.from(newDecoders)
        localStorage.setItem('rvdecoder-selectedDecoders', JSON.stringify(decodersArray))
      } catch (error) {
        console.warn('Failed to save selected decoders to localStorage:', error)
      }
    }
  },
  { deep: true },
)

// Watch for tab changes to force reactivity
watch(
  activeTabId,
  () => {
    // Force re-evaluation of computed properties when tab changes
    // This helps ensure the UI updates correctly
  }
)

// Get filtered decoder configs for a specific tab
const getFilteredDecoderConfigsForTab = (tab: Tab) => {
  const result = []
  for (const category of decoders) {
    for (const item of category.items) {
      const key = `${category.name}.${item.name}`
      if (tab.selectedDecoders.has(key)) {
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

// Toggle decoder selection state for active tab
const toggleDecoder = (decoderKey: string) => {
  const tab = activeTab.value
  if (!tab) return

  // Create a new Set to trigger reactivity
  const newSelectedDecoders = new Set(tab.selectedDecoders)
  if (newSelectedDecoders.has(decoderKey)) {
    newSelectedDecoders.delete(decoderKey)
  } else {
    newSelectedDecoders.add(decoderKey)
  }

  // Update the tab's selectedDecoders with the new Set
  tab.selectedDecoders = newSelectedDecoders
}

// Tab management functions
const addTab = () => {
  if (tabs.value.length >= 4) return

  const newId = (Math.max(...tabs.value.map(t => parseInt(t.id))) + 1).toString()
  const newTab: Tab = {
    id: newId,
    name: `Tab ${newId}`,
    hexInput: '0000000000000000',
    errorMessage: '',
    selectedDecoders: new Set(getInitialSelectedDecoders()) // Create a new Set instance
  }
  tabs.value.push(newTab)
  activeTabId.value = newId
}

const removeTab = (tabId: string) => {
  if (tabs.value.length <= 1) return

  const index = tabs.value.findIndex(tab => tab.id === tabId)
  if (index !== -1) {
    tabs.value.splice(index, 1)

    // If removing the active tab, switch to another
    if (activeTabId.value === tabId) {
      activeTabId.value = tabs.value[Math.max(0, index - 1)].id
    }
  }
}

const selectTab = (tabId: string) => {
  activeTabId.value = tabId
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Handle input change for specific tab
const handleInputChange = (tab: Tab) => {
  const originalInput = tab.hexInput
  // Remove possible 0x prefix
  const withoutPrefix = originalInput.toLowerCase().replace(/^0x/, '')
  const hex = withoutPrefix.replace(/[^0-9a-f]/g, '')

  // If 0x prefix was removed, update input box
  if (originalInput.toLowerCase().startsWith('0x')) {
    tab.hexInput = withoutPrefix
    return
  }

  // Check if contains non-hexadecimal characters
  if (withoutPrefix && withoutPrefix !== hex) {
    tab.errorMessage = 'Only hexadecimal characters allowed (0-9, A-F)'
    return
  }

  // Check if exceeds 64-bit range
  if (hex) {
    try {
      const num = BigInt('0x' + hex)
      const binStr = num.toString(2)
      if (binStr.length > 64) {
        tab.errorMessage = 'Value exceeds 64-bit range'
        return
      }
    } catch {
      tab.errorMessage = 'Invalid hexadecimal number'
      return
    }
  }

  // Clear error state
  tab.errorMessage = ''
}

// Handle bit toggle for specific tab
const handleToggleBit = (bitIndex: number, tab: Tab) => {
  const hex = tab.hexInput.replace(/[^0-9a-fA-F]/g, '')

  // If no input, assume 0
  const num = hex ? BigInt('0x' + hex) : BigInt(0)
  const binStr = num.toString(2).padStart(64, '0')
  const binArray = binStr.split('').map((bit) => parseInt(bit))

  // Toggle specified bit
  binArray[63 - bitIndex] = binArray[63 - bitIndex] === 0 ? 1 : 0

  // Convert back to hexadecimal
  const newBinStr = binArray.join('')
  const newNum = BigInt('0b' + newBinStr)
  tab.hexInput = newNum.toString(16).toUpperCase().padStart(16, '0')
}
</script>

<template>
  <div class="rvdecoder-container">
    <div class="main-layout">
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <h3>Decode mode</h3>
          <button @click="toggleSidebar" class="sidebar-toggle" :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
            <svg v-if="sidebarCollapsed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>
        <div v-if="!sidebarCollapsed" class="checkbox-list">
          <div v-for="category in decoders" :key="category.name" class="category-group">
            <div class="category-header">
              <h4>{{ category.name }}</h4>
            </div>
            <label
              v-for="item in category.items"
              :key="`${category.name}.${item.name}`"
              class="checkbox-item"
              :class="{ selected: activeTab?.selectedDecoders?.has(`${category.name}.${item.name}`) }"
            >
              <input
                type="checkbox"
                :checked="activeTab?.selectedDecoders?.has(`${category.name}.${item.name}`) || false"
                @change="toggleDecoder(`${category.name}.${item.name}`)"
              />
              <span class="checkbox-label">{{ item.name }}</span>
            </label>
          </div>
        </div>
      </aside>
      <div class="content-area">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <div class="tab-list">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-button"
              :class="{ active: activeTabId === tab.id }"
              @click="selectTab(tab.id)"
            >
              <span class="tab-name">{{ tab.name }}</span>
              <button
                v-if="tabs.length > 1"
                class="tab-close"
                @click.stop="removeTab(tab.id)"
                :title="`Close ${tab.name}`"
              >
                ×
              </button>
            </button>
            <button
              v-if="tabs.length < 4"
              class="tab-add"
              @click="addTab"
              title="Add new tab"
            >
              +
            </button>
          </div>
        </div>

        <!-- Tab Content Grid -->
        <div class="tab-content-grid" :class="{
          'single': tabs.length === 1,
          'two': tabs.length === 2,
          'three': tabs.length === 3,
          'four': tabs.length === 4
        }">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-pane"
            :class="{ active: activeTabId === tab.id }"
          >
            <div class="tab-header">
              <h3>{{ tab.name }}</h3>
            </div>
            <div class="global-input">
              <div class="input-container">
                <div class="input-wrapper" :class="{ error: tab.errorMessage }">
                  <span class="hex-prefix">0x</span>
                  <input
                    v-model="tab.hexInput"
                    @input="() => handleInputChange(tab)"
                    class="hex-input"
                    placeholder="0000000000000000"
                  />
                </div>
                <div v-if="tab.errorMessage" class="error-message">{{ tab.errorMessage }}</div>
              </div>
            </div>
            <div class="page-content">
              <RegisterCard
                v-for="config in getFilteredDecoderConfigsForTab(tab)"
                :key="config.key"
                :name="config.name"
                :fields="config.fields"
                :hex-value="tab.hexInput"
                @toggle-bit="(bitIndex: number) => handleToggleBit(bitIndex, tab)"
              />
            </div>
          </div>
        </div>
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
  transition: width 0.3s ease;
}
.sidebar.collapsed {
  width: 60px;
}
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sidebar.collapsed .sidebar-header {
  padding: 20px 10px;
  justify-content: center;
}
.sidebar-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}
.sidebar.collapsed .sidebar-header h3 {
  display: none;
}
.sidebar-toggle {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.sidebar-toggle:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
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
  display: flex;
  flex-direction: column;
}

/* Tab Navigation */
.tab-navigation {
  margin-bottom: 24px;
}
.tab-list {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}
.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  top: 1px;
}
.tab-button:hover {
  background-color: #f8f9fa;
}
.tab-button.active {
  background-color: #fff;
  border-color: #2196f3;
  border-bottom: 1px solid #fff;
  z-index: 1;
}
.tab-name {
  font-weight: 500;
  color: #333;
}
.tab-close {
  background: none;
  border: none;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.tab-close:hover {
  background-color: #f0f0f0;
  color: #e74c3c;
}
.tab-add {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  font-size: 16px;
  transition: all 0.2s;
}
.tab-add:hover {
  background-color: #e9ecef;
  border-color: #999;
}

/* Tab Content Grid */
.tab-content-grid {
  flex: 1;
  display: grid;
  gap: 20px;
}
.tab-content-grid.single {
  grid-template-columns: 1fr;
}
.tab-content-grid.two {
  grid-template-columns: 1fr 1fr;
}
.tab-content-grid.three {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.tab-content-grid.four {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.tab-content-grid.three .tab-pane:nth-child(3) {
  grid-column: 1 / -1;
}
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

/* Responsive design for smaller screens */
@media (max-width: 1200px) {
  .tab-content-grid.three,
  .tab-content-grid.four {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto, 1fr);
  }
  .tab-content-grid.three .tab-pane:nth-child(3) {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    max-height: 200px;
  }
  .sidebar.collapsed {
    max-height: 60px;
  }
  .tab-content-grid.two {
    grid-template-columns: 1fr;
  }
}
</style>
