import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

import { rd, immU } from './common'

export const luiFields: (DecodeField | ConditionalDecodeMode)[] = [rd, ...immU]
