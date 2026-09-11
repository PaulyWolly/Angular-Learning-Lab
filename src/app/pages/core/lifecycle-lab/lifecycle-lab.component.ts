import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { LifecycleHookLog } from './lifecycle-hook-log';
import { LifecycleProbeComponent } from './lifecycle-probe.component';

const GUESTS = ['Ada', 'Grace', 'Linus'] as const;

@Component({
  selector: 'app-lifecycle-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent, LifecycleProbeComponent],
  providers: [LifecycleHookLog],
  templateUrl: './lifecycle-lab.component.html',
  styleUrl: './lifecycle-lab.component.scss',
})
export class LifecycleLabComponent {
  private readonly hookLog = inject(LifecycleHookLog);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Lifecycle Hooks' }];
  readonly rows = this.hookLog.rows;

  readonly mounted = signal(true);
  readonly guest = signal<(typeof GUESTS)[number]>('Ada');

  toggleMount(): void {
    this.mounted.update((on) => !on);
  }

  rename(): void {
    const i = GUESTS.indexOf(this.guest());
    this.guest.set(GUESTS[(i + 1) % GUESTS.length]);
  }

  clearLog(): void {
    this.hookLog.clear();
  }

  readonly implementTpl = `<!-- Nothing extra in the template — hooks are class methods -->
<app-child [name]="guest" />`;

  readonly implementTs = `import { Component, OnInit, OnDestroy } from '@angular/core';

export class ProbeComponent implements OnInit, OnDestroy {
  ngOnInit()    { /* inputs ready — fetch / subscribe */ }
  ngOnDestroy() { /* unsubscribe / clear timers */ }
}

// implements is TypeScript — Angular calls ngOnInit() by name
// even if you forget the interface.`;

  readonly implementModal = `import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-child', standalone: true, template: '{{ name }}' })
export class ProbeComponent implements OnChanges, OnInit, OnDestroy {
  @Input() name = '';

  ngOnChanges(changes: SimpleChanges) {
    // runs before ngOnInit on first bind, then on every later @Input change
  }

  ngOnInit() {
    // safe: this.name is set
  }

  ngOnDestroy() {
    // last chance before the instance is gone
  }
}`;

  readonly liveTpl = `@if (mounted()) {
  <app-lifecycle-probe [name]="guest()" />
}
<button (click)="toggleMount()">Mount / unmount</button>
<button (click)="rename()">Rename guest</button>`;

  readonly liveTs = `readonly mounted = signal(true);
readonly guest = signal('Ada');

// Child implements OnChanges, OnInit, AfterViewInit, OnDestroy
// + constructor, afterNextRender, DestroyRef.onDestroy`;

  readonly liveModal = `export class LifecycleProbeComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {

  @Input({ required: true }) name = '';

  constructor() {
    // 1. instance exists — do not read @Input here
    afterNextRender(() => { /* 5. after paint */ });
    inject(DestroyRef).onDestroy(() => { /* teardown */ });
  }

  ngOnChanges(changes: SimpleChanges) { /* 2. first bind + later input changes */ }
  ngOnInit() { /* 3. inputs ready */ }
  ngAfterViewInit() { /* 4. view ready */ }
  ngOnDestroy() { /* unmount */ }
}`;

  readonly destroyTpl = `<!-- Unmount the child (@if false) → destroy hooks fire -->`;

  readonly destroyTs = `private readonly http = inject(HttpClient);
private readonly destroyRef = inject(DestroyRef);

ngOnInit() {
  this.http.get('/api/me').pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
}

// Classic teardown you will still see:
// ngOnDestroy() { this.sub.unsubscribe(); }`;

  readonly destroyModal = `import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class ProbeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Fetch here — inputs are ready. Pass DestroyRef because ngOnInit
    // is not an injection context.
    this.http.get('/api/me').pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}`;
}
