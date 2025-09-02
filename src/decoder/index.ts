import type { DecodeCategory } from '@/types/decoder'

import { generalDecoders } from './general'
import { csrDecoders } from './csr'
import { instructionDecoders } from './instruction'

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
    name: 'csr',
    items: csrDecoders,
  },
]
