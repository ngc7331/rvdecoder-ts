<script setup lang="ts">
import type { Tab } from '@/types/tab'

interface Props {
  tabs: Tab[]
  activeTabId: number
  sidebarCollapsed?: boolean
}

interface Emits {
  (e: 'add-tab'): void
  (e: 'remove-tab', tabId: number): void
  (e: 'select-tab', tabId: number): void
  (e: 'clear-storage'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="tab-navigation" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <div class="tab-list">
      <div class="tab-controls-left">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTabId === tab.id }"
          @click="$emit('select-tab', tab.id)"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <button
            v-if="tabs.length > 1"
            class="tab-close"
            @click.stop="$emit('remove-tab', tab.id)"
            :title="`Close ${tab.name}`"
          >
            ×
          </button>
        </button>
        <button
          v-if="tabs.length < 4"
          class="tab-add"
          @click="$emit('add-tab')"
          title="Add new tab"
        >
          +
        </button>
      </div>
      <button class="tab-clear" @click="$emit('clear-storage')" title="Clear all saved data">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="3,6 5,6 21,6" />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tab-navigation {
  margin-bottom: 10px;
  transition: padding-left 0.3s ease;
}
.tab-navigation.sidebar-collapsed {
  padding-left: 84px;
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
  padding: 4px 6px;
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
  padding: 4px 6px;
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
</style>
