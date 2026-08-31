import { JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ConceptDuoComponent } from '../../components/concept-duo/concept-duo.component';
import { AsyncPipeLessonComponent } from '../../components/async-pipe-lesson/async-pipe-lesson.component';
import { StepPanelComponent } from '../../components/step-panel/step-panel.component';
import { UserDatasetComponent } from '../../components/user-dataset/user-dataset.component';
import { SlimUser, User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { CRUMB_HOME } from '../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import {
  STEP1_COMPLETE_CODE,
  STEP2_COMPLETE_CODE,
  STEP3_COMPLETE_CODE,
  STEP4_COMPLETE_CODE,
  STEP5_COMPLETE_CODE,
  STEP6_COMPLETE_CODE,
} from './rxjs-lab-complete-code';

interface KeepDropRow {
  name: string;
  lat: string;
  verdict: 'KEEP' | 'DROP' | 'pending';
}

interface PassBlockRow {
  name: string;
  website: string;
  verdict: 'PASS' | 'BLOCK' | 'pending';
}

@Component({
  selector: 'app-rxjs-lab',
  standalone: true,
  imports: [
    ConceptDuoComponent,
    AsyncPipeLessonComponent,
    UserDatasetComponent,
    StepPanelComponent,
    ReactiveFormsModule,
    JsonPipe,
    LessonBreadcrumbComponent,
  ],
  templateUrl: './rxjs-lab.component.html',
  styleUrl: './rxjs-lab.component.scss',
})
export class RxjsLabComponent implements OnInit {
  readonly crumbs = [CRUMB_HOME, { label: 'RxJS Lab' }];
  // Inject the UsersService
  private readonly usersService = inject(UsersService);
  // Inject the DestroyRef
  private readonly destroyRef = inject(DestroyRef);

  // —— Step 1 ——
  readonly step1Running = signal(false);
  readonly step1Narrate = signal('');
  readonly step1Stage = signal<'idle' | 'A' | 'B' | 'C' | 'D'>('idle');
  readonly step1Users = signal<User[]>([]);
  readonly step1Code = `
    users$.subscribe({
      next: (users) => { /* ONE array */ },
      complete: () => { /* done */ },
    });
  `;

  // Complete code for step 1
  readonly step1CompleteCode = STEP1_COMPLETE_CODE;

  // —— Step 2 ——
  readonly step2Running = signal(false);
  readonly step2Narrate = signal('');
  readonly step2Phase = signal<'idle' | 'before' | 'explain' | 'after'>('idle');
  readonly step2Before = signal<User | null>(null);
  readonly step2After = signal<SlimUser[]>([]);
  readonly step2Code = `users$.pipe(
  map((users) =>
    users.map((u) => ({
      id: u.id,
      name: u.name,
      city: u.address.city,
      company: u.company.name,
    })),
  ),
).subscribe({ next: (slim) => { /* Observer sees slim objects */ } });`;

// Complete code for step 2
readonly step2CompleteCode = STEP2_COMPLETE_CODE;

  // —— Step 3 ——
  readonly step3Running = signal(false);
  readonly step3Narrate = signal('');
  readonly step3Rows = signal<KeepDropRow[]>([]);
  readonly step3Result = signal<User[]>([]);
  readonly step3Code = `users$.pipe(
  map((users) => users.filter((u) => Number(u.address.geo.lat) < 0)),
).subscribe({ next: (kept) => { /* still ONE array emission */ } });`;

// Complete code for step 3
readonly step3CompleteCode = STEP3_COMPLETE_CODE;

  // —— Step 4 ——
  readonly step4Running = signal(false);
  readonly step4Narrate = signal('');
  readonly step4Peek1 = signal<string>('');
  readonly step4AfterMap = signal<string[]>([]);
  readonly step4Peek2 = signal<string>('');
  readonly step4Code = `users$.pipe(
  tap((users) => console.log('peephole 1', users.length)),
  map((users) => users.map((u) => u.company.name)),
  tap((names) => console.log('peephole 2', names)),
).subscribe({ next: (names) => { /* same values tap saw */ } });`;

// Complete code for step 4
readonly step4CompleteCode = STEP4_COMPLETE_CODE;

  // —— Step 5 ——
  readonly step5Running = signal(false);
  readonly step5Narrate = signal('');
  readonly step5Rows = signal<PassBlockRow[]>([]);
  readonly step5Kept = signal<User[]>([]);
  readonly step5NextCount = signal(0);
  readonly step5Code = `users$.pipe(
  switchMap((users) => from(users)),
  filter((u) => u.website.endsWith('.net') || u.website.endsWith('.org')),
).subscribe({ next: (u) => { /* next runs multiple times */ } });`;

// Complete code for step 5
readonly step5CompleteCode = STEP5_COMPLETE_CODE;

  // —— Step 6 ——
  readonly searchCtrl = new FormControl('', { nonNullable: true });
  readonly rawInput = signal('');
  readonly debouncedQuery = signal('');
  readonly switchMapActive = signal(false);
  readonly searchMatches = signal<User[]>([]);
  readonly step6Code = `this.searchCtrl.valueChanges.pipe(
  map((raw) => (raw ?? '').trim().toLowerCase()),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) =>
    this.usersService.users$.pipe(
      map((users) => users.filter((u) => matchesQuery(u, q))),
    ),
  ),
  takeUntilDestroyed(),
);`;

// Complete code for step 6
readonly step6CompleteCode = STEP6_COMPLETE_CODE;

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        tap((raw) => this.rawInput.set(raw ?? '')),
        map((raw) => (raw ?? '').trim().toLowerCase()),
        debounceTime(300),
        distinctUntilChanged(),
        tap((q) => {
          this.debouncedQuery.set(q);
          this.switchMapActive.set(true);
        }),
        switchMap((q) =>
          this.usersService.users$.pipe(
            map((users) => (q ? users.filter((u) => this.matchesQuery(u, q)) : users)),
          ),
        ),
        tap(() => this.switchMapActive.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((matches) => this.searchMatches.set(matches));

    // Seed matches with full list once loaded
    this.usersService.users$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        if (!this.searchCtrl.value.trim()) {
          this.searchMatches.set(users);
        }
      });
  }

  runStep1(): void {
    if (this.step1Running()) return;
    this.step1Running.set(true);
    this.step1Users.set([]);
    this.step1Stage.set('A');
    this.step1Narrate.set(
      'A — Setup: users$ is a lazy recipe (Observable). The producer (HttpClient) has not been asked to work yet.',
    );

    void (async () => {
      try {
        await this.delay(2000);
        this.step1Stage.set('B');
        this.step1Narrate.set(
          'B — subscribe starts. That kicks the producer: HttpClient runs the request (or shareReplay replays a prior result).',
        );

        await this.delay(2000);
        const users = await new Promise<User[]>((resolve, reject) => {
          this.usersService.users$.subscribe({
            next: resolve,
            error: reject,
          });
        });

        this.step1Stage.set('C');
        this.step1Narrate.set(
          `C — Producer emits ONE value → Observer.next gets the array of ${users.length} users.`,
        );
        this.step1Users.set(users);

        await this.delay(2000);
        this.step1Stage.set('D');
        this.step1Narrate.set(
          'D — Producer is done → it invokes Observer.complete (cold HTTP finishes after one response). You register complete; the producer calls it.',
        );
        await this.delay(2000);
      } finally {
        this.step1Running.set(false);
      }
    })();
  }

  runStep2(): void {
    if (this.step2Running()) return;
    this.step2Running.set(true);
    this.step2After.set([]);
    this.step2Phase.set('before');
    this.step2Narrate.set('Before: Observer would see nested User objects…');

    this.usersService.users$
      .pipe(
        tap((users) => this.step2Before.set(users[0] ?? null)),
        delay(2000),
        tap(() => {
          this.step2Phase.set('explain');
          this.step2Narrate.set(
            'map lives inside pipe. Operators reshape the value before it reaches the Observer.',
          );
        }),
        delay(2000),
        map((users) =>
          users.map(
            (u): SlimUser => ({
              id: u.id,
              name: u.name,
              city: u.address.city,
              company: u.company.name,
            }),
          ),
        ),
        tap((slim) => {
          this.step2Phase.set('after');
          this.step2After.set(slim);
          this.step2Narrate.set('After: Observer only sees slim flat objects.');
        }),
      )
      .subscribe({
        complete: () => this.step2Running.set(false),
        error: () => this.step2Running.set(false),
      });
  }

  runStep3(): void {
    if (this.step3Running()) return;
    this.step3Running.set(true);
    this.step3Result.set([]);
    this.step3Narrate.set('Still one array emission — JS filter inside RxJS map. Path: u.address.geo.lat');

    this.usersService.users$.subscribe({
      next: async (users) => {
        const rows: KeepDropRow[] = users.map((u) => ({
          name: u.name,
          lat: u.address.geo.lat,
          verdict: 'pending',
        }));
        this.step3Rows.set(rows);

        for (let i = 0; i < users.length; i++) {
          await this.delay(220);
          const keep = Number(users[i].address.geo.lat) < 0;
          rows[i] = { ...rows[i], verdict: keep ? 'KEEP' : 'DROP' };
          this.step3Rows.set([...rows]);
        }

        const kept = users.filter((u) => Number(u.address.geo.lat) < 0);
        this.step3Result.set(kept);
        this.step3Narrate.set(
          `Done — kept ${kept.length} users where Number(u.address.geo.lat) < 0.`,
        );
        this.step3Running.set(false);
      },
      error: () => this.step3Running.set(false),
    });
  }

  runStep4(): void {
    if (this.step4Running()) return;
    this.step4Running.set(true);
    this.step4Peek1.set('');
    this.step4AfterMap.set([]);
    this.step4Peek2.set('');
    this.step4Narrate.set('tap = side effects; values pass through unchanged.');

    this.usersService.users$
      .pipe(
        tap((users) => {
          const msg = `peephole 1 → ${users.length} users`;
          console.log('peephole 1', users.length);
          this.step4Peek1.set(msg);
          this.step4Narrate.set(msg);
        }),
        delay(800),
        map((users) => users.map((u) => u.company.name)),
        tap((names) => {
          this.step4AfterMap.set(names);
          this.step4Narrate.set('after map → company names');
        }),
        delay(800),
        tap((names) => {
          const msg = `peephole 2 → ${names.length} names (unchanged by tap)`;
          console.log('peephole 2', names);
          this.step4Peek2.set(msg);
          this.step4Narrate.set(msg);
        }),
      )
      .subscribe({
        complete: () => this.step4Running.set(false),
        error: () => this.step4Running.set(false),
      });
  }

  runStep5(): void {
    if (this.step5Running()) return;
    this.step5Running.set(true);
    this.step5Kept.set([]);
    this.step5NextCount.set(0);
    this.step5Narrate.set('from turns one array into many emissions — next runs per item.');

    this.usersService.users$
      .pipe(
        switchMap((users) => {
          const pending: PassBlockRow[] = users.map((u) => ({
            name: u.name,
            website: u.website,
            verdict: 'pending',
          }));
          this.step5Rows.set(pending);

          return from(users).pipe(
            concatMap((u) => of(u).pipe(delay(280))),
            tap((u) => {
              const pass = u.website.endsWith('.net') || u.website.endsWith('.org');
              this.step5Rows.update((rows) =>
                rows.map((r) =>
                  r.name === u.name && r.website === u.website
                    ? { ...r, verdict: pass ? 'PASS' : 'BLOCK' }
                    : r,
                ),
              );
              if (!pass) {
                this.step5Narrate.set(`BLOCK ${u.name} (${u.website}) — filter skips next`);
              }
            }),
            filter((u) => u.website.endsWith('.net') || u.website.endsWith('.org')),
          );
        }),
      )
      .subscribe({
        next: (u) => {
          this.step5NextCount.update((n) => n + 1);
          this.step5Kept.update((list) => [...list, u]);
          this.step5Narrate.set(
            `next #${this.step5NextCount()} — PASS ${u.name} (${u.website})`,
          );
        },
        complete: () => {
          this.step5Narrate.set(
            `Complete — Observer.next ran ${this.step5NextCount()} times (not once).`,
          );
          this.step5Running.set(false);
        },
        error: () => this.step5Running.set(false),
      });
  }

  private matchesQuery(u: User, q: string): boolean {
    const hay = [u.name, u.address.city, u.company.name].join(' ').toLowerCase();
    return hay.includes(q);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
