export interface Tab {
  id: number
  name: string
  hexInput: string
  errorMessage: string
  selectedDecoders: Set<string>
}
