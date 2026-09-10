import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CanLeaveDirtyForm } from '../../core/guards/unsaved-changes.guard';
import { CRUMB_HOME, CRUMB_ROUTES } from '../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-deactivate-lab',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './deactivate-lab.component.html',
  styleUrl: './deactivate-lab.component.scss',
})
export class DeactivateLabComponent implements CanLeaveDirtyForm {
  readonly crumbs = [CRUMB_HOME, CRUMB_ROUTES, { label: 'CanDeactivate' }];
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly draftForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    notes: [''],
  });

  /** Guard calls this — pristine (or after Save) means leave freely. */
  canLeave(): boolean {
    return !this.draftForm.dirty;
  }

  save(): void {
    if (this.draftForm.invalid) {
      this.draftForm.markAllAsTouched();
      this.toast.error('Invalid draft', 'Name needs at least 2 characters.');
      return;
    }
    // markAsPristine clears dirty so CanDeactivate allows navigation
    this.draftForm.markAsPristine();
    const { name } = this.draftForm.getRawValue();
    this.toast.success('Draft saved', `${name} — form is pristine; you can leave freely.`);
  }

  resetDemo(): void {
    this.draftForm.reset({ name: '', notes: '' });
    this.toast.info('Reset', 'Form cleared (pristine).');
  }

  readonly formTpl = `<form [formGroup]="draftForm" (ngSubmit)="save()">
  <input formControlName="name" />
  <textarea formControlName="notes"></textarea>
  <button type="submit">Save</button>
</form>

<!-- try leaving while dirty -->
<a routerLink="/routes/guards">Leave to Guards</a>

<!-- status -->
dirty: {{ draftForm.dirty }}`;

  readonly formTs = `// component implements CanLeaveDirtyForm
canLeave(): boolean {
  return !this.draftForm.dirty;
}

save(): void {
  // ...validate...
  this.draftForm.markAsPristine(); // navigation now free
}`;

  readonly guardModal = `// unsaved-changes.guard.ts — functional CanDeactivate
export const unsavedChangesGuard: CanDeactivateFn<CanLeaveDirtyForm> = (component) => {
  const toast = inject(ToastService);

  if (component.canLeave()) {
    return true;
  }

  const leave = window.confirm('You have unsaved changes. Leave anyway?');
  if (leave) {
    toast.success('Left with unsaved edits', '...');
    return true;
  }

  toast.info('Stay on page', 'CanDeactivate blocked navigation.');
  return false;
};

// app.routes.ts
{
  path: 'deactivate',
  canDeactivate: [unsavedChangesGuard],
  loadComponent: () => import('...').then(m => m.DeactivateLabComponent),
}`;
}
