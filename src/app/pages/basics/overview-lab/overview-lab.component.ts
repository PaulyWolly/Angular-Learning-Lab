import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_BASICS, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-basics-overview-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './overview-lab.component.html',
  styleUrl: './overview-lab.component.scss',
})
export class BasicsOverviewLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_BASICS, { label: 'Overview' }];

  readonly whyTs = `// Angular is TypeScript on top of modern JavaScript.
// If these feel shaky, Angular templates and RxJS feel "magical":
//
// let / const          → component fields
// arrow functions      → (click)="save()" and callbacks
// arrays + map/filter  → *ngFor / @for data shaping
// promises / async     → mental model before Observables
// import / class       → every Angular component file`;

  readonly whyTpl = `<!-- You already use JS ideas in templates -->
{{ user.name }}
@for (item of items; track item.id) { … }
<button (click)="save()">Save</button>`;
}
