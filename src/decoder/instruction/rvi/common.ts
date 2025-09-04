import { DecodeFieldType } from '@/types/decoder'

import type { DecodeField } from '@/types/decoder'

import { renderImm } from '@/decoder/utils/renderImm'

import { registerNames, fRegisterNames, csrNames } from '../common'

export const rd: DecodeField = { name: 'rd', low: 7, high: 11, value: registerNames }

export const rs1: DecodeField = { name: 'rs1', low: 15, high: 19, value: registerNames }

export const rs2: DecodeField = { name: 'rs2', low: 20, high: 24, value: registerNames }

export const rdRsvd: DecodeField = {
  type: DecodeFieldType.RESERVED,
  low: 7,
  high: 11,
}

export const rs1Rsvd: DecodeField = {
  type: DecodeFieldType.RESERVED,
  low: 15,
  high: 19,
}

export const immI: DecodeField[] = [
  {
    name: 'immI[11:0]',
    low: 20,
    high: 31,
    extra: (value) => {
      const imm = (value >> 20n) & 0xfffn
      return [{ msg: `Immediate(I-type) = ${renderImm(imm, 12)}`, level: 'info' }]
    },
  },
]

export const immS: DecodeField[] = [
  {
    name: 'immS[4:0]',
    low: 7,
    high: 11,
    extra: (value) => {
      const imm4_0 = (value >> 7n) & 0x1fn
      const imm11_5 = (value >> 25n) & 0x7fn
      const imm = (imm11_5 << 5n) | imm4_0
      return [{ msg: `Immediate(S-type) = ${renderImm(imm, 12)}`, level: 'info' }]
    },
  },
  { name: 'immS[11:5]', low: 25, high: 31 },
]

export const immB: DecodeField[] = [
  {
    name: 'immB[11]',
    low: 7,
    extra: (value) => {
      const imm11 = (value >> 7n) & 0x1n
      const imm4_1 = (value >> 8n) & 0xfn
      const imm10_5 = (value >> 25n) & 0x3fn
      const imm12 = (value >> 31n) & 0x1n
      const imm = (imm12 << 12n) | (imm11 << 11n) | (imm10_5 << 5n) | (imm4_1 << 1n)
      return [{ msg: `Immediate(B-type) = ${renderImm(imm, 13)}`, level: 'info' }]
    },
  },
  { name: 'immB[4:1]', low: 8, high: 11 },
  { name: 'immB[10:5]', low: 25, high: 30 },
  { name: 'immB[12]', low: 31 },
]

export const immU: DecodeField[] = [
  {
    name: 'immU[31:12]',
    low: 12,
    high: 31,
    extra: (value) => {
      const imm = value & 0xfffff000n
      return [{ msg: `Immediate(U-type) = ${renderImm(imm, 32)}`, level: 'info' }]
    },
  },
]

export const immJ: DecodeField[] = [
  {
    name: 'immJ[19:12]',
    low: 12,
    high: 19,
    extra: (value) => {
      const imm19_12 = (value >> 12n) & 0xffn
      const imm11 = (value >> 20n) & 0x1n
      const imm10_1 = (value >> 21n) & 0x3ffn
      const imm20 = (value >> 31n) & 0x1n
      const imm = (imm20 << 20n) | (imm19_12 << 12n) | (imm11 << 11n) | (imm10_1 << 1n)
      return [{ msg: `Immediate(J-type) = ${renderImm(imm, 20)}`, level: 'info' }]
    },
  },
  { name: 'immJ[11]', low: 20 },
  { name: 'immJ[10:1]', low: 21, high: 30 },
  { name: 'immJ[20]', low: 31 },
]

export const uimm: DecodeField = {
  name: 'uimm',
  low: 15,
  high: 19,
  extra: (value) => {
    const uimm = (value >> 15n) & 0x1fn
    return [{ msg: `Immediate = ${renderImm(uimm, 5, false)}`, level: 'info' }]
  },
}

export const funct3: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct3',
  low: 12,
  high: 14,
  value,
})

export const funct7: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct7',
  low: 25,
  high: 31,
  value,
})

export const funct6: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct6',
  low: 26,
  high: 31,
  value,
})

export const shamt5: DecodeField = {
  name: 'shamt',
  low: 20,
  high: 24,
  value: [...Array(32).keys()].map((x) => x.toString()),
}

export const shamt6: DecodeField = {
  name: 'shamt',
  low: 20,
  high: 25,
  value: [...Array(64).keys()].map((x) => x.toString()),
}

// floating point
export const frd: DecodeField = { name: 'rd', low: 7, high: 11, value: fRegisterNames }

export const frs1: DecodeField = { name: 'rs1', low: 15, high: 19, value: fRegisterNames }

export const frs2: DecodeField = { name: 'rs2', low: 20, high: 24, value: fRegisterNames }

export const frs3: DecodeField = { name: 'rs3', low: 27, high: 31, value: fRegisterNames }

export const frm: DecodeField = {
  name: 'rm',
  low: 12,
  high: 14,
  value: ['RNE', 'RTZ', 'RDN', 'RUP', 'RMM', 'Reserved', 'Reserved', 'DYN'],
}

export const frs2Rsvd: DecodeField = {
  type: DecodeFieldType.RESERVED,
  low: 20,
  high: 24,
}

export const frmRsvd: DecodeField = {
  type: DecodeFieldType.RESERVED,
  low: 12,
  high: 14,
}

export const funct2: (value?: string[] | Map<bigint, string>) => DecodeField = (value) => ({
  name: 'funct2',
  low: 25,
  high: 26,
  value,
})

export const fdestPrecision: DecodeField = {
  name: 'Dest precision',
  low: 25,
  high: 26,
  value: ['S', 'D', 'H', 'Q'],
}

export const fdestXPrecision: DecodeField = {
  name: 'Dest length',
  low: 25,
  high: 26,
  value: ['W', 'WU', 'L', 'LU'],
}

export const fsrcPrecision: DecodeField = {
  name: 'Source precision',
  low: 20,
  high: 21,
  value: ['S', 'D', 'H', 'Q'],
}

export const fsrcXPrecision: DecodeField = {
  name: 'Source length',
  low: 20,
  high: 21,
  value: ['W', 'WU', 'L', 'LU'],
}

export const fsrcPrecisionUpperRsvd: DecodeField = {
  type: DecodeFieldType.RESERVED,
  low: 22,
  high: 24,
}

// csr
export const csr: DecodeField = {
  name: 'csr',
  low: 20,
  high: 31,
  value: csrNames,
  extra: (value) => {
    const csr = value >> 20n
    const csr11_10 = (csr >> 10n) & 0x3n
    const csr9_8 = (csr >> 8n) & 0x3n
    const csr7_6 = (csr >> 6n) & 0x3n
    const csr11_4 = (csr >> 4n) & 0xffn

    let type
    if (csr11_4 === 0b01111010n) {
      type = 'Machine-level Standard read/write Debug'
    } else if (csr11_4 === 0b01111011n) {
      type = 'Machine-level Debug-mode-only'
    } else {
      const custom = (
        csr9_8 === 0b00n
          ? csr11_10 === 0b10n || (csr11_10 === 0b11n && csr7_6 === 0b11n)
          : csr11_10 !== 0b00n && csr7_6 === 0b11n
      )
        ? 'Custom'
        : 'Standard'
      const perm = csr11_10 === 0b11n ? 'read-only' : 'read/write'
      const level =
        csr9_8 === 0b11n
          ? 'Machine'
          : csr9_8 === 0b10n
            ? 'Hypervisor'
            : csr9_8 === 0b01n
              ? 'Supervisor'
              : 'User'
      type = `${level} ${custom} ${perm}`
    }

    return [{ msg: `CSR @ 0x${csr.toString(16)} : ${type}`, level: 'info' }]
  },
}
