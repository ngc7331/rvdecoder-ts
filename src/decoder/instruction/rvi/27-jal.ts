import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, immJ } from './common'

export const jalFields: (DecodeField | ConditionalDecodeMode)[] = [rd, ...immJ]
