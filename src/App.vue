<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import type { Tab } from '@/types/tab'

import TabPane from './components/TabPane.vue'
import DecoderSelector from './components/DecoderSelector.vue'
import TabNavigation from './components/TabNavigation.vue'

const emptyTab: (id: number, name: string) => Tab = (id: number, name: string) => ({
  id,
  name,
  hexInput: '0000000000000000',
  errorMessage: '',
  selectedDecoders: new Set(['general.general']),
})

// Tab management functions
const addTab = () => {
  if (tabs.value.length >= 4) return

  const newId = Math.max(...tabs.value.map((t) => t.id)) + 1
  tabs.value.push(emptyTab(newId, `Tab ${newId}`))
  activeTabId.value = newId
}

const removeTab = (tabId: number) => {
  if (tabs.value.length <= 1) return

  const index = tabs.value.findIndex((tab) => tab.id === tabId)
  if (index !== -1) {
    tabs.value.splice(index, 1)

    // If removing the active tab, switch to another
    if (activeTabId.value === tabId) {
      activeTabId.value = tabs.value[Math.max(0, index - 1)].id
    }
  }
}

const selectTab = (tabId: number) => {
  activeTabId.value = tabId
}

// Save tabs state to localStorage
const saveTabsState = () => {
  try {
    const tabsData = {
      tabs: tabs.value.map((tab) => ({
        id: tab.id,
        name: tab.name,
        hexInput: tab.hexInput,
        errorMessage: tab.errorMessage,
        selectedDecoders: Array.from(tab.selectedDecoders),
      })),
      activeTabId: activeTabId.value,
      sidebarCollapsed: sidebarCollapsed.value,
    }
    localStorage.setItem('rvdecoder-tabs-state', JSON.stringify(tabsData))
  } catch (error) {
    console.warn('Failed to save tabs state to localStorage:', error)
  }
}

// Load tabs state from localStorage
const loadTabsState = () => {
  try {
    const saved = localStorage.getItem('rvdecoder-tabs-state')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.tabs && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
        return {
          tabs: parsed.tabs.map(
            (tab: {
              id: number
              name: string
              hexInput: string
              errorMessage: string
              selectedDecoders: string[]
            }) => ({
              ...tab,
              selectedDecoders: new Set(tab.selectedDecoders || ['general.general']),
            }),
          ),
          activeTabId: parsed.activeTabId || parsed.tabs[0]?.id || 1,
          sidebarCollapsed: parsed.sidebarCollapsed || false,
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load tabs state from localStorage:', error)
  }

  // Return default state if no saved state or error
  return {
    tabs: [emptyTab(1, 'Tab 1')],
    activeTabId: 1,
    sidebarCollapsed: false,
  }
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

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Clear localStorage and reset to default state
const clearStorage = () => {
  if (confirm('Are you sure you want to clear all saved data and reset to default state?')) {
    try {
      localStorage.removeItem('rvdecoder-tabs-state')
      // Reset to default state
      tabs.value = [emptyTab(1, 'Tab 1')]
      activeTabId.value = 1
      sidebarCollapsed.value = false
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }
}

// Handle tab updates from TabPane components
const handleTabUpdate = (tabId: number, updates: Partial<Tab>) => {
  const tab = tabs.value.find((t) => t.id === tabId)
  if (tab) {
    Object.assign(tab, updates)
  }
}

// Initialize state from localStorage or defaults
const initialState = loadTabsState()

// Tabs management
const tabs = ref<Tab[]>(initialState.tabs)
const activeTabId = ref(initialState.activeTabId)
const sidebarCollapsed = ref(initialState.sidebarCollapsed)

// Get active tab
const activeTab = computed(
  () => tabs.value.find((tab) => tab.id === activeTabId.value) || tabs.value[0],
)

// Watch tabs changes and save to localStorage
watch([tabs, activeTabId, sidebarCollapsed], saveTabsState, { deep: true })
</script>

<template>
  <div class="rvdecoder-container">
    <div class="main-layout">
      <DecoderSelector
        :selected-decoders="activeTab?.selectedDecoders || new Set()"
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-decoder="toggleDecoder"
      />
      <div class="content-area">
        <TabNavigation
          :tabs="tabs"
          :active-tab-id="activeTabId"
          :sidebar-collapsed="sidebarCollapsed"
          @add-tab="addTab"
          @remove-tab="removeTab"
          @select-tab="selectTab"
          @clear-storage="clearStorage"
        />

        <!-- Tab Content Grid -->
        <div
          class="tab-content-grid"
          :class="{
            single: tabs.length === 1,
            two: tabs.length === 2,
            three: tabs.length === 3,
            four: tabs.length === 4,
          }"
        >
          <TabPane
            v-for="tab in tabs"
            :key="tab.id"
            :tab="tab"
            :is-active="activeTabId === tab.id"
            :is-double-row="tabs.length > 2"
            @update-tab="(updates) => handleTabUpdate(tab.id, updates)"
            @select-tab="selectTab(tab.id)"
          />
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
.content-area {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Tab Content Grid */
.tab-content-grid {
  flex: 1;
  display: grid;
  gap: 10px;
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
  .tab-content-grid.two {
    grid-template-columns: 1fr;
  }
}
</style>
