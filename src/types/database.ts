export interface Event {
  id: string;
  name: string;
  template: "classic" | "modern" | "custom";
  created_at: string;
}