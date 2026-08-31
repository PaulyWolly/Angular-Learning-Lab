import { computed, Injectable, signal } from '@angular/core';
import { NAV_ITEMS } from '../../core/nav/nav-links';

const STORAGE_KEY = 'angular-learning-lab.progress.v1';

export interface ProgressLab {
  id: string;
  label: string;
  path: string;
  group: string;
}

function flattenLabs(): ProgressLab[] {
  const labs: ProgressLab[] = [];
  for (const item of NAV_ITEMS) {
    if (item.kind === 'link') {
      if (item.link.path === '/') continue;
      labs.push({
        id: item.link.path,
        label: item.link.label,
        path: item.link.path,
        group: 'Featured',
      });
      continue;
    }
    for (const child of item.group.children) {
      labs.push({
        id: child.path,
        label: child.label,
        path: child.path,
        group: item.group.label,
      });
    }
  }
  return labs;
}

function readStored(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

/**
 * Persists which labs the learner has checked off (localStorage).
 */
@Injectable({ providedIn: 'root' })
export class LabProgressService {
  readonly labs: ProgressLab[] = flattenLabs();

  private readonly doneIds = signal<Set<string>>(readStored());

  readonly doneCount = computed(() => this.doneIds().size);
  readonly totalCount = this.labs.length;
  readonly percent = computed(() =>
    this.totalCount === 0 ? 0 : Math.round((this.doneCount() / this.totalCount) * 100),
  );

  isDone(id: string): boolean {
    return this.doneIds().has(id);
  }

  toggle(id: string): void {
    this.doneIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      this.persist(next);
      return next;
    });
  }

  reset(): void {
    const empty = new Set<string>();
    this.persist(empty);
    this.doneIds.set(empty);
  }

  /** Group labs for the Home checklist UI. */
  groups(): { label: string; labs: ProgressLab[] }[] {
    const map = new Map<string, ProgressLab[]>();
    for (const lab of this.labs) {
      const list = map.get(lab.group) ?? [];
      list.push(lab);
      map.set(lab.group, list);
    }
    return [...map.entries()].map(([label, labs]) => ({ label, labs }));
  }

  private persist(ids: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      /* private mode / quota — ignore */
    }
  }
}
