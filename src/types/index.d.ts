export interface ActionLink {
  label: string;
  url: string;
}

export interface Issue {
  id: string;
  label: string;
  actions: ActionLink[];
}
