export interface ActionLink {
  label: string;
  url: string;
}

export interface Issue {
  id: string;
  label: string;
  description?: string;
  actions: ActionLink[];
}

export interface Location {
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}
