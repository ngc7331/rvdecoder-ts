import type { DecodeCategory } from '@/types/decoder'

import { generalDecoders } from './general'
import { instructionDecoders } from './instruction'
import { mModeCSRDecoders, sModeCSRDecoders } from './csr'

export const decoders: DecodeCategory[] = [
  {
    name: 'general',
    items: generalDecoders,
  },
  {
    name: 'instruction',
    items: instructionDecoders,
  },
  {
    name: 'm-mode csr',
    items: mModeCSRDecoders,
  },
  {
    name: 's-mode csr',
    items: sModeCSRDecoders,
  },
]
