import { Component, computed, inject, input, signal } from '@angular/core';
import { CodeModalComponent } from '../../components/code-modal/code-modal.component';
import { ToastService } from '../toast/toast.service';

/**
 * Learning-lab pattern: live demos pair with Template + TypeScript snippets.
 * Longer snippets can open in a modal via `typescriptModal` / `templateModal`.
 *
 * Rule: whenever Full TypeScript is available, Full HTML Template is too
 * (uses `templateModal` if set, otherwise the inline `templateCode`).
 */
@Component({
  selector: 'app-lesson-syntax',
  standalone: true,
  imports: [CodeModalComponent],
  templateUrl: './lesson-syntax.component.html',
  styleUrl: './lesson-syntax.component.scss',
})
export class LessonSyntaxComponent {
  private readonly toast = inject(ToastService);

  /** Template / HTML snippet shown inline */
  readonly templateCode = input.required<string>();

  /** Class / TS snippet shown inline (fields, methods, inject, etc.) */
  readonly typescriptCode = input.required<string>();

  /**
   * Optional fuller TypeScript (imports + class body).
   * When set, a “Full TypeScript” button opens the code modal —
   * and Full HTML Template is shown beside it.
   */
  readonly typescriptModal = input<string>('');

  /**
   * Optional fuller HTML template (complete card markup).
   * Falls back to `templateCode` when Full TypeScript is shown but this is empty.
   */
  readonly templateModal = input<string>('');

  /** Title for the Full TypeScript modal */
  readonly modalTitle = input('Full TypeScript');

  /** Title for the Full HTML Template modal (auto-derived from modalTitle when left default) */
  readonly templateModalTitle = input('Full HTML Template');

  /** Shown as text so Angular does not treat it as real interpolation */
  readonly curlyExample = '{{ title }}';

  /** Show HTML modal button whenever TS modal exists, or an explicit templateModal is set */
  readonly showHtmlModalBtn = computed(
    () => !!this.typescriptModal().trim() || !!this.templateModal().trim(),
  );

  readonly showTsModalBtn = computed(() => !!this.typescriptModal().trim());

  /** Prefer explicit templateModal; otherwise use the inline template snippet */
  readonly resolvedTemplateModal = computed(
    () => this.templateModal().trim() || this.templateCode(),
  );

  /** Prefer explicit title; else swap “TypeScript” → “HTML Template” on modalTitle */
  readonly resolvedTemplateModalTitle = computed(() => {
    const explicit = this.templateModalTitle();
    if (explicit !== 'Full HTML Template') {
      return explicit;
    }
    const tsTitle = this.modalTitle();
    if (tsTitle.includes('TypeScript')) {
      return tsTitle.replace(/TypeScript/g, 'HTML Template');
    }
    if (tsTitle === 'Full TypeScript') {
      return 'Full HTML Template';
    }
    return `${tsTitle} — HTML Template`;
  });

  /** Which modal is open — only one at a time */
  readonly modalKind = signal<'ts' | 'tpl' | null>(null);
  readonly copiedKind = signal<'ts' | 'tpl' | null>(null);

  openModal(kind: 'ts' | 'tpl'): void {
    this.modalKind.set(kind);
  }

  closeModal(): void {
    this.modalKind.set(null);
  }

  async copy(kind: 'ts' | 'tpl'): Promise<void> {
    const text = kind === 'ts' ? this.typescriptCode() : this.templateCode();
    const label = kind === 'ts' ? 'TypeScript' : 'Template';
    try {
      await navigator.clipboard.writeText(text);
      this.copiedKind.set(kind);
      this.toast.success('Copied', `${label} snippet is on the clipboard.`);
      window.setTimeout(() => {
        if (this.copiedKind() === kind) {
          this.copiedKind.set(null);
        }
      }, 1600);
    } catch {
      this.toast.error('Copy failed', 'Clipboard permission was denied.');
    }
  }
}
