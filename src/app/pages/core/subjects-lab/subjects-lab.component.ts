import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject, scan, startWith } from 'rxjs';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import {
  LabBusEvent,
  LabEventBusService,
} from '../../../shared/services/lab-event-bus.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-subjects-lab',
  standalone: true,
  imports: [AsyncPipe, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './subjects-lab.component.html',
  styleUrl: './subjects-lab.component.scss',
})
export class SubjectsLabComponent implements OnInit {
  private readonly bus = inject(LabEventBusService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Subjects · BehaviorSubject' }];

  /** Rolling log built from the shared bus (multicast — both "panels" hear the same push). */
  readonly feed$ = this.bus.events$.pipe(
    scan((acc: LabBusEvent[], ev) => [ev, ...acc].slice(0, 8), [] as LabBusEvent[]),
    startWith([] as LabBusEvent[]),
  );

  readonly lateJoinCount = signal(0);

  // ——— Subject vs BehaviorSubject late-join demo ———
  private readonly plain$ = new Subject<string>();
  private readonly behavior$ = new BehaviorSubject<string>('cream');

  /** What a late Subject subscriber received (usually nothing yet). */
  readonly plainLateGot = signal<string | null>(null);
  /** What a late BehaviorSubject subscriber received (always the last value). */
  readonly behaviorLateGot = signal<string | null>(null);
  readonly behaviorCurrent = signal(this.behavior$.value);
  readonly plainEmitCount = signal(0);

  ngOnInit(): void {
    // Second subscriber joins late — still gets future events (hot Subject), not past ones
    this.bus.events$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.lateJoinCount.update((n) => n + 1);
    });
  }

  publish(source: string, message: string): void {
    this.bus.publish(source, message);
    this.toast.info('Published', `${source}: ${message}`);
  }

  pushPlain(value: string): void {
    this.plain$.next(value);
    this.plainEmitCount.update((n) => n + 1);
    this.toast.info('Subject.next', value);
  }

  setBehavior(value: string): void {
    this.behavior$.next(value);
    this.behaviorCurrent.set(value);
    this.toast.info('BehaviorSubject.next', `now = ${value}`);
  }

  /** Simulate a subscriber that joins after values were already pushed. */
  lateJoinPlain(): void {
    this.plainLateGot.set(null);
    const sub = this.plain$.subscribe((v) => this.plainLateGot.set(v));
    // If nothing is emitted synchronously, they got nothing yet — Subject does not replay.
    queueMicrotask(() => sub.unsubscribe());
    if (this.plainLateGot() === null) {
      this.toast.info('Late join (Subject)', 'No immediate value — missed the past.');
    }
  }

  lateJoinBehavior(): void {
    this.behaviorLateGot.set(null);
    const sub = this.behavior$.subscribe((v) => this.behaviorLateGot.set(v));
    sub.unsubscribe();
    this.toast.success(
      'Late join (BehaviorSubject)',
      `Immediately got last value: ${this.behaviorLateGot()}`,
    );
  }

  readonly busTs = `// lab-event-bus.service.ts
private readonly bus$ = new Subject<LabBusEvent>();
readonly events$ = this.bus$.asObservable(); // consumers cannot next()

publish(source: string, message: string): void {
  this.bus$.next({ source, message, at: new Date().toLocaleTimeString() });
}

// Any component
inject(LabEventBusService).publish('Panel A', 'ping');
inject(LabEventBusService).events$.subscribe(/* log */);`;

  readonly busTpl = `<button (click)="publish('A', 'ping')">Panel A</button>
<button (click)="publish('B', 'pong')">Panel B</button>

@for (ev of feed$ | async; track $index) {
  <li>{{ ev.at }} · {{ ev.source }} — {{ ev.message }}</li>
}`;

  readonly busModal = `// Observable: push happens inside the producer (create / HttpClient).
// Subject: you call next() from the outside — ideal for a tiny event bus.

// Interview tips
// - Subject is multicast (many subscribers share one push).
// - asObservable() hides next/error/complete from consumers.
// - Late subscribers miss past values (use BehaviorSubject to replay last).
// - Prefer signals for local UI state; Subject/bus for cross-component events.`;

  readonly behaviorTpl = `<!-- Push into a plain Subject -->
<button (click)="pushPlain('ping')">Subject.next('ping')</button>
<button (click)="lateJoinPlain()">Late-join Subject</button>
<p>Late got: {{ plainLateGot() ?? '(nothing yet)' }}</p>

<!-- BehaviorSubject always has a current value -->
<button (click)="setBehavior('teal')">BehaviorSubject.next('teal')</button>
<button (click)="lateJoinBehavior()">Late-join BehaviorSubject</button>
<p>Current: {{ behaviorCurrent() }}</p>
<p>Late got immediately: {{ behaviorLateGot() }}</p>`;

  readonly behaviorTs = `// Subject — no initial value; late subscribers miss the past
private readonly plain$ = new Subject<string>();
plain$.next('ping');          // only *current* subscribers hear this
plain$.subscribe(v => …);     // joins late → waits for the *next* push

// BehaviorSubject — requires seed; replays last value to new subscribers
private readonly behavior$ = new BehaviorSubject<string>('cream');
behavior$.value;              // sync read of current
behavior$.next('teal');
behavior$.subscribe(v => …);  // gets 'teal' immediately, then future values`;

  readonly behaviorModal = `import { BehaviorSubject, Subject } from 'rxjs';

// ——— Subject ———
const plain$ = new Subject<string>();
plain$.next('too early');           // nobody listening yet — gone
plain$.subscribe(v => console.log(v)); // late join: silent until next next()

// ——— BehaviorSubject ———
const theme$ = new BehaviorSubject<'cream' | 'teal'>('cream');
theme$.value;                       // 'cream' (sync)
theme$.next('teal');
theme$.subscribe(v => console.log(v)); // late join: logs 'teal' immediately

// When to use which (interview):
// - Subject          → event bus / “fire and forget” (clicks, toasts, nav events)
// - BehaviorSubject  → “current state” streams (auth user, theme, feature flags)
// - ReplaySubject(n) → replay the last n values (not only one)
// - Modern Angular   → prefer signal() for local UI state; BehaviorSubject when
//                      you still need an Observable API (combine with RxJS).`;
}
