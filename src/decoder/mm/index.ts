import type { DecodeExtraInfo, DecodeField, DecodeMode } from '@/types/decoder'

import { DecodeFieldType } from '@/types/decoder'
import { renderImm } from '../utils/renderImm'

const pteFlags: DecodeField[] = [
  {
    low: 0,
    name: 'V',
    extra: (value) => {
      const valid = (value & 0x1n) === 0x1n
      const xwr = Number((value >> 1n) & 0x7n)

      const encoding: DecodeExtraInfo[] = [
        { msg: 'PTE is: Pointer to next level of page table', level: 'info' },
        { msg: 'PTE is: Read-only page', level: 'info' },
        { msg: 'PTE is: Reserved (X=0, W=1, R=0)', level: 'warning' },
        { msg: 'PTE is: Read-write page', level: 'info' },
        { msg: 'PTE is: Execute-only page', level: 'info' },
        { msg: 'PTE is: Read-execute page', level: 'info' },
        { msg: 'PTE is: Reserved (X=1, W=1, R=0)', level: 'warning' },
        { msg: 'PTE is: Read-write-execute page', level: 'info' },
      ]

      if (!valid) {
        return [{ msg: 'PTE is: Invalid (V=0)', level: 'info' }]
      } else {
        return [encoding[xwr]]
      }
    },
  },
  { low: 1, name: 'R' },
  { low: 2, name: 'W' },
  { low: 3, name: 'X' },
  { low: 4, name: 'U' },
  { low: 5, name: 'G' },
  { low: 6, name: 'A' },
  { low: 7, name: 'D' },
  {
    low: 8,
    high: 9,
    name: 'RSW',
    description: 'Reserved for Supervisor Software, ignored by hardware',
  },
]

const rv32PteCommon: DecodeField[] = [{ low: 32, high: 63, type: DecodeFieldType.INVALID }]

const rv32PPNExtra: (value: bigint) => DecodeExtraInfo[] = (value) => [
  { msg: `PPN = ${renderImm((value >> 10n) & ((1n << 22n) - 1n), 9, false)}`, level: 'info' },
]

const constructRv32VPN: (level: number) => DecodeField = (level) => {
  const low = 12 + level * 10

  return {
    low: low,
    high: low + 9,
    name: `VPN[${level}]`,
    extra: (value) => {
      const vpn = (value >> BigInt(low)) & ((1n << 10n) - 1n)
      return [{ msg: `VPN[${level}] = ${renderImm(vpn, 10, false)}`, level: 'info' }]
    },
  }
}

const rv64PteCommon: DecodeField[] = [
  { low: 54, high: 60, type: DecodeFieldType.RESERVED },
  { low: 61, high: 62, name: 'PBMT', value: ['PMA', 'NC', 'IO', 'Reserved'] },
  { low: 63, name: 'N' },
]

const rv64PPNExtra: (value: bigint) => DecodeExtraInfo[] = (value) => [
  { msg: `PPN = ${renderImm((value >> 10n) & ((1n << 44n) - 1n), 9, false)}`, level: 'info' },
]

const constructRv64VPN: (level: number) => DecodeField = (level) => {
  const low = 12 + level * 9

  return {
    low: low,
    high: low + 8,
    name: `VPN[${level}]`,
    extra: (value) => {
      const vpn = (value >> BigInt(low)) & ((1n << 9n) - 1n)
      return [{ msg: `VPN[${level}] = ${renderImm(vpn, 9, false)}`, level: 'info' }]
    },
  }
}

const pageOffset: DecodeField = {
  low: 0,
  high: 11,
  name: 'page offset',
  extra: (value) => [
    { msg: `Page offset = ${renderImm(value & ((1n << 12n) - 1n), 12, false)}`, level: 'info' },
  ],
}

const highBitsCheck: (value: bigint, mode: number) => DecodeExtraInfo[] = (value, mode) => {
  const signBit = (value >> BigInt(mode - 1)) & 0x1n
  const highBits = value >> BigInt(mode)
  if (
    (signBit === 0n && highBits !== 0n) ||
    (signBit === 1n && highBits !== (1n << BigInt(64 - mode)) - 1n)
  ) {
    return [
      {
        msg: `Invalid Sv${mode} virtual address: bits 63 to ${mode} must be sign-extended from bit ${mode - 1}`,
        level: 'error',
      },
    ]
  }
  return []
}

export const mmDecoders: DecodeMode[] = [
  {
    name: 'sv32-pte',
    fields: [
      ...pteFlags,
      { low: 10, high: 19, name: 'PPN[0]', extra: rv32PPNExtra },
      { low: 20, high: 31, name: 'PPN[1]' },
      ...rv32PteCommon,
    ],
  },
  {
    name: 'sv32-vaddr',
    fields: [
      pageOffset,
      constructRv32VPN(0),
      constructRv32VPN(1),
      { low: 32, high: 63, type: DecodeFieldType.INVALID },
    ],
  },
  {
    name: 'sv39-pte',
    fields: [
      ...pteFlags,
      { low: 10, high: 18, name: 'PPN[0]', extra: rv64PPNExtra },
      { low: 19, high: 27, name: 'PPN[1]' },
      { low: 28, high: 53, name: 'PPN[2]' },
      ...rv64PteCommon,
    ],
  },
  {
    name: 'sv39-vaddr',
    fields: [
      pageOffset,
      constructRv64VPN(0),
      constructRv64VPN(1),
      constructRv64VPN(2),
      {
        low: 39,
        high: 63,
        type: DecodeFieldType.INVALID,
        extra: (value) => highBitsCheck(value, 39),
      },
    ],
  },
  {
    name: 'sv48-pte',
    fields: [
      ...pteFlags,
      { low: 10, high: 18, name: 'PPN[0]', extra: rv64PPNExtra },
      { low: 19, high: 27, name: 'PPN[1]' },
      { low: 28, high: 36, name: 'PPN[2]' },
      { low: 37, high: 53, name: 'PPN[3]' },
      ...rv64PteCommon,
    ],
  },
  {
    name: 'sv48-vaddr',
    fields: [
      pageOffset,
      constructRv64VPN(0),
      constructRv64VPN(1),
      constructRv64VPN(2),
      constructRv64VPN(3),
      {
        low: 48,
        high: 63,
        type: DecodeFieldType.INVALID,
        extra: (value) => highBitsCheck(value, 48),
      },
    ],
  },
  {
    name: 'sv57-pte',
    fields: [
      ...pteFlags,
      { low: 10, high: 18, name: 'PPN[0]', extra: rv64PPNExtra },
      { low: 19, high: 27, name: 'PPN[1]' },
      { low: 28, high: 36, name: 'PPN[2]' },
      { low: 37, high: 45, name: 'PPN[3]' },
      { low: 46, high: 53, name: 'PPN[4]' },
      ...rv64PteCommon,
    ],
  },
  {
    name: 'sv57-vaddr',
    fields: [
      pageOffset,
      constructRv64VPN(0),
      constructRv64VPN(1),
      constructRv64VPN(2),
      constructRv64VPN(3),
      constructRv64VPN(4),
      {
        low: 57,
        high: 63,
        type: DecodeFieldType.INVALID,
        extra: (value) => highBitsCheck(value, 57),
      },
    ],
  },
]
