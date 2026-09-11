import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { SbButtonComponent, SbSize, SbVariant } from './workshop/sb-button.component';
import { REGION_HELP, SbAddon, SbRegion, TUTORIAL_STEPS } from './workshop/sb-help';
import { SB_STORIES, SbButtonArgs, storyCsf } from './workshop/sb-stories';

@Component({
  selector: 'app-storybook-lab',
  standalone: true,
  imports: [FormsModule, LessonBreadcrumbComponent, LessonSyntaxComponent, SbButtonComponent],
  templateUrl: './storybook-lab.component.html',
  styleUrl: './storybook-lab.component.scss',
})
export class StorybookLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Storybook' }];
  readonly stories = SB_STORIES;
  readonly tutorialSteps = TUTORIAL_STEPS;

  readonly storyId = signal(SB_STORIES[0].id);
  readonly args = signal<SbButtonArgs>({ ...SB_STORIES[0].args });
  readonly addon = signal<SbAddon>('controls');
  readonly region = signal<SbRegion>('canvas');
  readonly actions = signal<string[]>([]);
  readonly outline = signal(false);
  readonly canvasBg = signal<'light' | 'dark'>('light');

  readonly tutorialOn = signal(true);
  readonly tutorialIndex = signal(0);

  readonly story = computed(() => this.stories.find((s) => s.id === this.storyId()) ?? this.stories[0]);

  readonly step = computed(() => this.tutorialSteps[this.tutorialIndex()]);

  readonly help = computed(() => {
    if (this.tutorialOn()) {
      const step = this.step();
      return { title: step.title, body: step.body, source: 'Tutorial' };
    }
    const region = REGION_HELP[this.region()];
    return {
      title: region.title,
      body: `${region.body} ${this.story().help}`,
      source: `Help · ${this.story().name}`,
    };
  });

  readonly csf = computed(() => storyCsf(this.story()));

  selectStory(id: string): void {
    const next = this.stories.find((s) => s.id === id);
    if (!next) return;
    this.storyId.set(id);
    this.args.set({ ...next.args });
    this.region.set('sidebar');
  }

  focusRegion(region: SbRegion): void {
    this.region.set(region);
    if (region === 'controls' || region === 'actions' || region === 'docs') {
      this.addon.set(region);
    }
  }

  setAddon(addon: SbAddon): void {
    this.addon.set(addon);
    this.region.set(addon);
  }

  patchArg<K extends keyof SbButtonArgs>(key: K, value: SbButtonArgs[K]): void {
    this.args.update((a) => ({ ...a, [key]: value }));
    this.region.set('controls');
    this.addon.set('controls');
  }

  onLabelInput(value: string): void {
    this.patchArg('label', value);
  }

  onVariantInput(value: string): void {
    this.patchArg('variant', value as SbVariant);
  }

  onSizeInput(value: string): void {
    this.patchArg('size', value as SbSize);
  }

  toggleCanvasBg(): void {
    this.canvasBg.set(this.canvasBg() === 'light' ? 'dark' : 'light');
    this.region.set('canvas');
  }

  toggleOutline(): void {
    this.outline.update((on) => !on);
    this.region.set('canvas');
  }

  onClicked(label: string): void {
    const line = `clicked("${label}") @ ${new Date().toLocaleTimeString()}`;
    this.actions.update((rows) => [line, ...rows].slice(0, 8));
    this.addon.set('actions');
    this.region.set('actions');
  }

  startTutorial(): void {
    this.tutorialOn.set(true);
    this.tutorialIndex.set(0);
    this.applyStep(0);
  }

  nextTutorial(): void {
    const i = Math.min(this.tutorialIndex() + 1, this.tutorialSteps.length - 1);
    this.tutorialIndex.set(i);
    this.applyStep(i);
  }

  prevTutorial(): void {
    const i = Math.max(this.tutorialIndex() - 1, 0);
    this.tutorialIndex.set(i);
    this.applyStep(i);
  }

  finishTutorial(): void {
    this.tutorialOn.set(false);
    this.region.set('canvas');
  }

  private applyStep(index: number): void {
    const step = this.tutorialSteps[index];
    if (step.storyId) this.selectStory(step.storyId);
    if (step.addon) this.addon.set(step.addon);
    this.region.set(step.region);
  }

  readonly installTs = `// Real Storybook is a second app beside ng serve
npx storybook@latest init
npm run storybook
// → http://localhost:6006

// This lab embeds that UI so you can learn the panes
// without installing a second toolchain first.`;


  readonly installModal = `import type { Meta, StoryObj } from '@storybook/angular';
import { SbButtonComponent } from './sb-button.component';

const meta: Meta<SbButtonComponent> = {
  title: 'Lab/Button',
  component: SbButtonComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<SbButtonComponent>;

export const Primary: Story = {
  args: { label: 'Save', variant: 'primary', size: 'md', disabled: false },
};

export const Disabled: Story = {
  args: { label: 'Save', variant: 'primary', disabled: true },
};

// Storybook ≠ production. End users never load this UI.`;
}
