import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, rs1, rs2, funct3 } from './common'

// AMO operation codes (funct7[6:2])
const amoFunct5 = new Map<bigint, string>([
  [BigInt(0b00010), 'LR'], // Load Reserved
  [BigInt(0b00011), 'SC'], // Store Conditional
  [BigInt(0b00001), 'AMOSWAP'], // Atomic Swap
  [BigInt(0b00000), 'AMOADD'], // Atomic Add
  [BigInt(0b00100), 'AMOXOR'], // Atomic XOR
  [BigInt(0b01100), 'AMOAND'], // Atomic AND
  [BigInt(0b01000), 'AMOOR'], // Atomic OR
  [BigInt(0b10000), 'AMOMIN'], // Atomic Minimum
  [BigInt(0b10100), 'AMOMAX'], // Atomic Maximum
  [BigInt(0b11000), 'AMOMINU'], // Atomic Minimum Unsigned
  [BigInt(0b11100), 'AMOMAXU'], // Atomic Maximum Unsigned
])

export const amoFields: (DecodeField | ConditionalDecodeMode)[] = [
  rd,
  rs1,
  rs2,
  funct3(['Reserved', 'Reserved', 'W', 'D', 'Reserved', 'Reserved', 'Reserved', 'Reserved']),
  { name: 'rl', low: 25, high: 25, description: 'Release ordering' },
  { name: 'aq', low: 26, high: 26, description: 'Acquire ordering' },
  { name: 'funct5', low: 27, high: 31, value: amoFunct5, description: 'AMO operation' },
]
