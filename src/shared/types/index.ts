export interface DemoScenario {
  id: string;
  page: string;
  state: string;
  overlay: string | null;
  figma: { desktop?: string; mobile?: string };
}

export interface DemoPage {
  id: string;
  path: string;
  title: string;
  available: boolean;
  scenarios: readonly DemoScenario[];
}
