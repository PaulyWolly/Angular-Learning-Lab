import { Component, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-material-navigation-lab',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './navigation-lab.component.html',
  styleUrl: './navigation-lab.component.scss',
})
export class MaterialNavigationLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Navigation & Menus' }];

  selectedTabIndex = signal(0);
  tabBadgeCount = signal(3);
  accordionMultiOpen = false;

  constructor(private readonly toast: ToastService) {}

  menuAction(action: string): void {
    this.toast.info('Menu Clicked', `Selected action: ${action}`);
  }

  onTabChange(index: number): void {
    this.selectedTabIndex.set(index);
    if (index === 1 && this.tabBadgeCount() > 0) {
      this.tabBadgeCount.set(0);
      this.toast.info('Notifications Read', 'Badge cleared on tab visit.');
    }
  }

  // ——— Syntax Snippets ———
  readonly menuTs = `import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

menuAction(item: string) {
  console.log('Action selected:', item);
}`;

  readonly menuTpl = `<mat-toolbar color="primary" class="demo-toolbar">
  <span>Angular Material App</span>
  <span class="spacer"></span>

  <button mat-icon-button [matMenuTriggerFor]="mainMenu" aria-label="Open menu">
    <mat-icon>more_vert</mat-icon>
  </button>
</mat-toolbar>

<mat-menu #mainMenu="matMenu">
  <button mat-menu-item (click)="menuAction('Profile')">
    <mat-icon>person</mat-icon>
    <span>User Profile</span>
  </button>
  <button mat-menu-item [matMenuTriggerFor]="themeSubMenu">
    <mat-icon>palette</mat-icon>
    <span>Theme Options</span>
  </button>
  <mat-divider></mat-divider>
  <button mat-menu-item (click)="menuAction('Logout')">
    <mat-icon>logout</mat-icon>
    <span>Sign Out</span>
  </button>
</mat-menu>

<mat-menu #themeSubMenu="matMenu">
  <button mat-menu-item (click)="menuAction('Light Theme')">Light Mode</button>
  <button mat-menu-item (click)="menuAction('Dark Theme')">Dark Mode</button>
</mat-menu>`;

  readonly menuModal = `import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  template: \`
    <mat-toolbar>
      <span>Header</span>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Home</button>
      <button mat-menu-item>Settings</button>
    </mat-menu>
  \`,
})
export class MenuDemoComponent {}`;

  readonly tabsTs = `import { MatTabsModule } from '@angular/material/tabs';

selectedTabIndex = signal(0);
tabBadgeCount = signal(3);

onTabChange(index: number) {
  this.selectedTabIndex.set(index);
}`;

  readonly tabsTpl = `<mat-tab-group
  [selectedIndex]="selectedTabIndex()"
  (selectedIndexChange)="onTabChange($event)"
  animationDuration="200ms"
>
  <mat-tab>
    <ng-template mat-tab-label>
      <mat-icon class="tab-icon">dashboard</mat-icon>
      Dashboard
    </ng-template>
    <div class="tab-body">
      <h3>System Overview</h3>
      <p>Real-time analytics and pipeline monitoring.</p>
    </div>
  </mat-tab>

  <mat-tab>
    <ng-template mat-tab-label>
      <mat-icon class="tab-icon">mail</mat-icon>
      Messages
      @if (tabBadgeCount() > 0) {
        <span class="tab-badge">{{ tabBadgeCount() }}</span>
      }
    </ng-template>
    <div class="tab-body">
      <h3>Inbox</h3>
      <p>You have new messages waiting.</p>
    </div>
  </mat-tab>
</mat-tab-group>`;

  readonly tabsModal = `import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  imports: [MatTabsModule],
  template: \`
    <mat-tab-group>
      <mat-tab label="First"> Content 1 </mat-tab>
      <mat-tab label="Second"> Content 2 </mat-tab>
      <mat-tab label="Third"> Content 3 </mat-tab>
    </mat-tab-group>
  \`,
})
export class TabsDemoComponent {}`;

  readonly expansionTs = `import { MatExpansionModule } from '@angular/material/expansion';

accordionMultiOpen = false;`;

  readonly expansionTpl = `<mat-accordion [multi]="accordionMultiOpen">
  <mat-expansion-panel [expanded]="true">
    <mat-expansion-panel-header>
      <mat-panel-title>Angular v20 Signals</mat-panel-title>
      <mat-panel-description>Reactivity without Zone.js</mat-panel-description>
    </mat-expansion-panel-header>
    <p>Signals provide fine-grained reactivity and optimal performance.</p>
  </mat-expansion-panel>

  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>Standalone Components</mat-panel-title>
      <mat-panel-description>No NgModules required</mat-panel-description>
    </mat-expansion-panel-header>
    <p>Direct imports and clean tree-shakable architectures.</p>
  </mat-expansion-panel>
</mat-accordion>`;

  readonly expansionModal = `import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  imports: [MatExpansionModule],
  template: \`
    <mat-accordion multi>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Section 1</mat-panel-title>
        </mat-expansion-panel-header>
        <p>Panel details 1</p>
      </mat-expansion-panel>
    </mat-accordion>
  \`,
})
export class ExpansionDemoComponent {}`;
}
