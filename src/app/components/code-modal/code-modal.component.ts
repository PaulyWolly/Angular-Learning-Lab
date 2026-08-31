import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-code-modal',
  standalone: true,
  templateUrl: './code-modal.component.html',
  styleUrl: './code-modal.component.scss',
})
export class CodeModalComponent {
  private readonly document = inject(DOCUMENT);

  readonly title = input('Complete Code');
  readonly code = input.required<string>();
  readonly hint = input('Full implementation — imports through the run logic.');
  readonly closed = output<void>();

  constructor() {
    effect((onCleanup) => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closed.emit();
        }
      };

      this.document.addEventListener('keydown', onKeyDown);
      onCleanup(() => this.document.removeEventListener('keydown', onKeyDown));
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
