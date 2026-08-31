import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

export interface DialogData {
  userName: string;
  projectRole: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Edit User Profile</h2>
    <mat-dialog-content>
      <p>Modify the user information below and click Save.</p>
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 0.5rem;">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="data.userName" />
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Role</mat-label>
        <input matInput [(ngModel)]="data.projectRole" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="data">Save Changes</button>
    </mat-dialog-actions>
  `,
})
export class DemoEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DemoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-material-dialogs-lab',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './dialogs-lab.component.html',
  styleUrl: './dialogs-lab.component.scss',
})
export class MaterialDialogsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Dialogs & Feedback' }];

  // Dialog State
  currentUser = signal<DialogData>({ userName: 'Ada Lovelace', projectRole: 'Senior Engineer' });
  lastDialogResult = signal<string | null>(null);

  // SnackBar State
  snackMessage = 'Profile updated successfully!';
  snackAction = 'Undo';

  // Progress State
  progressValue = 65;
  isIndeterminate = false;

  // Tooltip State
  tooltipPosition: TooltipPosition = 'above';
  readonly tooltipPositions: TooltipPosition[] = ['above', 'below', 'left', 'right'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly toast: ToastService,
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DemoEditDialogComponent, {
      width: '380px',
      data: { ...this.currentUser() },
    });

    dialogRef.afterClosed().subscribe((result: DialogData | undefined) => {
      if (result) {
        this.currentUser.set(result);
        this.lastDialogResult.set(`Saved: ${result.userName} (${result.projectRole})`);
        this.toast.success('Dialog Saved', `User updated to ${result.userName}`);
      } else {
        this.lastDialogResult.set('Cancelled (no changes saved)');
      }
    });
  }

  showSnackBar(): void {
    const ref = this.snackBar.open(this.snackMessage, this.snackAction, {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    ref.onAction().subscribe(() => {
      this.toast.info('Action Clicked', 'User clicked Undo on the SnackBar.');
    });
  }

  // ——— Syntax Snippets ———
  readonly dialogTs = `import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

openDialog() {
  const dialogRef = this.dialog.open(EditDialogComponent, {
    width: '380px',
    data: { name: 'Ada', role: 'Engineer' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Dialog result:', result);
    }
  });
}`;

  readonly dialogTpl = `<!-- Trigger button in parent -->
<button mat-flat-button color="primary" (click)="openDialog()">
  <mat-icon>edit</mat-icon> Edit Profile
</button>

<!-- Inside Dialog Component Template -->
<h2 mat-dialog-title>Edit User Profile</h2>
<mat-dialog-content>
  <mat-form-field appearance="outline">
    <mat-label>Name</mat-label>
    <input matInput [(ngModel)]="data.name" />
  </mat-form-field>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Cancel</button>
  <button mat-flat-button color="primary" [mat-dialog-close]="data">Save</button>
</mat-dialog-actions>`;

  readonly dialogModal = `import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: \`
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>Are you sure you want to proceed?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  \`,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}`;

  readonly snackbarTs = `import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

showSnackBar() {
  const ref = this.snackBar.open('Saved changes', 'Undo', {
    duration: 3500,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });

  ref.onAction().subscribe(() => {
    console.log('Undo clicked');
  });
}`;

  readonly snackbarTpl = `<button mat-stroked-button (click)="showSnackBar()">
  <mat-icon>notifications</mat-icon> Trigger SnackBar
</button>`;

  readonly snackbarModal = `import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatSnackBarModule, MatButtonModule],
  template: \`
    <button mat-flat-button (click)="show()">Notify</button>
  \`,
})
export class SnackBarDemoComponent {
  constructor(private snackBar: MatSnackBar) {}
  show() {
    this.snackBar.open('Item archived', 'Undo', { duration: 3000 });
  }
}`;

  readonly progressTs = `import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

progressValue = 65;
isIndeterminate = false;
tooltipPosition = 'above';`;

  readonly progressTpl = `<!-- Determinate / Indeterminate Progress Bar -->
<mat-progress-bar
  [mode]="isIndeterminate ? 'indeterminate' : 'determinate'"
  [value]="progressValue"
/>

<!-- Spinner -->
<mat-progress-spinner
  [mode]="isIndeterminate ? 'indeterminate' : 'determinate'"
  [value]="progressValue"
  diameter="44"
/>

<!-- Tooltip with position -->
<button
  mat-stroked-button
  matTooltip="Save all pending changes to cloud"
  [matTooltipPosition]="tooltipPosition"
>
  Hover Me
</button>`;

  readonly progressModal = `import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule],
  template: \`
    <mat-progress-bar mode="determinate" [value]="50" />
    <mat-progress-spinner mode="indeterminate" diameter="40" />
    <button matTooltip="Help text">Info</button>
  \`,
})
export class ProgressDemoComponent {}`;
}
