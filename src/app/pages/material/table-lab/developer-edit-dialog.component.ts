import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  DEVELOPER_LEVELS,
  DeveloperDraft,
  DeveloperRecord,
} from '../../../shared/services/developers.service';

export interface DeveloperDialogData {
  mode: 'add' | 'edit';
  developer?: DeveloperRecord;
}

@Component({
  selector: 'app-developer-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'add' ? 'Add developer' : 'Edit developer' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" autocomplete="off" />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <input matInput formControlName="role" autocomplete="off" />
          @if (form.controls.role.touched && form.controls.role.invalid) {
            <mat-error>Role is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Level</mat-label>
          <mat-select formControlName="level">
            @for (level of levels; track level) {
              <mat-option [value]="level">{{ level }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <input matInput formControlName="department" autocomplete="off" />
          @if (form.controls.department.touched && form.controls.department.invalid) {
            <mat-error>Department is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Contributions</mat-label>
          <input matInput type="number" formControlName="contributions" min="0" />
          @if (form.controls.contributions.touched && form.controls.contributions.invalid) {
            <mat-error>Enter a number of 0 or more</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.mode === 'add' ? 'Add' : 'Save' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: min(28rem, 80vw);
      padding-top: 0.35rem;
    }

    mat-form-field {
      width: 100%;
    }
  `,
})
export class DeveloperEditDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeveloperEditDialogComponent, DeveloperDraft | undefined>);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DeveloperDialogData>(MAT_DIALOG_DATA);

  readonly levels = DEVELOPER_LEVELS;

  readonly form = this.fb.nonNullable.group({
    name: [this.data.developer?.name ?? '', Validators.required],
    role: [this.data.developer?.role ?? '', Validators.required],
    level: this.fb.nonNullable.control(this.data.developer?.level ?? 'Mid'),
    department: [this.data.developer?.department ?? '', Validators.required],
    contributions: [
      this.data.developer?.contributions ?? 0,
      [Validators.required, Validators.min(0)],
    ],
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
