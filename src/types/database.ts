export interface Event {
  id: string;
  name: string;
  template: "classic" | "modern" | "custom";
  created_at: string;
}
export interface DatabaseParticipant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  created_at: string;
}