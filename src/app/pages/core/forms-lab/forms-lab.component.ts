import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

type FormsTab = 'reactive' | 'template';

@Component({
  selector: 'app-forms-lab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss',
})
export class FormsLabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Forms' }];
  readonly tab = signal<FormsTab>('reactive');

  // --- Reactive ---
  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['learner', Validators.required],
  });

  get nameCtrl() {
    return this.profileForm.controls.name;
  }

  get emailCtrl() {
    return this.profileForm.controls.email;
  }

  submitReactive(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Invalid form', 'Fix the highlighted fields, then submit again.');
      return;
    }
    const value = this.profileForm.getRawValue();
    this.toast.success('Saved (reactive)', `${value.name} (${value.role}) — ${value.email}`);
  }

  resetReactive(): void {
    this.profileForm.reset({ name: '', email: '', role: 'learner' });
    this.toast.info('Reset', 'Reactive form cleared back to defaults.');
  }

  // --- Template-driven ---
  tdName = '';
  tdEmail = '';
  tdRole = 'learner';

  submitTemplate(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toast.error('Invalid form', 'Template validators failed — fix fields and retry.');
      return;
    }
    this.toast.success(
      'Saved (template)',
      `${this.tdName} (${this.tdRole}) — ${this.tdEmail}`,
    );
  }

  resetTemplate(form: NgForm): void {
    form.resetForm({ name: '', email: '', role: 'learner' });
    this.tdName = '';
    this.tdEmail = '';
    this.tdRole = 'learner';
    this.toast.info('Reset', 'Template-driven form cleared.');
  }

  // --- Syntax snippets ---
  readonly formTs = `readonly profileForm = inject(FormBuilder).nonNullable.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  role: ['learner', Validators.required],
});

submit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }
  // use this.profileForm.getRawValue()
}`;

  readonly formTpl = `<form [formGroup]="profileForm" (ngSubmit)="submit()">
  <input formControlName="name" />
  @if (nameCtrl.touched && nameCtrl.invalid) {
    <span>Name is required (min 2).</span>
  }

  <input formControlName="email" />
  <select formControlName="role">...</select>
  <button type="submit">Save</button>
</form>`;

  readonly formModal = `import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  // ...
})
export class FormsLabComponent {
  private readonly fb = inject(FormBuilder);

  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['learner', Validators.required],
  });
}`;

  readonly tdTs = `// Model lives as plain fields — FormsModule + [(ngModel)]
tdName = '';
tdEmail = '';
tdRole = 'learner';

submit(form: NgForm): void {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
  // use this.tdName / this.tdEmail / this.tdRole
}`;

  readonly tdTpl = `<form #f="ngForm" (ngSubmit)="submit(f)">
  <input name="name" [(ngModel)]="tdName"
         required minlength="2" #name="ngModel" />
  @if (name.touched && name.invalid) {
    <span>Name is required (min 2).</span>
  }

  <input name="email" [(ngModel)]="tdEmail"
         required email />
  <select name="role" [(ngModel)]="tdRole" required>...</select>
  <button type="submit">Save</button>
</form>`;

  readonly tdModal = `import { FormsModule, NgForm } from '@angular/forms';

@Component({
  imports: [FormsModule],  // required for ngModel / ngForm
  // ...
})
export class FormsLabComponent {
  tdName = '';
  tdEmail = '';
  tdRole = 'learner';

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
  }
}`;
}
