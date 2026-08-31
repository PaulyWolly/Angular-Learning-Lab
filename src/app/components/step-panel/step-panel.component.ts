import { Component, input, output, signal } from '@angular/core';
import { CodeModalComponent } from '../code-modal/code-modal.component';

@Component({
  selector: 'app-step-panel',
  standalone: true,
  imports: [CodeModalComponent],
  templateUrl: './step-panel.component.html',
  styleUrl: './step-panel.component.scss',
})
export class StepPanelComponent {
  readonly step = input.required<number>();
  readonly title = input.required<string>();
  readonly why = input.required<string>();
  readonly pipeline = input.required<string[]>();
  readonly narrate = input<string>('');
  readonly code = input.required<string>();
  readonly completeCode = input.required<string>();
  readonly running = input(false);
  readonly showRun = input(true);

  readonly run = output<void>();
  readonly modalOpen = signal(false);
}
