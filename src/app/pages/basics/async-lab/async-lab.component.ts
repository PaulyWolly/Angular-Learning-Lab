import { Component, signal } from '@angular/core';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-async-lab',
  standalone: true,
  imports: [LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './async-lab.component.html',
  styleUrl: './async-lab.component.scss',
})
export class BasicsAsyncLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Promises & async' }];
  readonly demoLog = signal('Async demos appear here.');
  readonly loading = signal(false);

  private fakeFetch(ok = true): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ok) resolve('User loaded: Ada Lovelace');
        else reject(new Error('Network failed'));
      }, 600);
    });
  }

  runThen(): void {
    this.loading.set(true);
    this.demoLog.set('promise pending…');
    this.fakeFetch()
      .then((msg) => this.demoLog.set(`.then → ${msg}`))
      .catch((err: Error) => this.demoLog.set(`.catch → ${err.message}`))
      .finally(() => this.loading.set(false));
  }

  async runAwait(): Promise<void> {
    this.loading.set(true);
    this.demoLog.set('await pending…');
    try {
      const msg = await this.fakeFetch();
      this.demoLog.set(`await → ${msg}`);
    } catch (err) {
      this.demoLog.set(`catch → ${(err as Error).message}`);
    } finally {
      this.loading.set(false);
    }
  }

  runFail(): void {
    this.loading.set(true);
    this.demoLog.set('failing promise…');
    this.fakeFetch(false)
      .then((msg) => this.demoLog.set(msg))
      .catch((err: Error) => this.demoLog.set(`caught error → ${err.message}`))
      .finally(() => this.loading.set(false));
  }

  readonly asyncTs = `// Promise = value that will arrive later
function fakeFetch() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('User loaded'), 600);
  });
}

// Style 1: then / catch
fakeFetch()
  .then(msg => console.log(msg))
  .catch(err => console.error(err));

// Style 2: async / await (reads top-to-bottom)
async function load() {
  try {
    const msg = await fakeFetch();
    console.log(msg);
  } catch (err) {
    console.error(err);
  }
}`;

  readonly asyncTpl = `<button (click)="runThen()">.then()</button>
<button (click)="runAwait()">async / await</button>
<button (click)="runFail()">force error</button>
@if (loading()) { <span>Loading…</span> }
<pre>{{ demoLog() }}</pre>`;

  readonly asyncModal = `// Bridge to Angular / RxJS
// HttpClient returns Observable — not a Promise.
// But the *idea* is the same: work finishes later.

// Promise → Observable (RxJS)
import { from } from 'rxjs';
from(fakeFetch()).subscribe(msg => console.log(msg));

// Observable → Promise (when you truly need one)
import { firstValueFrom } from 'rxjs';
const user = await firstValueFrom(http.get('/api/me'));

// Prefer staying in Observables inside Angular apps.
// Learn Promises so async/await and third-party APIs make sense.`;
}
