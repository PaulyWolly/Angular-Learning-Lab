import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { CounterService } from '../../../shared/services/counter.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-constructors-lab',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './constructors-lab.component.html',
  styleUrl: './constructors-lab.component.scss',
})
export class ConstructorsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Constructors' }];

  /** Modern pattern — no constructor needed */
  readonly counter = inject(CounterService);
  private readonly toast = inject(ToastService);

  /** Set once when the class is created — fine as a field initializer too */
  readonly createdLabel = `Component created ${new Date().toLocaleTimeString()}`;

  /**
   * Classic constructor pattern — still valid when you want imperative setup
   * that references injected dependencies in one block.
   */
  readonly loginForm;

  constructor(private readonly fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      remember: [true],
    });
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.error('Invalid', 'Fix the email field first.');
      return;
    }
    this.toast.success('Logged in (demo)', this.loginForm.value.email ?? '');
  }

  // ——— Syntax ———
  readonly skipTpl = `<p>Count: {{ counter.value() }}</p>
<button type="button" (click)="counter.increment()">+1</button>
<p class="muted">{{ createdLabel }}</p>`;

  readonly skipTs = `// No constructor — Angular still creates the class for you.
private readonly http = inject(HttpClient);
readonly counter = inject(CounterService);
readonly createdLabel = \`Component created \${new Date().toLocaleTimeString()}\`;

// inject() must run in an injection context (field, constructor, or factory).
// New Angular: put HttpClient / services on fields, not constructor params.`;

  readonly skipModal = `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: \`
    <p>{{ counter.value() }}</p>
    <button (click)="counter.increment()">+</button>
  \`,
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  readonly counter = inject(CounterService);
  title = 'Dashboard'; // plain field — no constructor required
}`;

  readonly injectVsCtorTpl = `<!-- Template is identical either way -->
<p>{{ counter.value() }}</p>`;

  readonly injectVsCtorTs = `// ✅ New Angular (preferred)
private readonly http = inject(HttpClient);

// ✅ Same idea — any injectable
readonly counter = inject(CounterService);

// Older style you will still read in interviews
constructor(private http: HttpClient) {}

// Same injector. Don't mix both styles for the same dependency.`;

  readonly injectVsCtorModal = `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// New default — field + inject() + private readonly
export class ModernComponent {
  private readonly http = inject(HttpClient);

  // Angular calls ngOnInit() by method name — no import / implements required.
  // implements OnInit is optional TypeScript (catches a missing/misspelled method).
  ngOnInit() {
    this.http.get('/api/me').subscribe();
  }
}

// Classic constructor injection — same HttpClient, older syntax
export class ClassicComponent {
  constructor(private readonly http: HttpClient) {}
}

// Angular creates ONE instance per placement in the template.
// A constructor (if you write one) runs once at creation — it is not required for DI.`;

  readonly needCtorTpl = `<form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
  <input formControlName="email" placeholder="Email" />
  <button type="submit">Sign in</button>
</form>`;

  readonly needCtorTs = `// Prefer this (no constructor):
private readonly fb = inject(FormBuilder);
readonly loginForm = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  remember: [true],
});

// This lab's live form still uses the older constructor style
// so you can recognize it:
// constructor(private fb: FormBuilder) { this.loginForm = this.fb.group(...) }`;

  readonly needCtorModal = `import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({ /* … */ })
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);

  // No constructor — group built from injected fb at field init
  readonly profileForm = this.fb.group({
    name: ['', Validators.required],
  });
}

// When you MUST write constructor():
// 1. extends BaseComponent → constructor() { super(...); }
// 2. @Inject(TOKEN) with non-class tokens in older patterns
// 3. Team standard that assigns many deps in one constructor block

// When you usually SKIP constructor():
// - inject() for services
// - Field initializers for simple state (title = 'Home')
// - input() / output() / signal() at field level`;

  readonly rulesTpl = `<!-- Angular builds the class → binds template → runs change detection.
You only add constructor() when you have a specific reason. -->`;

  readonly rulesTs = `// NEW DEFAULT
private readonly http = inject(HttpClient);

// SKIP constructor when:
// • inject() handles DI (HttpClient, your services)
// • Fields hold state: name = 'Ada'
// • input(), signal(), computed() at class field

// USE constructor when:
// • class extends another → super() required
// • You are reading older constructor(private http: HttpClient) code

// Angular does NOT require an empty constructor(). Omit it.`;
}
