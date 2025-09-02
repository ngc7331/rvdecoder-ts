import type { DecodeField } from '@/types/decoder'
import { renderImm } from '@/decoder/utils/renderImm'

import { registerNames, fRegisterNames } from '../common'

export const rds1: DecodeField = { name: "rd'", low: 2, high: 4, value: registerNames.slice(8, 16) }

export const rs1s: DecodeField = {
  name: "rs1'",
  low: 7,
  high: 9,
  value: registerNames.slice(8, 16),
}

export const rs1srds: DecodeField = {
  name: "rs1'/rd'",
  low: 7,
  high: 9,
  value: registerNames.slice(8, 16),
}

export const rs2s: DecodeField = {
  name: "rs2'",
  low: 2,
  high: 4,
  value: registerNames.slice(8, 16),
}

export const rds2: DecodeField = { name: "rd'", low: 7, high: 9, value: registerNames.slice(8, 16) }

export const rd: DecodeField = { name: 'rd', low: 7, high: 11, value: registerNames }

export const rs1: DecodeField = { name: 'rs1', low: 7, high: 11, value: registerNames }

export const rs1rd: DecodeField = { name: 'rs1/rd', low: 7, high: 11, value: registerNames }

export const rs2: DecodeField = { name: 'rs2', low: 2, high: 6, value: registerNames }

export const frds1: DecodeField = {
  name: "rd'",
  low: 2,
  high: 4,
  value: fRegisterNames.slice(8, 16),
}

export const frs1s: DecodeField = {
  name: "rs1'",
  low: 7,
  high: 9,
  value: fRegisterNames.slice(8, 16),
}

export const frs2s: DecodeField = {
  name: "rs2'",
  low: 2,
  high: 4,
  value: fRegisterNames.slice(8, 16),
}

export const frds2: DecodeField = {
  name: "rd'",
  low: 7,
  high: 9,
  value: fRegisterNames.slice(8, 16),
}

export const frd: DecodeField = { name: 'rd', low: 7, high: 11, value: fRegisterNames }

export const frs1: DecodeField = { name: 'rs1', low: 7, high: 11, value: fRegisterNames }

export const frs2: DecodeField = { name: 'rs2', low: 2, high: 6, value: fRegisterNames }

export const funct3: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct3',
  low: 13,
  high: 15,
  value,
})

export const funct4_0: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct4[0]',
  low: 12,
  value,
})

export const funct6_2_0: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct6[2:0]',
  low: 10,
  high: 12,
  value,
})

export const funct2H: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct2H',
  low: 10,
  high: 11,
  value,
})

export const funct2L: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct2L',
  low: 5,
  high: 6,
  value,
})

// type CIW: 12:5 -> 5:4|9:6|2|3
export const uimmCIW: DecodeField[] = [
  {
    name: 'uimm[3]',
    low: 5,
    extra: (value) => {
      const imm3 = (value >> 5n) & 0x1n
      const imm2 = (value >> 6n) & 0x1n
      const imm9_6 = (value >> 7n) & 0xfn
      const imm5_4 = (value >> 11n) & 0x3n
      const imm = (imm9_6 << 6n) | (imm5_4 << 4n) | (imm3 << 3n) | (imm2 << 2n)
      return [{ msg: `Immediate(CIW-type): ${renderImm(imm, 10, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[2]', low: 6 },
  { name: 'uimm[9:6]', low: 7, high: 10 },
  { name: 'uimm[5:4]', low: 11, high: 12 },
]

// type CLS/1: 12:10 -> 5:3, 6:5 -> 2|6
export const uimmCLS1: DecodeField[] = [
  {
    name: 'uimm[6]',
    low: 5,
    extra: (value) => {
      const imm6 = (value >> 5n) & 0x1n
      const imm2 = (value >> 6n) & 0x1n
      const imm5_3 = (value >> 10n) & 0x7n
      const imm = (imm6 << 6n) | (imm5_3 << 3n) | (imm2 << 2n)
      return [{ msg: `Immediate(CLS/1-type): ${renderImm(imm, 7, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[2]', low: 6 },
  { name: 'uimm[5:3]', low: 10, high: 12 },
]

// type CLS/2: 12:10 -> 5:3, 6:5 -> 7:6
export const uimmCLS2: DecodeField[] = [
  {
    name: 'uimm[7:6]',
    low: 5,
    high: 6,
    extra: (value) => {
      const imm7_6 = (value >> 5n) & 0x3n
      const imm5_3 = (value >> 10n) & 0x7n
      const imm = (imm7_6 << 6n) | (imm5_3 << 3n)
      return [{ msg: `Immediate(CLS/2-type): ${renderImm(imm, 8, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[5:3]', low: 10, high: 12 },
]

// type CLS/3: 12:10 -> 5:4|8, 6:5 -> 7:6
export const uimmCLS3: DecodeField[] = [
  {
    name: 'uimm[7:6]',
    low: 5,
    high: 6,
    extra: (value) => {
      const imm7_6 = (value >> 5n) & 0x3n
      const imm8 = (value >> 10n) & 0x1n
      const imm5_4 = (value >> 11n) & 0x3n
      const imm = (imm8 << 8n) | (imm7_6 << 6n) | (imm5_4 << 4n)
      return [{ msg: `Immediate(CLS/3-type): ${renderImm(imm, 9, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[8]', low: 10 },
  { name: 'uimm[5:4]', low: 11, high: 12 },
]

// type CSL/1: 12->5, 6:2 -> 4:2|7:6
export const uimmCSL1: DecodeField[] = [
  {
    name: 'uimm[7:6]',
    low: 2,
    high: 3,
    extra: (value) => {
      const imm7_6 = (value >> 2n) & 0x3n
      const imm4_2 = (value >> 4n) & 0x7n
      const imm5 = (value >> 12n) & 0x1n
      const imm = (imm7_6 << 6n) | (imm5 << 5n) | (imm4_2 << 2n)
      return [{ msg: `Immediate(CSL/1-type): ${renderImm(imm, 8, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[4:2]', low: 4, high: 6 },
  { name: 'uimm[5]', low: 12 },
]

// type CSL/2: 12->5, 6:2 -> 4:3|8:6
export const uimmCSL2: DecodeField[] = [
  {
    name: 'uimm[8:6]',
    low: 2,
    high: 4,
    extra: (value) => {
      const imm8_6 = (value >> 2n) & 0x7n
      const imm4_3 = (value >> 5n) & 0x3n
      const imm5 = (value >> 12n) & 0x1n
      const imm = (imm8_6 << 6n) | (imm5 << 5n) | (imm4_3 << 3n)
      return [{ msg: `Immediate(CSL/2-type): ${renderImm(imm, 9, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[4:3]', low: 5, high: 6 },
  { name: 'uimm[5]', low: 12 },
]

// type CSL/3: 12->5, 6:2 -> 4|9:6
export const uimmCSL3: DecodeField[] = [
  {
    name: 'uimm[9:6]',
    low: 2,
    high: 5,
    extra: (value) => {
      const imm9_6 = (value >> 2n) & 0xfn
      const imm4 = (value >> 6n) & 0x1n
      const imm5 = (value >> 12n) & 0x1n
      const imm = (imm9_6 << 6n) | (imm5 << 5n) | (imm4 << 4n)
      return [{ msg: `Immediate(CSL/3-type): ${renderImm(imm, 10, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[4]', low: 6 },
  { name: 'uimm[5]', low: 12 },
]

// type CSS/1: 12:7 -> 5:2|7:6
export const uimmCSS1: DecodeField[] = [
  {
    name: 'uimm[7:6]',
    low: 7,
    high: 8,
    extra: (value) => {
      const imm7_6 = (value >> 7n) & 0x3n
      const imm5_2 = (value >> 9n) & 0xfn
      const imm = (imm7_6 << 6n) | (imm5_2 << 2n)
      return [{ msg: `Immediate(CSS/1-type): ${renderImm(imm, 8, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[5:2]', low: 9, high: 12 },
]

// type CSS/2: 12:7 -> 5:3|8:6
export const uimmCSS2: DecodeField[] = [
  {
    name: 'uimm[8:6]',
    low: 7,
    high: 9,
    extra: (value) => {
      const imm8_6 = (value >> 7n) & 0x7n
      const imm5_3 = (value >> 10n) & 0x7n
      const imm = (imm8_6 << 6n) | (imm5_3 << 3n)
      return [{ msg: `Immediate(CSS/2-type): ${renderImm(imm, 9, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[5:3]', low: 10, high: 12 },
]

// type CSS/3: 12:7 -> 5:4|9:6
export const uimmCSS3: DecodeField[] = [
  {
    name: 'uimm[9:6]',
    low: 7,
    high: 10,
    extra: (value) => {
      const imm9_6 = (value >> 7n) & 0xfn
      const imm5_4 = (value >> 11n) & 0x3n
      const imm = (imm9_6 << 6n) | (imm5_4 << 4n)
      return [{ msg: `Immediate(CSS/3-type): ${renderImm(imm, 10, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[5:4]', low: 11, high: 12 },
]

// type CI/1: 12->5, 6:2 -> 4:0
export const immCI1: DecodeField[] = [
  {
    name: 'imm[4:0]',
    low: 2,
    high: 6,
    extra: (value) => {
      const imm4_0 = (value >> 2n) & 0x1fn
      const imm5 = (value >> 12n) & 0x1n
      const imm = (imm5 << 5n) | imm4_0
      return [{ msg: `Immediate(CI/1-type): ${renderImm(imm, 6)}`, level: 'info' }]
    },
  },
  { name: 'imm[5]', low: 12 },
]

export const uimmCI1: DecodeField[] = [
  {
    name: 'uimm[4:0]',
    low: 2,
    high: 6,
    extra: (value) => {
      const imm4_0 = (value >> 2n) & 0x1fn
      const imm5 = (value >> 12n) & 0x1n
      const imm = (imm5 << 5n) | imm4_0
      return [{ msg: `Immediate(CI/1-type): ${renderImm(imm, 6, false)}`, level: 'info' }]
    },
  },
  { name: 'uimm[5]', low: 12 },
]

// type CI/2: 12->9, 6:2 -> 4|6|8:7|5
export const immCI2: DecodeField[] = [
  {
    name: 'imm[5]',
    low: 2,
    extra: (value) => {
      const imm5 = (value >> 2n) & 0x1n
      const imm8_7 = (value >> 3n) & 0x3n
      const imm6 = (value >> 5n) & 0x1n
      const imm4 = (value >> 6n) & 0x1n
      const imm9 = (value >> 12n) & 0x1n
      const imm = (imm9 << 9n) | (imm8_7 << 7n) | (imm6 << 6n) | (imm5 << 5n) | (imm4 << 4n)
      return [{ msg: `Immediate(CI/2-type): ${renderImm(imm, 10)}`, level: 'info' }]
    },
  },
  { name: 'imm[8:7]', low: 3, high: 4 },
  { name: 'imm[6]', low: 5 },
  { name: 'imm[4]', low: 6 },
  { name: 'imm[9]', low: 12 },
]

// type CI/3: 12->17, 6:2 -> 16:12
export const immCI3: DecodeField[] = [
  {
    name: 'imm[16:12]',
    low: 2,
    high: 6,
    extra: (value) => {
      const imm16_12 = (value >> 2n) & 0x1fn
      const imm17 = (value >> 12n) & 0x1n
      const imm = (imm17 << 17n) | (imm16_12 << 12n)
      return [{ msg: `Immediate(CI/3-type): ${renderImm(imm, 18)}`, level: 'info' }]
    },
  },
  { name: 'imm[17]', low: 12 },
]

// type CJ: 12:2 -> 11|4|9:8|10|6|7|3:1|5
export const immCJ: DecodeField[] = [
  {
    name: 'imm[5]',
    low: 2,
    extra: (value) => {
      const imm5 = (value >> 2n) & 0x1n
      const imm3_1 = (value >> 3n) & 0x7n
      const imm7 = (value >> 6n) & 0x1n
      const imm6 = (value >> 7n) & 0x1n
      const imm10 = (value >> 8n) & 0x1n
      const imm9_8 = (value >> 9n) & 0x3n
      const imm4 = (value >> 11n) & 0x1n
      const imm11 = (value >> 12n) & 0x1n

      const imm =
        (imm11 << 11n) |
        (imm4 << 4n) |
        (imm9_8 << 8n) |
        (imm10 << 10n) |
        (imm6 << 6n) |
        (imm7 << 7n) |
        (imm3_1 << 1n) |
        (imm5 << 5n)
      return [{ msg: `Immediate(CJ-type): ${renderImm(imm, 12)}`, level: 'info' }]
    },
  },
  { name: 'imm[3:1]', low: 3, high: 5 },
  { name: 'imm[7]', low: 6 },
  { name: 'imm[6]', low: 7 },
  { name: 'imm[10]', low: 8 },
  { name: 'imm[9:8]', low: 9, high: 10 },
  { name: 'imm[4]', low: 11 },
  { name: 'imm[11]', low: 12 },
]

// type CB: 12:10 -> 8|4:3, 6:2 -> 7:6|2:1|5
export const immCB: DecodeField[] = [
  {
    name: 'imm[5]',
    low: 2,
    extra: (value) => {
      const imm5 = (value >> 2n) & 0x1n
      const imm2_1 = (value >> 3n) & 0x3n
      const imm7_6 = (value >> 5n) & 0x3n
      const imm4_3 = (value >> 10n) & 0x3n
      const imm8 = (value >> 12n) & 0x1n

      const imm = (imm8 << 8n) | (imm7_6 << 6n) | (imm5 << 5n) | (imm4_3 << 3n) | (imm2_1 << 1n)
      return [{ msg: `Immediate(CB-type): ${renderImm(imm, 9)}`, level: 'info' }]
    },
  },
  { name: 'imm[2:1]', low: 3, high: 4 },
  { name: 'imm[7:6]', low: 5, high: 6 },
  { name: 'imm[4:3]', low: 10, high: 11 },
  { name: 'imm[8]', low: 12 },
]

export const rdIsZero: (value: bigint) => boolean = (value) => {
  const rd = (value >> 7n) & 0x1fn
  return rd === 0n
}

export const rdIssp: (value: bigint) => boolean = (value) => {
  const rd = (value >> 7n) & 0x1fn
  return rd === 2n
}

export const uimmCIWIsZero: (value: bigint) => boolean = (value) => {
  const bit12_5 = (value >> 5n) & 0xffn
  return bit12_5 === 0n
}

export const immCIIsZero: (value: bigint) => boolean = (value) => {
  const bit12 = (value >> 12n) & 1n
  const bit6_2 = (value >> 2n) & 0x1fn
  return bit12 === 0n && bit6_2 === 0n
}
