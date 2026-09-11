import { Injectable, signal } from '@angular/core';

export interface LessonCrumb {
  label: string;
  /** Omit on the current page (non-link). */
  path?: string;
}

/**
 * Active lesson trail rendered in the sticky header.
 * Each {@link LessonBreadcrumbComponent} registers while it is alive.
 */
@Injectable({ providedIn: 'root' })
export class LessonBreadcrumbService {
  private readonly owners = new Map<object, LessonCrumb[]>();
  readonly crumbs = signal<LessonCrumb[]>([]);

  set(owner: object, crumbs: LessonCrumb[]): void {
    this.owners.set(owner, crumbs);
    this.crumbs.set(crumbs);
  }

  clear(owner: object): void {
    this.owners.delete(owner);
    const remaining = [...this.owners.values()];
    this.crumbs.set(remaining.at(-1) ?? []);
  }
}
