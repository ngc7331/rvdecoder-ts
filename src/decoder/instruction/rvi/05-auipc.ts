import type { DecodeField, ConditionalDecodeMode } from '../../types'
import { rd, immU } from './common'

export const auipcFields: (DecodeField | ConditionalDecodeMode)[] = [rd, ...immU]
