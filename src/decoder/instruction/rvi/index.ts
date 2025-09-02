import { DecodeFieldType } from '../../../types/decoder'
import type { DecodeField, ConditionalDecodeMode } from '../../../types/decoder'

import { loadFields } from './00-load'
import { loadFpFields } from './01-load-fp'
import { custom0Fields } from './02-custom-0'
import { miscMemFields } from './03-misc-mem'
import { opImmFields } from './04-op-imm'
import { auipcFields } from './05-auipc'
import { opImm32Fields } from './06-op-imm-32'
import { reserved7Fields } from './07-reserved'
import { storeFields } from './08-store'
import { storeFpFields } from './09-store-fp'
import { custom1Fields } from './10-custom-1'
import { amoFields } from './11-amo'
import { opFields } from './12-op'
import { luiFields } from './13-lui'
import { op32Fields } from './14-op-32'
import { reserved15Fields } from './15-reserved'
import { maddFields } from './16-madd'
import { msubFields } from './17-msub'
import { nmsubFields } from './18-nmsub'
import { nmaddFields } from './19-nmadd'
import { opFpFields } from './20-op-fp'
import { opVFields } from './21-op-v'
import { custom2Fields } from './22-custom-2'
import { reserved23Fields } from './23-reserved'
import { branchFields } from './24-branch'
import { jalrFields } from './25-jalr'
import { reserved26Fields as reserved26Fields } from './26-reserved'
import { jalFields } from './27-jal'
import { systemFields } from './28-system'
import { opVeFields } from './29-op-ve'
import { custom3Fields } from './30-custom-3'
import { reserved31Fields } from './31-reserved'

export const rviFields: (DecodeField | ConditionalDecodeMode)[] = [
  {
    low: 2,
    high: 6,
    name: 'opcode[6:2]',
    value: [
      'LOAD',
      'LOAD-FP',
      'custom-0',
      'MISC-MEM',
      'OP-IMM',
      'AUIPC',
      'OP-IMM-32',
      'Reserved',
      'STORE',
      'STORE-FP',
      'custom-1',
      'AMO',
      'OP',
      'LUI',
      'OP-32',
      'Reserved',
      'MADD',
      'MSUB',
      'NMSUB',
      'NMADD',
      'OP-FP',
      'OP-V',
      'custom-2',
      'Reserved',
      'BRANCH',
      'JALR',
      'Reserved',
      'JAL',
      'SYSTEM',
      'OP-VE',
      'custom-3',
      'Reserved',
    ],
  },
  {
    name: 'LOAD',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(0),
    },
    fields: loadFields,
  },
  {
    name: 'LOAD-FP',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(1),
    },
    fields: loadFpFields,
  },
  {
    name: 'custom-0',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(2),
    },
    fields: custom0Fields,
  },
  {
    name: 'MISC-MEM',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(3),
    },
    fields: miscMemFields,
  },
  {
    name: 'OP-IMM',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(4),
    },
    fields: opImmFields,
  },
  {
    name: 'AUIPC',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(5),
    },
    fields: auipcFields,
  },
  {
    name: 'OP-IMM-32',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(6),
    },
    fields: opImm32Fields,
  },
  {
    name: 'Reserved',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(7),
    },
    fields: reserved7Fields,
  },
  {
    name: 'STORE',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(8),
    },
    fields: storeFields,
  },
  {
    name: 'STORE-FP',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(9),
    },
    fields: storeFpFields,
  },
  {
    name: 'custom-1',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(10),
    },
    fields: custom1Fields,
  },
  {
    name: 'AMO',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(11),
    },
    fields: amoFields,
  },
  {
    name: 'OP',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(12),
    },
    fields: opFields,
  },
  {
    name: 'LUI',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(13),
    },
    fields: luiFields,
  },
  {
    name: 'OP-32',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(14),
    },
    fields: op32Fields,
  },
  {
    name: 'Reserved',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(15),
    },
    fields: reserved15Fields,
  },
  {
    name: 'MADD',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(16),
    },
    fields: maddFields,
  },
  {
    name: 'MSUB',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(17),
    },
    fields: msubFields,
  },
  {
    name: 'NMSUB',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(18),
    },
    fields: nmsubFields,
  },
  {
    name: 'NMADD',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(19),
    },
    fields: nmaddFields,
  },
  {
    name: 'OP-FP',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(20),
    },
    fields: opFpFields,
  },
  {
    name: 'OP-V',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(21),
    },
    fields: opVFields,
  },
  {
    name: 'custom-2',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(22),
    },
    fields: custom2Fields,
  },
  {
    name: 'Reserved',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(23),
    },
    fields: reserved23Fields,
  },
  {
    name: 'BRANCH',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(24),
    },
    fields: branchFields,
  },
  {
    name: 'JALR',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(25),
    },
    fields: jalrFields,
  },
  {
    name: 'Reserved',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(26),
    },
    fields: reserved26Fields,
  },
  {
    name: 'JAL',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(27),
    },
    fields: jalFields,
  },
  {
    name: 'SYSTEM',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(28),
    },
    fields: systemFields,
  },
  {
    name: 'OP-VE',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(29),
    },
    fields: opVeFields,
  },
  {
    name: 'custom-3',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(30),
    },
    fields: custom3Fields,
  },
  {
    name: 'Reserved',
    condition: {
      field: 'opcode[6:2]',
      value: BigInt(31),
    },
    fields: reserved31Fields,
  },
  { low: 32, high: 63, type: DecodeFieldType.INVALID },
]
