import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DemoAuthService } from '../../core/auth/demo-auth.service';
import { NAV_ITEMS, navSections, NavGroup, NavItem } from '../../core/nav/nav-links';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);

  readonly items = NAV_ITEMS;
  /** Which dropdown is open (group.basePath), or null */
  readonly openGroup = signal<string | null>(null);
  readonly currentUrl = signal(this.router.url);

  /** Sectioned children for mega-menu layout */
  sectionsOf(group: NavGroup) {
    return navSections(group.children);
  }

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.currentUrl.set(e.urlAfterRedirects);
        this.openGroup.set(null);
      });
  }

  isGroup(item: NavItem): item is { kind: 'group'; group: NavGroup } {
    return item.kind === 'group';
  }

  groupIsActive(group: NavGroup): boolean {
    return this.currentUrl().startsWith(group.basePath);
  }

  isOpen(group: NavGroup): boolean {
    return this.openGroup() === group.basePath;
  }

  toggleGroup(group: NavGroup, event: MouseEvent): void {
    event.stopPropagation();
    this.openGroup.update((current) =>
      current === group.basePath ? null : group.basePath,
    );
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openGroup.set(null);
  }
}
