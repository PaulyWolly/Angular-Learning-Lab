/** Full code snippets shown in each step's Complete Code modal. */

export const STEP1_COMPLETE_CODE = `// users.service.ts — producer (HttpClient) behind users$
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  readonly users$ = this.http
    .get<User[]>('https://jsonplaceholder.typicode.com/users')
    .pipe(
      map((users) => users.slice(0, 8)),
      shareReplay(1),
    );
}

// rxjs-lab.component.ts — Step 1
import { Component, inject, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

export class RxjsLabComponent {
  private readonly usersService = inject(UsersService);

  readonly step1Running = signal(false);
  readonly step1Narrate = signal('');
  readonly step1Stage = signal<'idle' | 'A' | 'B' | 'C' | 'D'>('idle');
  readonly step1Users = signal<User[]>([]);

  runStep1(): void {
    if (this.step1Running()) return;
    this.step1Running.set(true);
    this.step1Users.set([]);
    this.step1Stage.set('A');
    this.step1Narrate.set(
      'A — Setup: users$ is a lazy recipe. The producer (HttpClient) has not been asked to work yet.',
    );

    void (async () => {
      try {
        await this.delay(900);
        this.step1Stage.set('B');
        this.step1Narrate.set(
          'B — subscribe starts. That kicks the producer: HttpClient runs the request.',
        );

        await this.delay(700);
        const users = await new Promise<User[]>((resolve, reject) => {
          this.usersService.users$.subscribe({
            next: resolve,
            error: reject,
          });
        });

        this.step1Stage.set('C');
        this.step1Narrate.set(
          \`C — Producer emits ONE value → Observer.next gets the array of \${users.length} users.\`,
        );
        this.step1Users.set(users);

        await this.delay(900);
        this.step1Stage.set('D');
        this.step1Narrate.set(
          'D — Producer is done → it invokes Observer.complete.',
        );
        await this.delay(400);
      } finally {
        this.step1Running.set(false);
      }
    })();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}`;

export const STEP2_COMPLETE_CODE = `// rxjs-lab.component.ts — Step 2
import { Component, inject, signal } from '@angular/core';
import { delay, map, tap } from 'rxjs';
import { SlimUser, User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

export class RxjsLabComponent {
  private readonly usersService = inject(UsersService);

  readonly step2Running = signal(false);
  readonly step2Narrate = signal('');
  readonly step2Phase = signal<'idle' | 'before' | 'explain' | 'after'>('idle');
  readonly step2Before = signal<User | null>(null);
  readonly step2After = signal<SlimUser[]>([]);

  runStep2(): void {
    if (this.step2Running()) return;
    this.step2Running.set(true);
    this.step2After.set([]);
    this.step2Phase.set('before');
    this.step2Narrate.set('Before: Observer would see nested User objects…');

    this.usersService.users$
      .pipe(
        tap((users) => this.step2Before.set(users[0] ?? null)),
        delay(1000),
        tap(() => {
          this.step2Phase.set('explain');
          this.step2Narrate.set(
            'map lives inside pipe. Operators reshape the value before it reaches the Observer.',
          );
        }),
        delay(1000),
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
}`;

export const STEP3_COMPLETE_CODE = `// rxjs-lab.component.ts — Step 3
import { Component, inject, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

interface KeepDropRow {
  name: string;
  lat: string;
  verdict: 'KEEP' | 'DROP' | 'pending';
}

export class RxjsLabComponent {
  private readonly usersService = inject(UsersService);

  readonly step3Running = signal(false);
  readonly step3Narrate = signal('');
  readonly step3Rows = signal<KeepDropRow[]>([]);
  readonly step3Result = signal<User[]>([]);

  runStep3(): void {
    if (this.step3Running()) return;
    this.step3Running.set(true);
    this.step3Result.set([]);
    this.step3Narrate.set(
      'Still one array emission — JS filter inside RxJS map. Path: u.address.geo.lat',
    );

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
          \`Done — kept \${kept.length} users where Number(u.address.geo.lat) < 0.\`,
        );
        this.step3Running.set(false);
      },
      error: () => this.step3Running.set(false),
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}`;

export const STEP4_COMPLETE_CODE = `// rxjs-lab.component.ts — Step 4
import { Component, inject, signal } from '@angular/core';
import { delay, map, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';

export class RxjsLabComponent {
  private readonly usersService = inject(UsersService);

  readonly step4Running = signal(false);
  readonly step4Narrate = signal('');
  readonly step4Peek1 = signal('');
  readonly step4AfterMap = signal<string[]>([]);
  readonly step4Peek2 = signal('');

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
          const msg = \`peephole 1 → \${users.length} users\`;
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
          const msg = \`peephole 2 → \${names.length} names (unchanged by tap)\`;
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
}`;

export const STEP5_COMPLETE_CODE = `// rxjs-lab.component.ts — Step 5
import { Component, inject, signal } from '@angular/core';
import { concatMap, delay, filter, from, of, switchMap, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

interface PassBlockRow {
  name: string;
  website: string;
  verdict: 'PASS' | 'BLOCK' | 'pending';
}

export class RxjsLabComponent {
  private readonly usersService = inject(UsersService);

  readonly step5Running = signal(false);
  readonly step5Narrate = signal('');
  readonly step5Rows = signal<PassBlockRow[]>([]);
  readonly step5Kept = signal<User[]>([]);
  readonly step5NextCount = signal(0);

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
                this.step5Narrate.set(\`BLOCK \${u.name} (\${u.website}) — filter skips next\`);
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
            \`next #\${this.step5NextCount()} — PASS \${u.name} (\${u.website})\`,
          );
        },
        complete: () => {
          this.step5Narrate.set(
            \`Complete — Observer.next ran \${this.step5NextCount()} times (not once).\`,
          );
          this.step5Running.set(false);
        },
        error: () => this.step5Running.set(false),
      });
  }
}`;

export const STEP6_COMPLETE_CODE = `// rxjs-lab.component.ts — Step 6
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

export class RxjsLabComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchCtrl = new FormControl('', { nonNullable: true });
  readonly rawInput = signal('');
  readonly debouncedQuery = signal('');
  readonly switchMapActive = signal(false);
  readonly searchMatches = signal<User[]>([]);

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

    this.usersService.users$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        if (!this.searchCtrl.value.trim()) {
          this.searchMatches.set(users);
        }
      });
  }

  private matchesQuery(u: User, q: string): boolean {
    const hay = [u.name, u.address.city, u.company.name].join(' ').toLowerCase();
    return hay.includes(q);
  }
}`;
