import type { DecodeField, ConditionalDecodeMode } from '@/types/decoder'

import { rd, immJ } from './common'

export const jalFields: (DecodeField | ConditionalDecodeMode)[] = [rd, ...immJ]
