import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabProgressService } from '../../shared/services/lab-progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly progress = inject(LabProgressService);

  /** Core lab pack — open by default so labs stay discoverable. */
  readonly coreOpen = signal(true);
  readonly basicsOpen = signal(true);
  readonly materialOpen = signal(true);
  readonly thirdPartyOpen = signal(true);
  readonly progressOpen = signal(true);

  readonly progressGroups = this.progress.groups();

  toggleCore(): void {
    this.coreOpen.update((open) => !open);
  }

  toggleBasics(): void {
    this.basicsOpen.update((open) => !open);
  }

  toggleMaterial(): void {
    this.materialOpen.update((open) => !open);
  }

  toggleThirdParty(): void {
    this.thirdPartyOpen.update((open) => !open);
  }

  toggleProgress(): void {
    this.progressOpen.update((open) => !open);
  }
}
