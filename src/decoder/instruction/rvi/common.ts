import { DecodeFieldType } from '../../types'
import type { DecodeField } from '../../types'

export const registerNames = [
  'zero',
  'ra',
  'sp',
  'gp',
  'tp',
  't0',
  't1',
  't2',
  's0/fp',
  's1',
  'a0',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  's2',
  's3',
  's4',
  's5',
  's6',
  's7',
  's8',
  's9',
  's10',
  's11',
  't3',
  't4',
  't5',
  't6',
]

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

export const immI: DecodeField[] = [{ name: 'immI[11:0]', low: 20, high: 31 }]

export const immS: DecodeField[] = [
  { name: 'immS[4:0]', low: 7, high: 11 },
  { name: 'immS[11:5]', low: 25, high: 31 },
]

export const immB: DecodeField[] = [
  { name: 'immB[11]', low: 7 },
  { name: 'immB[4:1]', low: 8, high: 11 },
  { name: 'immB[10:5]', low: 25, high: 30 },
  { name: 'immB[12]', low: 31 },
]

export const immU: DecodeField[] = [{ name: 'immU[31:12]', low: 12, high: 31 }]

export const immJ: DecodeField[] = [
  { name: 'immJ[19:12]', low: 12, high: 19 },
  { name: 'immJ[11]', low: 20 },
  { name: 'immJ[10:1]', low: 21, high: 30 },
  { name: 'immJ[20]', low: 31 },
]

export const uimm: DecodeField = {
  name: 'uimm',
  low: 15,
  high: 19,
  value: [...Array(16).keys()].map((x) => x.toString(16)),
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
export const fRegisterNames = [
  'ft0',
  'ft1',
  'ft2',
  'ft3',
  'ft4',
  'ft5',
  'ft6',
  'ft7',
  'fs0',
  'fs1',
  'fa0',
  'fa1',
  'fa2',
  'fa3',
  'fa4',
  'fa5',
  'fa6',
  'fa7',
  'fs2',
  'fs3',
  'fs4',
  'fs5',
  'fs6',
  'fs7',
  'fs8',
  'fs9',
  'fs10',
  'fs11',
  'ft8',
  'ft9',
  'ft10',
  'ft11',
]

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
  value: [...Array(4096).keys()].map((x) => x.toString(16)),
}
