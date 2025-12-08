export interface IAds {
  id: number;
  title: string;
  description: string;
  type: "navbar" | "side";
  status: boolean;
  file: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  file_url: string;
}