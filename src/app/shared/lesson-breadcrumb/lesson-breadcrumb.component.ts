import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface LessonCrumb {
  label: string;
  /** Omit on the current page (non-link). */
  path?: string;
}

/**
 * Active breadcrumb trail for lesson pages — replaces static “Angular · Core” eyebrows.
 */
@Component({
  selector: 'app-lesson-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="crumb" aria-label="Breadcrumb">
      <ol class="crumb__list">
        @for (c of crumbs(); track c.label; let last = $last) {
          <li class="crumb__item">
            @if (!last && c.path) {
              <a class="crumb__link" [routerLink]="c.path">{{ c.label }}</a>
            } @else {
              <span class="crumb__current" [attr.aria-current]="last ? 'page' : null">{{
                c.label
              }}</span>
            }
            @if (!last) {
              <span class="crumb__sep" aria-hidden="true">·</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .crumb {
      margin: 0 0 0.35rem;
    }

    .crumb__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.8rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .crumb__item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .crumb__link {
      color: var(--teal);
      font-weight: 700;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .crumb__current {
      color: var(--muted);
      font-weight: 600;
    }

    .crumb__sep {
      color: var(--line);
      font-weight: 700;
    }
  `,
})
export class LessonBreadcrumbComponent {
  readonly crumbs = input.required<LessonCrumb[]>();
}
