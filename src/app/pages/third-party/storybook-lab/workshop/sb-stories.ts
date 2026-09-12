import { SbSize, SbVariant } from './sb-button.component';

export interface SbButtonArgs {
  label: string;
  variant: SbVariant;
  size: SbSize;
  disabled: boolean;
}

export interface SbStory {
  id: string;
  name: string;
  group: string;
  args: SbButtonArgs;
  docs: string;
  help: string;
}

export const SB_STORIES: SbStory[] = [
  {
    id: 'primary',
    name: 'Primary',
    group: 'Lab/Button',
    args: { label: 'Save', variant: 'primary', size: 'md', disabled: false },
    docs: 'Default call-to-action. Teams start a Button story file with this variant.',
    help: 'Primary is the happy-path story — the default args in button.component.stories.ts.',
  },
  {
    id: 'secondary',
    name: 'Secondary',
    group: 'Lab/Button',
    args: { label: 'Cancel', variant: 'secondary', size: 'md', disabled: false },
    docs: 'Quiet action next to a primary button. Same component, different args.variant.',
    help: 'Secondary proves one component can cover many looks by changing args — not by forking the class.',
  },
  {
    id: 'danger',
    name: 'Danger',
    group: 'Lab/Button',
    args: { label: 'Delete', variant: 'danger', size: 'md', disabled: false },
    docs: 'Destructive action. Designers review this next to Primary so contrast stays honest.',
    help: 'Danger is an edge state you want in the catalog so QA never has to hunt for it in the app.',
  },
  {
    id: 'disabled',
    name: 'Disabled',
    group: 'Lab/Button',
    args: { label: 'Save', variant: 'primary', size: 'md', disabled: true },
    docs: 'Unavailable CTA. Storybook shines here — you do not need a full form to see disabled.',
    help: 'Disabled is why Storybook exists: isolate a hard-to-reach UI state without walking a user flow.',
  },
  {
    id: 'large',
    name: 'Large',
    group: 'Lab/Button',
    args: { label: 'Continue', variant: 'primary', size: 'lg', disabled: false },
    docs: 'Size token as an arg. Controls let you flip sm / md / lg without editing the story file.',
    help: 'Large is a size story. Use Controls to try sm and md — that is the Args table in real Storybook.',
  },
];

export function storyCsf(story: SbStory): string {
  return `import type { Meta, StoryObj } from '@storybook/angular';
import { SbButtonComponent } from './sb-button.component';

const meta: Meta<SbButtonComponent> = {
  title: '${story.group}',
  component: SbButtonComponent,
};
export default meta;

type Story = StoryObj<SbButtonComponent>;

export const ${story.name}: Story = {
  args: {
    label: '${story.args.label}',
    variant: '${story.args.variant}',
    size: '${story.args.size}',
    disabled: ${story.args.disabled},
  },
};`;
}
