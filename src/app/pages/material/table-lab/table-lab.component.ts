import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import {
  DeveloperDraft,
  DeveloperRecord,
  DevelopersService,
} from '../../../shared/services/developers.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DeveloperEditDialogComponent } from './developer-edit-dialog.component';

@Component({
  selector: 'app-material-table-lab',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSliderModule,
    MatDialogModule,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './table-lab.component.html',
  styleUrl: './table-lab.component.scss',
})
export class MaterialTableLabComponent implements AfterViewInit {
  private readonly developers = inject(DevelopersService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Tables & Grids' }];

  readonly displayedColumns: string[] = [
    'id',
    'name',
    'role',
    'level',
    'department',
    'contributions',
    'actions',
  ];
  readonly dataSource = new MatTableDataSource<DeveloperRecord>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedDev = signal<DeveloperRecord | null>(null);
  readonly apiUp = signal(true);
  readonly loading = signal(true);
  filterValue = '';
  gridColumns = 3;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.developers.getAll().subscribe({
      next: (rows) => {
        this.apiUp.set(true);
        this.applyRows(rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.apiUp.set(false);
        this.applyRows([]);
        this.toast.error(
          'API offline',
          'Start the SQLite API with npm run api (or npm run start:all).',
        );
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  selectRow(row: DeveloperRecord): void {
    this.selectedDev.set(row);
    this.toast.info('Row Selected', `${row.name} (${row.role})`);
  }

  openAdd(): void {
    this.openDialog('add');
  }

  openEdit(row: DeveloperRecord, event?: Event): void {
    event?.stopPropagation();
    this.selectedDev.set(row);
    this.openDialog('edit', row);
  }

  seed(): void {
    this.developers.seed().subscribe({
      next: ({ alreadySeeded, rows }) => {
        this.apiUp.set(true);
        this.applyRows(rows);
        if (alreadySeeded) {
          this.toast.info(
            'Already seeded',
            'SQLite already has developers. Use Reset seed to restore the original 10.',
          );
        } else {
          this.toast.success('Seeded', 'Inserted the canonical 10 developers into SQLite.');
        }
      },
      error: () => this.toast.error('Seed failed', 'Is the API running?'),
    });
  }

  resetSeed(): void {
    this.developers.reset().subscribe({
      next: (rows) => {
        this.apiUp.set(true);
        this.applyRows(rows);
        this.toast.success('Reset', 'Restored the original 10 developers in SQLite.');
      },
      error: () => this.toast.error('Reset failed', 'Is the API running?'),
    });
  }

  remove(row: DeveloperRecord, event?: Event): void {
    event?.stopPropagation();
    this.developers.remove(row.id).subscribe({
      next: () => {
        const remaining = this.dataSource.data.filter((d) => d.id !== row.id);
        this.applyRows(remaining);
        this.toast.success('Deleted', `${row.name} removed from SQLite.`);
      },
      error: () => this.toast.error('Delete failed', `Could not DELETE /api/developers/${row.id}`),
    });
  }

  private openDialog(mode: 'add' | 'edit', developer?: DeveloperRecord): void {
    this.dialog
      .open(DeveloperEditDialogComponent, {
        data: { mode, developer },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((draft?: DeveloperDraft) => {
        if (!draft) return;
        if (mode === 'add') {
          this.developers.create(draft).subscribe({
            next: (saved) => {
              this.applyRows([...this.dataSource.data, saved], saved.id);
              this.toast.success('Added', `${saved.name} saved to SQLite.`);
            },
            error: () => this.toast.error('Add failed', 'Could not POST /api/developers'),
          });
          return;
        }
        if (!developer) return;
        this.developers.update(developer.id, draft).subscribe({
          next: (saved) => {
            const rows = this.dataSource.data.map((d) => (d.id === saved.id ? saved : d));
            this.applyRows(rows, saved.id);
            this.toast.success('Saved', `${saved.name} updated in SQLite.`);
          },
          error: () => this.toast.error('Save failed', `Could not PATCH /api/developers/${developer.id}`),
        });
      });
  }

  private applyRows(rows: DeveloperRecord[], selectId?: number): void {
    this.dataSource.data = rows;
    const id = selectId ?? this.selectedDev()?.id;
    this.selectedDev.set(rows.find((d) => d.id === id) ?? rows[0] ?? null);
  }

  // ——— Syntax Snippets ———
  readonly tableBasicTs = `import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { inject } from '@angular/core';

displayedColumns = ['id', 'name', 'role', 'level', 'department', 'contributions', 'actions'];
dataSource = new MatTableDataSource<DeveloperRecord>([]);
private readonly developers = inject(DevelopersService);

reload() {
  this.developers.getAll().subscribe((rows) => (this.dataSource.data = rows));
}`;

  readonly tableBasicTpl = `<table mat-table [dataSource]="dataSource" class="mat-elevation-z1">
  <!-- ID Column -->
  <ng-container matColumnDef="id">
    <th mat-header-cell *matHeaderCellDef>No.</th>
    <td mat-cell *matCellDef="let dev">{{ dev.id }}</td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let dev">{{ dev.name }}</td>
  </ng-container>

  <!-- Role Column -->
  <ng-container matColumnDef="role">
    <th mat-header-cell *matHeaderCellDef>Role</th>
    <td mat-cell *matCellDef="let dev">{{ dev.role }}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
</table>`;

  readonly tableBasicModal = `import { Component, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DevelopersService, DeveloperRecord } from './developers.service';

@Component({
  standalone: true,
  imports: [MatTableModule],
  template: \`
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="['name']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name']"></tr>
    </table>
  \`,
})
export class BasicTableDemoComponent {
  private readonly developers = inject(DevelopersService);
  dataSource = new MatTableDataSource<DeveloperRecord>([]);

  constructor() {
    this.developers.getAll().subscribe((rows) => (this.dataSource.data = rows));
  }
}`;

  readonly editDialogTs = `private readonly dialog = inject(MatDialog);
private readonly developers = inject(DevelopersService);

openEdit(row: DeveloperRecord) {
  this.dialog
    .open(DeveloperEditDialogComponent, { data: { mode: 'edit', developer: row } })
    .afterClosed()
    .subscribe((draft?: DeveloperDraft) => {
      if (!draft) return;
      this.developers.update(row.id, draft).subscribe((saved) => {
        this.dataSource.data = this.dataSource.data.map((d) =>
          d.id === saved.id ? saved : d,
        );
      });
    });
}`;

  readonly editDialogTpl = `<form [formGroup]="form" (ngSubmit)="save()">
  <mat-form-field appearance="outline">
    <mat-label>Name</mat-label>
    <input matInput formControlName="name" />
  </mat-form-field>
  <mat-form-field appearance="outline">
    <mat-label>Level</mat-label>
    <mat-select formControlName="level">
      @for (level of levels; track level) {
        <mat-option [value]="level">{{ level }}</mat-option>
      }
    </mat-select>
  </mat-form-field>
  <button mat-flat-button type="submit" [disabled]="form.invalid">Save</button>
</form>`;

  readonly editDialogModal = `import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="save()">
      <input formControlName="name" />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  \`,
})
export class DeveloperEditDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeveloperEditDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.developer?.name ?? '', Validators.required],
    role: [this.data.developer?.role ?? '', Validators.required],
    level: [this.data.developer?.level ?? 'Mid'],
    department: [this.data.developer?.department ?? '', Validators.required],
    contributions: [this.data.developer?.contributions ?? 0, [Validators.required, Validators.min(0)]],
  });

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}`;

  readonly sortPageTs = `import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}`;

  readonly sortPageTpl = `<!-- Add matSort to table and mat-sort-header to each header cell -->
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let row">{{ row.name }}</td>
  </ng-container>
  <!-- ... -->
</table>

<!-- Paginator below the table -->
<mat-paginator
  [pageSizeOptions]="[5, 10, 20]"
  showFirstLastButtons
  aria-label="Select page of developers"
/>`;

  readonly sortPageModal = `import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: \`
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let row">{{ row.name }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="['name']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name']"></tr>
    </table>
    <mat-paginator [pageSizeOptions]="[5, 10]" />
  \`,
})
export class SortPageDemoComponent implements AfterViewInit {
  dataSource = new MatTableDataSource([{ name: 'Ada' }, { name: 'Grace' }]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}`;

  readonly gridTs = `import { MatGridListModule } from '@angular/material/grid-list';

gridColumns = 3;`;

  readonly gridTpl = `<mat-grid-list [cols]="gridColumns" rowHeight="100px" gutterSize="12px">
  <mat-grid-tile [colspan]="2" [rowspan]="1" class="tile-teal">
    <strong>Hero Card (2x1)</strong>
  </mat-grid-tile>
  <mat-grid-tile [colspan]="1" [rowspan]="2" class="tile-amber">
    <strong>Sidebar Tile (1x2)</strong>
  </mat-grid-tile>
  <mat-grid-tile [colspan]="1" [rowspan]="1" class="tile-code">
    <strong>Standard Tile</strong>
  </mat-grid-tile>
  <mat-grid-tile [colspan]="1" [rowspan]="1" class="tile-card">
    <strong>Standard Tile</strong>
  </mat-grid-tile>
</mat-grid-list>`;

  readonly gridModal = `import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  standalone: true,
  imports: [MatGridListModule],
  template: \`
    <mat-grid-list cols="4" rowHeight="120px" gutterSize="10px">
      <mat-grid-tile colspan="2" rowspan="2">Span 2x2</mat-grid-tile>
      <mat-grid-tile colspan="2" rowspan="1">Span 2x1</mat-grid-tile>
      <mat-grid-tile colspan="1" rowspan="1">1x1</mat-grid-tile>
      <mat-grid-tile colspan="1" rowspan="1">1x1</mat-grid-tile>
    </mat-grid-list>
  \`,
})
export class GridDemoComponent {}`;
}
