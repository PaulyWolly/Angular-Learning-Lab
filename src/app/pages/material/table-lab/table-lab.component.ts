import { AfterViewInit, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

export interface DeveloperRecord {
  id: number;
  name: string;
  role: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  department: string;
  contributions: number;
}

const DEV_DATA: DeveloperRecord[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Algorithm Pioneer', level: 'Lead', department: 'R&D', contributions: 184 },
  { id: 2, name: 'Grace Hopper', role: 'Compiler Architect', level: 'Lead', department: 'Systems', contributions: 142 },
  { id: 3, name: 'Alan Turing', role: 'Cryptography Expert', level: 'Senior', department: 'Security', contributions: 129 },
  { id: 4, name: 'Margaret Hamilton', role: 'Guidance Software Lead', level: 'Lead', department: 'Apollo Systems', contributions: 210 },
  { id: 5, name: 'John von Neumann', role: 'Architecture Specialist', level: 'Senior', department: 'Hardware', contributions: 98 },
  { id: 6, name: 'Claude Shannon', role: 'Information Theorist', level: 'Senior', department: 'R&D', contributions: 115 },
  { id: 7, name: 'Barbara Liskov', role: 'Substitution Principle Pioneer', level: 'Lead', department: 'Architecture', contributions: 175 },
  { id: 8, name: 'Linus Torvalds', role: 'Kernel Maintainer', level: 'Lead', department: 'Open Source', contributions: 320 },
  { id: 9, name: 'Tim Berners-Lee', role: 'Web Protocol Architect', level: 'Senior', department: 'Standards', contributions: 160 },
  { id: 10, name: 'Brendan Eich', role: 'Language Designer', level: 'Mid', department: 'Frontend', contributions: 88 },
];

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
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './table-lab.component.html',
  styleUrl: './table-lab.component.scss',
})
export class MaterialTableLabComponent implements AfterViewInit {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Tables & Grids' }];

  readonly displayedColumns: string[] = ['id', 'name', 'role', 'level', 'department', 'contributions'];
  readonly dataSource = new MatTableDataSource<DeveloperRecord>(DEV_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedDev = signal<DeveloperRecord | null>(DEV_DATA[0]);
  filterValue = '';
  gridColumns = 3;

  constructor(private readonly toast: ToastService) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  // ——— Syntax Snippets ———
  readonly tableBasicTs = `import { MatTableModule, MatTableDataSource } from '@angular/material/table';

displayedColumns = ['id', 'name', 'role', 'contributions'];
dataSource = new MatTableDataSource(DEV_DATA);`;

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

  readonly tableBasicModal = `import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  imports: [MatTableModule],
  template: \`
    <table mat-table [dataSource]="data">
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
  data = [{ name: 'Ada' }, { name: 'Grace' }];
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
