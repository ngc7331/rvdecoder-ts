<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { decoders } from '@/decoder'
import type { Tab } from '@/types/tab'

import TabPane from './components/TabPane.vue'

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
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <h3>Decode mode</h3>
          <button
            @click="toggleSidebar"
            class="sidebar-toggle"
            :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          >
            <svg
              v-if="sidebarCollapsed"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 18l-6-6 6-6" />
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
              :class="{
                selected: activeTab?.selectedDecoders?.has(`${category.name}.${item.name}`),
              }"
            >
              <input
                type="checkbox"
                :checked="
                  activeTab?.selectedDecoders?.has(`${category.name}.${item.name}`) || false
                "
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
            <div class="tab-controls-left">
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
              <button v-if="tabs.length < 4" class="tab-add" @click="addTab" title="Add new tab">
                +
              </button>
            </div>
            <button class="tab-clear" @click="clearStorage" title="Clear all saved data">
              🗑️
            </button>
          </div>
        </div>

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
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}
.tab-controls-left {
  display: flex;
  gap: 4px;
  align-items: center;
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
.tab-clear {
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  cursor: pointer;
  color: #e53e3e;
  font-size: 14px;
  transition: all 0.2s;
}
.tab-clear:hover {
  background-color: #fed7d7;
  border-color: #e53e3e;
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
