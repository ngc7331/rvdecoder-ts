<script setup lang="ts">
import { decoders } from '@/decoder'

interface Props {
  selectedDecoders: Set<string>
  collapsed: boolean
}

interface Emits {
  (e: 'toggle-sidebar'): void
  (e: 'toggle-decoder', decoderKey: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <h3>Decode mode</h3>
      <button
        @click="$emit('toggle-sidebar')"
        class="sidebar-toggle"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <svg
          v-if="collapsed"
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
    <div v-if="!collapsed" class="checkbox-list">
      <div v-for="category in decoders" :key="category.name" class="category-group">
        <div class="category-header">
          <h4>{{ category.name }}</h4>
        </div>
        <label
          v-for="item in category.items"
          :key="`${category.name}.${item.name}`"
          class="checkbox-item"
          :class="{
            selected: selectedDecoders?.has(`${category.name}.${item.name}`),
          }"
        >
          <input
            type="checkbox"
            :checked="selectedDecoders?.has(`${category.name}.${item.name}`) || false"
            @change="$emit('toggle-decoder', `${category.name}.${item.name}`)"
          />
          <span class="checkbox-label">{{ item.name }}</span>
        </label>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.sidebar.collapsed {
  width: 0;
  border-right: none;
}
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}
.sidebar.collapsed .sidebar-header {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}
.sidebar-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
}
.sidebar.collapsed .sidebar-header h3 {
  display: none;
}
.sidebar.collapsed .checkbox-list {
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
.sidebar.collapsed .sidebar-toggle {
  border: none;
  background: none;
  color: #2196f3;
}
.sidebar-toggle:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
}
.sidebar.collapsed .sidebar-toggle:hover {
  background-color: #e3f2fd;
  border-color: transparent;
}
.checkbox-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* Custom scrollbar for checkbox list */
.checkbox-list::-webkit-scrollbar {
  width: 6px;
}

.checkbox-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.checkbox-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  transition: background 0.2s;
}

.checkbox-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
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
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-height: 200px;
  }
  .sidebar.collapsed {
    width: 0;
    max-height: none;
  }
  .sidebar.collapsed .sidebar-header {
    top: 10px;
    left: 10px;
  }
}
</style>
