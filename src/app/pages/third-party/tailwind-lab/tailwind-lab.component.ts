import { Component } from '@angular/core';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-tailwind-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './tailwind-lab.component.html',
  styleUrl: './tailwind-lab.component.scss',
})
export class TailwindLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Tailwind' }];

  readonly installTs = `// Angular + Tailwind (typical modern path)
// 1. npm install -D tailwindcss postcss autoprefixer
// 2. npx tailwindcss init

// 3. tailwind.config.js — scan Angular templates
// content: ['./src/**/*.{html,ts}'],

// 4. styles.scss (or a dedicated tailwind.css)
// @tailwind base;
// @tailwind components;
// @tailwind utilities;`;

  readonly installTpl = `<!-- Utility classes live in the template -->
<button class="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
  Save
</button>

<div class="mt-4 grid grid-cols-2 gap-3">
  <div class="rounded border p-3">Left</div>
  <div class="rounded border p-3">Right</div>
</div>`;

  readonly installModal = `// With Angular CLI application builder, PostCSS picks up
// postcss.config.js + Tailwind automatically once configured.

// Tips:
// • Prefer utilities for layout/spacing; keep shared tokens in CSS vars.
// • Don't enable full @tailwind base if you already have a design system
//   (Material / custom) — or scope Tailwind carefully.
// • Purge/content paths must include .html AND .ts (inline templates).`;

  readonly whenTs = `// Use Tailwind when:
// • Design is custom (not Bootstrap/Material look)
// • Designers hand off utility-friendly specs
// • You want tiny CSS for production (unused classes purged)

// Vs Bootstrap: utilities vs prebuilt components.
// Vs Material: Tailwind is CSS-only; Material is Angular components.`;
}
