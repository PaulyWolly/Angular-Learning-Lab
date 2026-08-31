import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-material-forms-lab',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    JsonPipe,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss',
})
export class MaterialFormsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Form Controls' }];

  // Demo 1: Text inputs state
  emailInput = '';
  hidePassword = signal(true);

  // Demo 2: Selects / Checkboxes state
  selectedFramework = 'Angular';
  notificationsEnabled = true;
  userRole = 'developer';

  // Demo 3: Datepicker state
  selectedDate: Date | null = new Date();
  readonly minDate = new Date(2025, 0, 1);
  readonly maxDate = new Date(2027, 11, 31);

  // Demo 4: Reactive Profile Form
  readonly profileForm: FormGroup;
  submittedData = signal<Record<string, unknown> | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
  ) {
    this.profileForm = this.fb.group({
      fullName: ['Ada Lovelace', [Validators.required, Validators.minLength(3)]],
      workEmail: ['ada@example.com', [Validators.required, Validators.email]],
      department: ['Engineering', Validators.required],
      experienceLevel: ['senior', Validators.required],
      agreeTerms: [true, Validators.requiredTrue],
      startDate: [new Date(), Validators.required],
    });
  }

  togglePassword(): void {
    this.hidePassword.update((h) => !h);
  }

  onSubmitProfile(): void {
    if (this.profileForm.valid) {
      this.submittedData.set(this.profileForm.value);
      this.toast.success('Form Valid & Submitted', `Welcome ${this.profileForm.value.fullName}!`);
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Validation Error', 'Please correct the highlighted fields.');
    }
  }

  onResetForm(): void {
    this.profileForm.reset({
      department: 'Engineering',
      experienceLevel: 'mid',
      agreeTerms: false,
    });
    this.submittedData.set(null);
    this.toast.info('Form Reset', 'All fields cleared to default values.');
  }

  // ——— Syntax Snippets ———
  readonly inputTpl = `<mat-form-field appearance="outline">
  <mat-label>Email Address</mat-label>
  <input matInput type="email" [(ngModel)]="emailInput" placeholder="name@domain.com" />
  <mat-icon matPrefix>email</mat-icon>
  @if (emailInput) {
    <button matSuffix mat-icon-button (click)="emailInput = ''">
      <mat-icon>close</mat-icon>
    </button>
  }
  <mat-hint>We'll never share your email.</mat-hint>
</mat-form-field>

<mat-form-field appearance="outline">
  <mat-label>Password</mat-label>
  <input matInput [type]="hidePassword() ? 'password' : 'text'" />
  <button mat-icon-button matSuffix (click)="togglePassword()">
    <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
  </button>
</mat-form-field>`;

  readonly inputTs = `import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

emailInput = '';
hidePassword = signal(true);

togglePassword() {
  this.hidePassword.update(h => !h);
}`;

  readonly inputModal = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  template: \`
    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput [(ngModel)]="email" />
      <mat-icon matPrefix>mail</mat-icon>
      <mat-hint>Valid email format required</mat-hint>
    </mat-form-field>
  \`,
})
export class InputDemoComponent {
  email = '';
}`;

  readonly controlsTpl = `<!-- Select with option groups -->
<mat-form-field appearance="outline">
  <mat-label>Framework</mat-label>
  <mat-select [(ngModel)]="selectedFramework">
    <mat-option value="Angular">Angular v20</mat-option>
    <mat-option value="React">React 19</mat-option>
    <mat-option value="Vue">Vue 3</mat-option>
  </mat-select>
</mat-form-field>

<!-- Radio Group -->
<mat-radio-group [(ngModel)]="userRole" class="demo-radio-group">
  <mat-radio-button value="developer">Developer</mat-radio-button>
  <mat-radio-button value="designer">Designer</mat-radio-button>
  <mat-radio-button value="manager">Manager</mat-radio-button>
</mat-radio-group>

<!-- Slide Toggle -->
<mat-slide-toggle [(ngModel)]="notificationsEnabled" color="primary">
  Enable Notifications
</mat-slide-toggle>`;

  readonly controlsTs = `import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

selectedFramework = 'Angular';
userRole = 'developer';
notificationsEnabled = true;`;

  readonly controlsModal = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatRadioModule, MatSlideToggleModule],
  template: \`
    <mat-form-field appearance="outline">
      <mat-label>Role</mat-label>
      <mat-select [(ngModel)]="role">
        <mat-option value="dev">Developer</mat-option>
        <mat-option value="qa">QA Engineer</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-slide-toggle [(ngModel)]="active">Active Status</mat-slide-toggle>
  \`,
})
export class ControlsDemoComponent {
  role = 'dev';
  active = true;
}`;

  readonly datepickerTpl = `<mat-form-field appearance="outline">
  <mat-label>Choose a date</mat-label>
  <input
    matInput
    [matDatepicker]="picker"
    [(ngModel)]="selectedDate"
    [min]="minDate"
    [max]="maxDate"
  />
  <mat-hint>MM/DD/YYYY</mat-hint>
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`;

  readonly datepickerTs = `import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  providers: [provideNativeDateAdapter()], // Date adapter provider
  imports: [MatDatepickerModule, MatInputModule, MatFormFieldModule],
  // ...
})
export class DatepickerComponent {
  selectedDate: Date | null = new Date();
  minDate = new Date(2025, 0, 1);
  maxDate = new Date(2027, 11, 31);
}`;

  readonly datepickerModal = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  template: \`
    <mat-form-field appearance="outline">
      <mat-label>Date</mat-label>
      <input matInput [matDatepicker]="picker" [(ngModel)]="myDate" />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker />
    </mat-form-field>
  \`,
})
export class DatepickerDemoComponent {
  myDate = new Date();
}`;

  readonly formTpl = `<form [formGroup]="profileForm" (ngSubmit)="onSubmitProfile()" class="form-grid">
  <mat-form-field appearance="outline">
    <mat-label>Full Name</mat-label>
    <input matInput formControlName="fullName" />
    <mat-icon matPrefix>person</mat-icon>
    @if (profileForm.get('fullName')?.hasError('required')) {
      <mat-error>Full name is required.</mat-error>
    }
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Work Email</mat-label>
    <input matInput type="email" formControlName="workEmail" />
    <mat-icon matPrefix>email</mat-icon>
    @if (profileForm.get('workEmail')?.hasError('email')) {
      <mat-error>Please enter a valid email address.</mat-error>
    }
  </mat-form-field>

  <div class="form-actions">
    <button mat-flat-button color="primary" type="submit" [disabled]="profileForm.invalid">
      Submit
    </button>
    <button mat-stroked-button type="button" (click)="onResetForm()">Reset</button>
  </div>
</form>`;

  readonly formTs = `profileForm = this.fb.group({
  fullName: ['Ada Lovelace', [Validators.required, Validators.minLength(3)]],
  workEmail: ['ada@example.com', [Validators.required, Validators.email]],
  department: ['Engineering', Validators.required],
  experienceLevel: ['senior', Validators.required],
  agreeTerms: [true, Validators.requiredTrue],
  startDate: [new Date(), Validators.required],
});

onSubmitProfile() {
  if (this.profileForm.valid) {
    this.submittedData.set(this.profileForm.value);
  }
}`;

  readonly formModal = `import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
        <mat-error *ngIf="form.get('name')?.invalid">Required</mat-error>
      </mat-form-field>
      <button mat-flat-button color="primary" [disabled]="form.invalid">Submit</button>
    </form>
  \`,
})
export class CompleteFormDemoComponent {
  form = this.fb.group({
    name: ['', Validators.required],
  });
  constructor(private fb: FormBuilder) {}
  submit() { console.log(this.form.value); }
}`;
}
