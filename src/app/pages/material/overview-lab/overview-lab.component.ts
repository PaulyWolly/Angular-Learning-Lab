import { Component, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-material-overview-lab',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './overview-lab.component.html',
  styleUrl: './overview-lab.component.scss',
})
export class OverviewLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Overview & Setup' }];

  likesCount = signal(12);
  unreadCount = signal(3);
  selectedChip = signal<string>('Angular');
  readonly availableChips = ['Angular', 'TypeScript', 'Material', 'RxJS', 'Signals'];

  constructor(private readonly toast: ToastService) {}

  likeCard(): void {
    this.likesCount.update((n) => n + 1);
    this.toast.success('Liked!', `Total likes: ${this.likesCount()}`);
  }

  shareCard(): void {
    this.toast.info('Shared', 'Article link copied to clipboard.');
  }

  incrementBadge(): void {
    this.unreadCount.update((n) => n + 1);
  }

  clearBadge(): void {
    this.unreadCount.set(0);
    this.toast.info('Cleared', 'All notifications marked as read.');
  }

  selectChip(chip: string): void {
    this.selectedChip.set(chip);
  }

  // ——— Syntax Snippets ———
  readonly setupTs = `// 1. Install packages:
// npm install @angular/material @angular/cdk

// 2. In app.config.ts — enable animations:
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    // ...
  ],
};

// 3. In styles.scss — load prebuilt theme:
// @use '@angular/material/prebuilt-themes/azure-blue.css';`;

  readonly setupTpl = `<!-- Standalone component: import only what you use -->
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  // ...
})`;

  readonly setupModal = `// Complete setup checklist for Angular Material v20:
// 1. Dependencies installed: @angular/material, @angular/cdk
// 2. Animations provided in app.config.ts:
//    provideAnimationsAsync()
// 3. Theme loaded in styles.scss:
//    @use '@angular/material/prebuilt-themes/azure-blue.css';
// 4. Icons loaded in index.html:
//    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
// 5. Standalone imports: add specific Mat*Module to the component imports array.`;

  readonly buttonsTs = `// Component imports
imports: [MatButtonModule, MatIconModule]

// In methods:
likeCard() {
  this.likesCount.update(n => n + 1);
}`;

  readonly buttonsTpl = `<!-- Standard / Flat / Stroked / Icon Buttons -->
<button mat-button>Basic</button>
<button mat-flat-button color="primary">Primary Flat</button>
<button mat-stroked-button>Stroked</button>
<button mat-icon-button aria-label="Favorite">
  <mat-icon>favorite</mat-icon>
</button>
<button mat-fab extended color="primary">
  <mat-icon>add</mat-icon> Extended FAB
</button>`;

  readonly buttonsModal = `import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: \`
    <div class="demo-row">
      <button mat-button>Basic</button>
      <button mat-flat-button color="primary">Flat</button>
      <button mat-stroked-button>Stroked</button>
      <button mat-icon-button (click)="like()">
        <mat-icon>favorite</mat-icon>
      </button>
    </div>
  \`,
})
export class ButtonsDemoComponent {
  readonly likes = signal(0);
  like() { this.likes.update(n => n + 1); }
}`;

  readonly cardTs = `likesCount = signal(12);

likeCard() {
  this.likesCount.update(n => n + 1);
}`;

  readonly cardTpl = `<mat-card class="demo-card">
  <mat-card-header>
    <div mat-card-avatar class="demo-avatar">
      <mat-icon>school</mat-icon>
    </div>
    <mat-card-title>Angular Material in Action</mat-card-title>
    <mat-card-subtitle>Standalone Components</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>Material Design components provide accessible, consistent UI building blocks.</p>
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-button (click)="likeCard()">
      <mat-icon>favorite</mat-icon> {{ likesCount() }} Likes
    </button>
    <button mat-flat-button color="primary" (click)="shareCard()">Share</button>
  </mat-card-actions>
</mat-card>`;

  readonly cardModal = `import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: \`
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Card Title</mat-card-title>
        <mat-card-subtitle>Card Subtitle</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>Main content area inside the card.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>Action 1</button>
        <button mat-flat-button color="primary">Action 2</button>
      </mat-card-actions>
    </mat-card>
  \`,
})
export class CardDemoComponent {}`;

  readonly chipsTs = `unreadCount = signal(3);
selectedChip = signal('Angular');
readonly availableChips = ['Angular', 'TypeScript', 'Material', 'RxJS', 'Signals'];

incrementBadge() { this.unreadCount.update(n => n + 1); }
selectChip(chip: string) { this.selectedChip.set(chip); }`;

  readonly chipsTpl = `<!-- Badge on an icon or button -->
<button mat-icon-button [matBadge]="unreadCount()" matBadgeColor="warn">
  <mat-icon>notifications</mat-icon>
</button>

<!-- Chip set with selection -->
<mat-chip-set aria-label="Topic selection">
  @for (chip of availableChips; track chip) {
    <mat-chip
      [highlighted]="selectedChip() === chip"
      (click)="selectChip(chip)"
    >
      {{ chip }}
    </mat-chip>
  }
</mat-chip-set>`;

  readonly chipsModal = `import { Component, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatBadgeModule, MatChipsModule, MatButtonModule, MatIconModule],
  template: \`
    <button mat-icon-button [matBadge]="count()" matBadgeColor="warn">
      <mat-icon>notifications</mat-icon>
    </button>
    <mat-chip-set>
      <mat-chip *ngFor="let item of items" [highlighted]="selected === item" (click)="selected = item">
        {{ item }}
      </mat-chip>
    </mat-chip-set>
  \`,
})
export class ChipsBadgeDemoComponent {
  count = signal(3);
  selected = 'Angular';
  items = ['Angular', 'TypeScript', 'Material'];
}`;
}
