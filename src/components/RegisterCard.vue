<script setup lang="ts">
import { computed } from 'vue'

import type { DecodeMode } from '@/decoder/types'
import { DecodeFieldType } from '@/decoder/types'

interface Props extends DecodeMode {
  hexValue: string
}

const props = defineProps<Props>()

// Validate value array length and field name/type
const validateFields = () => {
  props.fields.forEach((field, index) => {
    // Check that at least one of name or type is not undefined
    if (field.name === undefined && field.type === undefined) {
      console.error(`Field[${index}] in ${props.name}: name and type cannot both be undefined`)
    }

    // Validate value array length
    if (field.value && Array.isArray(field.value)) {
      const expectedLength = Math.pow(2, field.width)
      if (field.value.length !== expectedLength) {
        console.error(
          `Field ${field.name || field.type} in ${props.name}: value array length is ${field.value.length}, but expected ${expectedLength} (2^${field.width})`,
        )
      }
    }
  })
}

// Validate when component loads
validateFields()

// Calculate binary array based on input hexValue
const binArray = computed(() => {
  const hex = props.hexValue.replace(/[^0-9a-fA-F]/g, '')
  if (!hex) {
    return new Array(64).fill(0)
  }

  try {
    const num = BigInt('0x' + hex)
    const binStr = num.toString(2).padStart(64, '0')
    return binStr.split('').map((bit) => parseInt(bit))
  } catch {
    return new Array(64).fill(0)
  }
})

// Emit event to parent component to handle bit toggling and error checking
const emit = defineEmits<{
  toggleBit: [bitIndex: number]
}>()

const toggleBit = (bitIndex: number) => {
  emit('toggleBit', bitIndex)
}

const binGroups = computed(() => {
  // Group based on fields
  const groups = []
  let position = props.fields.reduce((sum, fmt) => sum + fmt.width, 0)

  for (const field of props.fields) {
    position -= field.width
    const groupBits = binArray.value.slice(position, position + field.width)

    // Calculate current group's value
    const binaryString = groupBits.join('')
    const decimalValue = parseInt(binaryString, 2)

    // Get corresponding alias
    let alias = null
    if (field.value) {
      if (Array.isArray(field.value)) {
        alias = field.value[decimalValue]
      } else {
        alias = field.value.get(BigInt('0b' + binaryString)) || 'Reserved'
      }
    }

    // Determine display name: if name is undefined, use type as name
    const decodeFieldTypeDisplayName: Record<DecodeFieldType, string> = {
      [DecodeFieldType.CSR_WPRI]: 'WPRI',
      [DecodeFieldType.CSR_RO0]: 'RO0',
    }

    const displayName = field.name ? field.name : field.type !== undefined ? decodeFieldTypeDisplayName[field.type] : 'Unknown'

    // Determine style type
    let styleType = 'normal'
    if (field.type === DecodeFieldType.CSR_WPRI) {
      styleType = 'grey'
    } else if (field.type === DecodeFieldType.CSR_RO0) {
      // Check value is 0
      styleType = decimalValue === 0 ? 'grey' : 'red'
    }

    groups.push({
      bits: groupBits,
      name: displayName,
      startIndex: position,
      value: decimalValue,
      alias: alias,
      styleType: styleType,
    })
  }

  // For display, high bits come first, need to recalculate startIndex
  return groups.reverse()
})
</script>

<template>
  <div class="card">
    <div class="card-title">{{ name }}</div>
    <div class="bin-output">
      <div v-for="(group, groupIdx) in binGroups" :key="groupIdx" class="bin-group">
        <span class="bin-name" :class="group.styleType">{{ group.name }}</span>
        <div class="bin-bits" :class="group.styleType">
          <span
            v-for="(bit, bitIdx) in group.bits"
            :key="bitIdx"
            class="bit-digit"
            @click="toggleBit(group.startIndex + bitIdx)"
          >
            {{ bit }}
          </span>
        </div>
        <div v-if="group.alias" class="bin-alias">{{ group.alias }}</div>
        <div v-else class="bin-alias-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
  min-width: 320px;
  margin-bottom: 24px;
}
.card-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 16px;
}
.bin-output {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bin-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bin-bits {
  background: #e1eaff;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 1rem;
  display: flex;
}
.bin-bits.grey {
  background: #f0f0f0;
  color: #888;
}
.bin-bits.normal {
  background: #e8f4fd;
  color: #000;
}
.bin-bits.red {
  background: #ffe6e6;
  color: #d32f2f;
}
.bit-digit {
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: background-color 0.2s;
}
.bit-digit:hover {
  background-color: #c5d9ff;
}
.bin-name {
  font-size: 0.75rem;
  margin-top: 2px;
}
.bin-name.grey {
  color: #888;
}
.bin-name.normal {
  color: #333;
}
.bin-name.red {
  color: #d32f2f;
}
.bin-alias {
  font-size: 0.7rem;
  color: #2c3e50;
  font-weight: bold;
  margin-top: 2px;
  padding: 2px 4px;
  background: #e8f4fd;
  border-radius: 3px;
  text-align: center;
  min-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
