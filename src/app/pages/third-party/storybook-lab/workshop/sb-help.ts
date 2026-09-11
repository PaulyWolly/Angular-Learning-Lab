export type SbRegion = 'sidebar' | 'canvas' | 'controls' | 'actions' | 'docs';
export type SbAddon = 'controls' | 'actions' | 'docs';

export interface TutorialStep {
  id: string;
  title: string;
  body: string;
  region: SbRegion;
  addon?: SbAddon;
  storyId?: string;
}

export const REGION_HELP: Record<SbRegion, { title: string; body: string }> = {
  sidebar: {
    title: 'Sidebar — the story tree',
    body: 'Each row is one story: one component + one set of args. Click Primary, then Disabled — same button, different state. In a real repo this tree is generated from *.stories.ts files.',
  },
  canvas: {
    title: 'Canvas — isolated render',
    body: 'Only this component mounts. No router, no layout chrome. That is the point of Storybook: review UI without walking the whole app. Click the button to fire an action.',
  },
  controls: {
    title: 'Controls — live args',
    body: 'These fields map to @Input() / input() on the component. Change label or variant and the canvas updates. In CSF that object is the story’s args.',
  },
  actions: {
    title: 'Actions — event log',
    body: 'Storybook’s Actions addon records outputs (clicked, submit). Click the button in the canvas — a row appears here. You do not write a parent page just to see an output fire.',
  },
  docs: {
    title: 'Docs — CSF next to the UI',
    body: 'Component Story Format (CSF) is a stories.ts file: default meta + named exports. Real Storybook Docs tab renders this as markdown + live examples.',
  },
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'This is a Storybook workshop',
    body: 'Storybook is a separate UI (usually localhost:6006) where you open one component at a time. This lab embeds that interface so you can click it. Use Next to walk each pane — or click any pane for context-sensitive help.',
    region: 'canvas',
    addon: 'controls',
    storyId: 'primary',
  },
  {
    id: 'sidebar',
    title: 'Pick a story',
    body: 'The left tree is your catalog. We opened Disabled for you — a state that is annoying to reach in a real form. Click other stories anytime; help on the right follows what you select.',
    region: 'sidebar',
    addon: 'controls',
    storyId: 'disabled',
  },
  {
    id: 'canvas',
    title: 'The canvas is the component',
    body: 'Whatever you see here is the Angular component, not a screenshot. Toolbar bits (background, outline) exist in real Storybook too — they do not change your production app.',
    region: 'canvas',
    addon: 'controls',
    storyId: 'primary',
  },
  {
    id: 'controls',
    title: 'Twist the args',
    body: 'Change the label to “Publish” or flip variant to danger. You are editing args, not the component class. That is how designers and engineers share one button with many looks.',
    region: 'controls',
    addon: 'controls',
    storyId: 'primary',
  },
  {
    id: 'actions',
    title: 'Outputs show up as actions',
    body: 'Click the button in the canvas. The Actions tab logs clicked("…"). In a real Storybook file you add parameters.actions or use fn() from storybook/test.',
    region: 'actions',
    addon: 'actions',
    storyId: 'primary',
  },
  {
    id: 'docs',
    title: 'CSF is just TypeScript',
    body: 'Docs shows the story file you would commit. title + component in meta, then export const Primary = { args }. Init the real tool later with npx storybook@latest init.',
    region: 'docs',
    addon: 'docs',
    storyId: 'primary',
  },
];
