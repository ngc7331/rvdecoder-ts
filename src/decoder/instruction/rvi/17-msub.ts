import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { frd, frm, frs1, frs2, frs3, fdestPrecision } from './common'

export const msubFields: (DecodeField | ConditionalDecodeMode)[] = [
  frd,
  frm,
  frs1,
  frs2,
  frs3,
  fdestPrecision,
]
