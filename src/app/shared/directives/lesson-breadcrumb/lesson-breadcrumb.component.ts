import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { LessonBreadcrumbService, LessonCrumb } from './lesson-breadcrumb.service';

export type { LessonCrumb };

/**
 * Registers a lesson breadcrumb trail with {@link LessonBreadcrumbService}.
 * The trail renders in the site header (sticky) — this host stays empty in the page.
 */
@Component({
  selector: 'app-lesson-breadcrumb',
  standalone: true,
  template: '',
  host: {
    // Keep layout free of a zero-height node gap in lesson tops.
    style: 'display: contents',
  },
})
export class LessonBreadcrumbComponent {
  private readonly store = inject(LessonBreadcrumbService);
  private readonly destroyRef = inject(DestroyRef);

  readonly crumbs = input.required<LessonCrumb[]>();

  constructor() {
    const owner = this;
    effect(() => {
      this.store.set(owner, this.crumbs());
    });
    this.destroyRef.onDestroy(() => this.store.clear(owner));
  }
}
