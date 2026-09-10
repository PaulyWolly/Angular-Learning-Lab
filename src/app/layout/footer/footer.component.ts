import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NAV_ITEMS, navSectionColumns, NavGroup, NavItem } from '../../core/nav/nav-links';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly router = inject(Router);

  /** Same compact structure as the header — groups pop upward on hover. */
  readonly items = NAV_ITEMS;
  readonly openGroup = signal<string | null>(null);
  readonly currentUrl = signal(this.router.url);

  sectionColumnsOf(group: NavGroup) {
    return navSectionColumns(group.children, group.children.length > 6);
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

  groupIsActive(group: NavGroup): boolean {
    return this.currentUrl().startsWith(group.basePath);
  }

  isOpen(group: NavGroup): boolean {
    return this.openGroup() === group.basePath;
  }

  openOnHover(group: NavGroup): void {
    this.openGroup.set(group.basePath);
  }

  closeOnLeave(): void {
    this.openGroup.set(null);
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

  /**
   * Footer nav is right-aligned — pin group mega-menus to the trigger’s right edge
   * so wide Core/Routes panels don’t spill off the viewport.
   */
  menuAlignEnd(item: NavItem): boolean {
    return item.kind === 'group';
  }
}
