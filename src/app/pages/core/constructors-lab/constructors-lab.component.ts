import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { CounterService } from '../../../shared/services/counter.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-constructors-lab',
  standalone: true,
  imports: [ReactiveFormsModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
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
readonly counter = inject(CounterService);
readonly createdLabel = \`Component created \${new Date().toLocaleTimeString()}\`;

// Field initializers run when the instance is built.
// inject() must run in an injection context (field, constructor, or factory).`;

  readonly skipModal = `import { Component, inject } from '@angular/core';
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
  readonly counter = inject(CounterService);
  title = 'Dashboard'; // plain field — no constructor required
}`;

  readonly injectVsCtorTpl = `<!-- Template is identical either way -->
<p>{{ counter.value() }}</p>`;

  readonly injectVsCtorTs = `// ✅ Modern (preferred in new Angular)
readonly counter = inject(CounterService);

// ✅ Classic (still common in older codebases)
constructor(private counter: CounterService) {}

// Both ask Angular's injector for CounterService.
// Pick one style per class — don't mix both for the same dependency.`;

  readonly injectVsCtorModal = `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// inject() at field — easy to read, works with private readonly
export class ModernComponent {
  private readonly http = inject(HttpClient);
}

// constructor() — fine when the whole team still uses this style
export class ClassicComponent {
  constructor(private http: HttpClient) {}
}

// Angular creates ONE instance of your component class per placement in the template.
// The constructor (if you write one) runs once at creation time.`;

  readonly needCtorTpl = `<form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
  <input formControlName="email" placeholder="Email" />
  <button type="submit">Sign in</button>
</form>`;

  readonly needCtorTs = `loginForm;

constructor(private fb: FormBuilder) {
  this.loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    remember: [true],
  });
}

// You could also write:
// private readonly fb = inject(FormBuilder);
// readonly loginForm = this.fb.nonNullable.group({ ... });
// → then you still might not need an explicit constructor().`;

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

  readonly rulesTs = `// SKIP constructor when:
// • inject() handles DI
// • Fields hold state: name = 'Ada'
// • input(), signal(), computed() at class field

// USE constructor when:
// • class extends another → super() required
// • One-time setup that must run before fields use each other
// • You prefer classic constructor(private svc: MyService) style

// Angular does NOT require an empty constructor(). Omit it.`;
}
