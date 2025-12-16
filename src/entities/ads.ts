export interface IAds {
  id: number
  title: string
  description: string
  type: 'side' | 'navbar'
  status: boolean
  file: string
  created_at: string
  updated_at: string
  is_active: boolean
  cta_link: null
  cta_text: null
  file_url: string
}
