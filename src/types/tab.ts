export interface Tab {
  id: string
  name: string
  hexInput: string
  errorMessage: string
  selectedDecoders: Set<string>
}
