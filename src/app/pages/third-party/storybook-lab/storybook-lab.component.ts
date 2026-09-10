import { Component } from '@angular/core';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-storybook-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './storybook-lab.component.html',
  styleUrl: './storybook-lab.component.scss',
})
export class StorybookLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Storybook' }];

  readonly installTs = `// Storybook is a separate app that mounts your Angular components
// npx storybook@latest init

// That adds:
// • .storybook/          config
// • src/**/*.stories.ts  example stories
// • npm scripts: storybook / build-storybook`;

  readonly installTpl = `// button.component.stories.ts (conceptual)
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
  component: ButtonComponent,
};
export default meta;

type Story = StoryObj<ButtonComponent>;
export const Primary: Story = {
  args: { label: 'Save', variant: 'primary' },
};`;

  readonly installModal = `// Run the Storybook UI (usually port 6006)
npm run storybook

// Why teams use it:
// • Design/dev review components without navigating the whole app
// • Document props / variants next to the UI
// • Visual regression + interaction tests (addons)

// Storybook ≠ production runtime.
// Your Angular app still runs with ng serve; Storybook is a workshop.`;

  readonly whenTs = `// Use Storybook when:
// • Many shared UI components (design system)
// • Designers / QA need a catalog of states
// • You want isolated tests for edge UI states

// Skip Storybook when:
// • Tiny app with few reusable pieces
// • Early prototype — add later when patterns stabilize`;
}
