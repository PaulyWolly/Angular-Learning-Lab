import { Component, OnInit, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { CRUMB_HOME, CRUMB_THIRD_PARTY } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { Product, ProductsService } from '../../../shared/services/products.service';
import { ToastService } from '../../../shared/toast/toast.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid-lab',
  standalone: true,
  imports: [AgGridAngular, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './ag-grid-lab.component.html',
  styleUrl: './ag-grid-lab.component.scss',
})
export class AgGridLabComponent implements OnInit {
  private readonly products = inject(ProductsService);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_THIRD_PARTY, { label: 'Ag-Grid Community' }];
  readonly theme = themeQuartz;

  readonly loading = signal(true);
  readonly apiUp = signal(true);
  readonly rowCount = signal(0);
  readonly lastSaved = signal<string | null>(null);

  rowData: Product[] = [];
  private gridApi: GridApi<Product> | null = null;

  readonly columnDefs: ColDef<Product>[] = [
    { field: 'id', editable: false, maxWidth: 90, filter: true },
    { field: 'make', editable: true, filter: true, flex: 1 },
    { field: 'model', editable: true, filter: true, flex: 1.2 },
    {
      field: 'price',
      editable: true,
      sortable: true,
      flex: 0.8,
      valueParser: (p) => Number(p.newValue),
    },
    {
      field: 'stock',
      editable: true,
      sortable: true,
      flex: 0.7,
      valueParser: (p) => Number(p.newValue),
    },
  ];

  readonly defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };

  ngOnInit(): void {
    this.reload();
  }

  onGridReady(event: GridReadyEvent<Product>): void {
    this.gridApi = event.api;
  }

  reload(): void {
    this.loading.set(true);
    this.products.getAll().subscribe({
      next: (rows) => {
        this.rowData = rows;
        this.rowCount.set(rows.length);
        this.apiUp.set(true);
        this.loading.set(false);
        this.gridApi?.setGridOption('rowData', rows);
      },
      error: () => {
        this.loading.set(false);
        this.apiUp.set(false);
        this.rowData = [];
        this.rowCount.set(0);
        this.toast.error(
          'API offline',
          'Start the SQLite API with npm run api (or npm run start:all).',
        );
      },
    });
  }

  resetSeed(): void {
    this.products.reset().subscribe({
      next: (rows) => {
        this.rowData = rows;
        this.rowCount.set(rows.length);
        this.gridApi?.setGridOption('rowData', rows);
        this.lastSaved.set(null);
        this.toast.success('Reset', 'Seed data restored in SQLite.');
      },
      error: () => {
        this.toast.error('Reset failed', 'Is the API running?');
      },
    });
  }

  onCellValueChanged(event: CellValueChangedEvent<Product>): void {
    const row = event.data;
    const field = event.colDef.field;
    if (!row?.id || !field || field === 'id') return;
    if (event.oldValue === event.newValue) return;

    const patch = { [field]: event.newValue } as Partial<Product>;
    this.products.update(row.id, patch).subscribe({
      next: (saved) => {
        Object.assign(row, saved);
        this.lastSaved.set(
          `#${saved.id} ${saved.make} ${saved.model} — ${field}: ${String(event.newValue)}`,
        );
        this.toast.success('Saved to SQLite', `${field} updated for #${saved.id}`);
      },
      error: () => {
        // Roll back the cell if save failed
        if (event.node && field) {
          event.node.setDataValue(field, event.oldValue);
        }
        this.toast.error('Save failed', 'Could not PATCH /api/products/:id');
      },
    });
  }

  readonly installTs = `// Editable Community grid + SQLite API
columnDefs = [
  { field: 'make', editable: true },
  { field: 'model', editable: true },
  { field: 'price', editable: true, valueParser: p => Number(p.newValue) },
  { field: 'stock', editable: true, valueParser: p => Number(p.newValue) },
];

onCellValueChanged(event: CellValueChangedEvent<Product>) {
  const { id } = event.data!;
  const field = event.colDef.field!;
  this.products.update(id, { [field]: event.newValue }).subscribe();
}

// ProductsService → PATCH /api/products/:id
// Express + better-sqlite3 writes server/data/lab.db`;

  readonly installTpl = `<ag-grid-angular
  style="width: 100%; height: 320px"
  [theme]="theme"
  [rowData]="rowData"
  [columnDefs]="columnDefs"
  [defaultColDef]="defaultColDef"
  (gridReady)="onGridReady($event)"
  (cellValueChanged)="onCellValueChanged($event)"
/>
<!-- Double-click a cell → edit → blur/Enter → PATCH SQLite -->`;

  readonly installModal = `// server/index.js (sketch)
app.patch('/api/products/:id', (req, res) => {
  db.prepare(
    'UPDATE products SET make=?, model=?, price=?, stock=? WHERE id=?'
  ).run(make, model, price, stock, id);
  res.json(updatedRow);
});

// Run both processes:
// npm run start:all
//   api  → http://localhost:3001
//   web  → http://localhost:4201  (proxy /api → 3001)

// Why SQLite here (not Postgres)?
// - Zero install beyond npm; file-based DB in server/data/lab.db
// - Same CRUD patterns — swap the SQL dialect later for Postgres`;
}
