<script setup lang="ts">
import { computed, watchEffect } from 'vue'

import type { DecodeMode, DecodeField, ConditionalDecodeMode } from '@/decoder/types'
import {
  DecodeFieldType,
  decodeFieldTypeDisplayName,
  decodeFieldTypeDescription,
} from '@/decoder/types'

interface Props extends DecodeMode {
  hexValue: string
}

const props = defineProps<Props>()

// Interface for bit range information
interface BitRange {
  start: number
  end: number
  width: number
  name: string
  description: string
}

// Helper function to get field display name
const getFieldDisplayName = (field: DecodeField, index?: number): string => {
  return (
    field.name ||
    (field.type !== undefined ? decodeFieldTypeDisplayName[field.type] : `Field[${index ?? 0}]`)
  )
}

// Helper function to get field description
const getFieldDescription = (field: DecodeField): string => {
  return (
    field.description || (field.type !== undefined ? decodeFieldTypeDescription[field.type] : '')
  )
}

// Helper function to get bit range from DecodeField
const getBitRangeFromField = (field: DecodeField, index?: number): BitRange => {
  const start = field.low
  const end = field.high !== undefined ? field.high : field.low
  const width = end - start + 1
  const name = getFieldDisplayName(field, index)
  const description = getFieldDescription(field)

  return { start, end, width, name, description }
}

// Helper function to check if a field is DecodeField
const isDecodeField = (field: any): field is DecodeField => {
  return typeof field.low === 'number'
}

// Helper function to get field value by name
const getFieldValueByName = (
  fieldName: string,
  fields: (DecodeField | ConditionalDecodeMode)[],
): bigint | null => {
  for (const field of fields) {
    if (isDecodeField(field) && field.name === fieldName) {
      const bitRange = getBitRangeFromField(field)
      let value = BigInt(0)
      for (let i = bitRange.start; i <= bitRange.end; i++) {
        if (binArray.value[63 - i]) {
          value |= BigInt(1) << BigInt(i - bitRange.start)
        }
      }
      return value
    }
  }
  return null
}

// Helper function to check condition
const checkCondition = (
  condition: { field: string; value: bigint },
  fields: (DecodeField | ConditionalDecodeMode)[],
): boolean => {
  const fieldValue = getFieldValueByName(condition.field, fields)
  return fieldValue !== null && fieldValue === condition.value
}

// Helper function to get all effective fields (recursively resolve conditional modes)
const getEffectiveFields = (fields: (DecodeField | ConditionalDecodeMode)[]): DecodeField[] => {
  const result: DecodeField[] = []

  for (const field of fields) {
    if (isDecodeField(field)) {
      result.push(field)
    } else {
      // This is a ConditionalDecodeMode
      if (checkCondition(field.condition, fields)) {
        result.push(...getEffectiveFields(field.fields))
      }
    }
  }

  return result
}

// Validate value array length and field name/type
const validateFields = () => {
  const effectiveFields = getEffectiveFields(props.fields)

  effectiveFields.forEach((field, index) => {
    // Check that at least one of name or type is not undefined
    if (field.name === undefined && field.type === undefined) {
      console.error(`Field[${index}] in ${props.name}: name and type cannot both be undefined`)
    }

    // Validate value array length
    if (field.value && Array.isArray(field.value)) {
      const fieldWidth = getBitRangeFromField(field).width
      const expectedLength = Math.pow(2, fieldWidth)
      if (field.value.length !== expectedLength) {
        console.error(
          `Field ${field.name || field.type} in ${props.name}: value array length is ${field.value.length}, but expected ${expectedLength} (2^${fieldWidth})`,
        )
      }
    }
  })

  // Check for overlapping bit ranges
  const bitRanges = effectiveFields.map((field, index) => getBitRangeFromField(field, index))

  // Sort by start position for easier overlap detection
  bitRanges.sort((a, b) => a.start - b.start)

  for (let i = 0; i < bitRanges.length - 1; i++) {
    const current = bitRanges[i]
    const next = bitRanges[i + 1]

    if (current.end >= next.start) {
      console.error(
        `Bit range overlap in ${props.name}: ${current.name} [${current.start}:${current.end}] overlaps with ${next.name} [${next.start}:${next.end}]`,
      )
    }
  }

  // Check for gaps and validate total bits
  let coveredBits = 0
  let lastEnd = -1

  for (const range of bitRanges) {
    if (lastEnd >= 0 && range.start > lastEnd + 1) {
      const gapStart = lastEnd + 1
      const gapEnd = range.start - 1
      console.warn(`Bit gap in ${props.name}: bits [${gapStart}:${gapEnd}] are not covered`)
    }
    coveredBits += range.width
    lastEnd = range.end
  }

  // Check if all 64 bits are covered
  if (lastEnd < 63) {
    console.warn(`Bit gap in ${props.name}: bits [${lastEnd + 1}:63] are not covered`)
  }

  if (coveredBits !== 64) {
    console.error(`Total bits in ${props.name} must be 64, but got ${coveredBits}`)
  }
}

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

// Validate when binArray is ready
watchEffect(() => {
  // This ensures binArray is computed before validation
  binArray.value
  validateFields()
})

// Emit event to parent component to handle bit toggling and error checking
const emit = defineEmits<{
  toggleBit: [bitIndex: number]
}>()

const toggleBit = (bitIndex: number) => {
  emit('toggleBit', bitIndex)
}

const binGroups = computed(() => {
  // Get effective fields after resolving conditions
  const effectiveFields = getEffectiveFields(props.fields)

  // Group based on effective fields - fields are ordered from low to high bit positions
  const groups = []

  for (const field of effectiveFields) {
    const bitRange = getBitRangeFromField(field)
    // Extract bits from the binary array (bit 0 is rightmost, bit 63 is leftmost)
    const groupBits = []
    for (let i = bitRange.start; i <= bitRange.end; i++) {
      groupBits.unshift(binArray.value[63 - i]) // unshift to maintain bit order
    }

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

    // Determine style type
    let styleType = 'normal'
    if (field.type === DecodeFieldType.INVALID || field.type === DecodeFieldType.CSR_WPRI) {
      styleType = 'grey'
    } else if (field.type === DecodeFieldType.CSR_RO0) {
      // Check value is 0
      styleType = decimalValue === 0 ? 'grey' : 'red'
    }

    groups.push({
      bits: groupBits,
      name: bitRange.name,
      description: bitRange.description,
      startIndex: bitRange.start,
      value: decimalValue,
      alias: alias,
      styleType: styleType,
      disabled: field.type === DecodeFieldType.INVALID,
    })
  }

  // Return groups ordered by bit position (high to low for display)
  return groups.sort((a, b) => b.startIndex - a.startIndex)
})
</script>

<template>
  <div class="card">
    <div class="card-title">{{ name }}</div>
    <div class="bin-output">
      <div v-for="(group, groupIdx) in binGroups" :key="groupIdx" class="bin-group">
        <span class="bin-name" :class="group.styleType" :title="group.description">
          {{ group.name }}
        </span>
        <div class="bin-bits" :class="group.styleType">
          <span
            v-for="(bit, bitIdx) in group.bits"
            :key="bitIdx"
            class="bit-digit"
            :class="{ disabled: group.disabled }"
            @click="
              !group.disabled && toggleBit(group.startIndex + (group.bits.length - 1 - bitIdx))
            "
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
.bit-digit.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.bit-digit:hover {
  background-color: #c5d9ff;
}
.bit-digit.disabled:hover {
  background-color: transparent;
}
.bin-name {
  font-size: 0.75rem;
  margin-top: 2px;
}
.bin-name:hover {
  opacity: 0.8;
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
