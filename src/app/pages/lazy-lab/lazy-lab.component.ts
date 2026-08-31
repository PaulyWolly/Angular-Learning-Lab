import { NgComponentOutlet } from '@angular/common';
import { Component, Type, inject, signal } from '@angular/core';
import { CRUMB_HOME, CRUMB_ROUTES } from '../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { ToastService } from '../../shared/toast/toast.service';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-lazy-lab',
  standalone: true,
  imports: [NgComponentOutlet, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './lazy-lab.component.html',
  styleUrl: './lazy-lab.component.scss',
})
export class LazyLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_ROUTES, { label: 'Lazy Loading' }];
  private readonly toast = inject(ToastService);

  readonly loadedAt = new Date().toLocaleTimeString();

  /** Dynamically imported component type — null until the button runs */
  readonly lazyPanel = signal<Type<unknown> | null>(null);
  readonly loadingPanel = signal(false);
  readonly loadError = signal('');
  readonly panelLoadedAt = signal('');

  readonly routeTpl = `<!-- Navigating here triggers loadComponent -->
<a routerLink="/routes/lazy">Lazy Loading</a>`;

  readonly routeTs = `{
  path: 'lazy',
  loadComponent: () =>
    import('./pages/lazy-lab/lazy-lab.component')
      .then((m) => m.LazyLabComponent),
}`;

  readonly onDemandTpl = `<button (click)="loadPanel()">Lazy load panel</button>

@if (lazyPanel(); as cmp) {
  <ng-container *ngComponentOutlet="cmp" />
}`;

  readonly onDemandTs = `readonly lazyPanel = signal<Type<unknown> | null>(null);

async loadPanel(): Promise<void> {
  const m = await import('./lazy-demo-panel.component');
  this.lazyPanel.set(m.LazyDemoPanelComponent);
}`;

  readonly onDemandModal = `import { NgComponentOutlet } from '@angular/common';
import { Component, Type, signal } from '@angular/core';

@Component({
  selector: 'app-lazy-lab',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './lazy-lab.component.html',
})
export class LazyLabComponent {
  readonly lazyPanel = signal<Type<unknown> | null>(null);
  readonly loadingPanel = signal(false);

  async loadPanel(): Promise<void> {
    if (this.lazyPanel() || this.loadingPanel()) return;
    this.loadingPanel.set(true);
    try {
      const m = await import('./lazy-demo-panel.component');
      this.lazyPanel.set(m.LazyDemoPanelComponent);
    } finally {
      this.loadingPanel.set(false);
    }
  }
}`;

  async loadPanel(): Promise<void> {
    if (this.lazyPanel() || this.loadingPanel()) {
      return;
    }
    this.loadingPanel.set(true);
    this.loadError.set('');
    try {
      // Dynamic import → separate chunk (check Network after click)
      const m = await import('./lazy-demo-panel.component');
      this.lazyPanel.set(m.LazyDemoPanelComponent);
      this.panelLoadedAt.set(new Date().toLocaleTimeString());
      this.toast.success('Chunk loaded', 'Lazy panel arrived from a separate JS chunk.');
    } catch {
      this.loadError.set('Failed to load the lazy panel chunk.');
      this.toast.error('Load failed', 'Could not fetch the lazy panel chunk.');
    } finally {
      this.loadingPanel.set(false);
    }
  }

  clearPanel(): void {
    this.lazyPanel.set(null);
    this.panelLoadedAt.set('');
  }
}
