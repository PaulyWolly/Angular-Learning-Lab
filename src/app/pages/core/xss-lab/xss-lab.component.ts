import { Component, computed, inject, SecurityContext, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-xss-lab',
  standalone: true,
  imports: [FormsModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './xss-lab.component.html',
  styleUrl: './xss-lab.component.scss',
})
export class XssLabComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'XSS' }];

  /** Simulated “user / API” input — never treat this as trusted HTML. */
  readonly payload = signal(
    `<img src="x" onerror="alert('XSS')">Hello <b>friend</b>`,
  );

  /** What Angular’s HTML sanitizer keeps (scripts / handlers stripped). */
  readonly sanitizedHtml = computed(
    () => this.sanitizer.sanitize(SecurityContext.HTML, this.payload()) ?? '',
  );

  /**
   * Safe use of bypass: HTML that *we* authored in the app, not from the user.
   * Still prefer components/CSS over HTML strings when you can.
   */
  readonly trustedAppHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
    `<strong>Trusted promo</strong> — authored in TypeScript, not pasted by a user.`,
  );

  /** Anti-pattern demo flag — only set via the explicit “unsafe” button. */
  unsafeBypassHtml: SafeHtml | null = null;

  readonly samples = [
    {
      label: 'Script-ish img',
      value: `<img src="x" onerror="alert('XSS')">Hello <b>friend</b>`,
    },
    {
      label: 'Script tag',
      value: `<script>alert('XSS')</script><b>bold</b>`,
    },
    {
      label: 'Harmless markup',
      value: `Welcome <em>learner</em> — no handlers.`,
    },
  ] as const;

  loadSample(value: string): void {
    this.payload.set(value);
    this.unsafeBypassHtml = null;
    this.toast.info('Sample loaded', 'Compare the three output panels below.');
  }

  /**
   * DO NOT do this with real user input.
   * Shown once so learners see why bypass exists — and why it is dangerous.
   */
  enableUnsafeBypass(): void {
    this.unsafeBypassHtml = this.sanitizer.bypassSecurityTrustHtml(this.payload());
    this.toast.error(
      'Unsafe bypass on',
      'bypassSecurityTrustHtml(userInput) skips sanitization. Never ship this.',
    );
  }

  clearUnsafeBypass(): void {
    this.unsafeBypassHtml = null;
    this.toast.info('Cleared', 'Unsafe bypass panel reset.');
  }

  readonly safeTs = `payload = signal(\`<img … onerror="alert('XSS')">\`);

// ✅ Safe — escapes HTML (shows tags as text)
// template: {{ payload() }}

// ✅ Safe — text content, not markup
// template: <div [innerText]="payload()"></div>

// ⚠️ Sanitized — Angular strips dangerous bits from HTML
// template: <div [innerHTML]="payload()"></div>
sanitized = computed(() =>
  inject(DomSanitizer).sanitize(SecurityContext.HTML, this.payload()) ?? '',
);`;

  readonly safeTpl = `<!-- User / API string -->
<textarea [(ngModel)]="payload"></textarea>

<!-- ✅ Escaped text -->
<pre>{{ payload() }}</pre>

<!-- ✅ Text node -->
<div [innerText]="payload()"></div>

<!-- ⚠️ HTML after Angular sanitizer (scripts/handlers removed) -->
<div [innerHTML]="payload()"></div>`;

  readonly bypassTs = `// ✅ Rare OK — HTML *you* wrote in the app
trusted = sanitizer.bypassSecurityTrustHtml(
  '<strong>Trusted promo</strong> from the app.',
);

// ❌ NEVER — user/API string + bypass = XSS
unsafe = sanitizer.bypassSecurityTrustHtml(userInput);
// template: <div [innerHTML]="unsafe"></div>`;

  readonly bypassTpl = `<!-- App-authored HTML only -->
<div [innerHTML]="trustedAppHtml"></div>

<!-- Anti-pattern (demo button only) -->
<div [innerHTML]="unsafeBypassHtml"></div>`;

  readonly bypassModal = `import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

// Angular escapes {{ }} and sanitizes [innerHTML] by default (Ivy / DomSanitizer).
// bypassSecurityTrustHtml tells Angular “I accept the risk” — only for trusted constants.

// Defense in depth
// 1. Prefer {{ }} / [innerText] for untrusted data
// 2. Prefer components + bindings over HTML strings
// 3. If you must render HTML, sanitize — never bypass user input
// 4. Validate on the server too; the browser is not your only gate
`;
}
