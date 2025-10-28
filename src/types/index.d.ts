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
  city?: string;
  state?: string;
  zip?: string;
}
