import { Directive, HostBinding, HostListener, input } from '@angular/core';

const DEFAULT_HIGHLIGHT = 'var(--teal-soft)';

/**
 * Attribute directive demo: highlight background on hover.
 * Usage: &lt;p appHighlight&gt; or &lt;p [appHighlight]="'#fef3c7'"&gt;
 *
 * Note: a bare `appHighlight` attribute binds "" (empty string), which would
 * override input()'s default — so we transform blank values back to the default.
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  readonly appHighlight = input(DEFAULT_HIGHLIGHT, {
    transform: (value: string | null | undefined) =>
      value?.trim() ? value : DEFAULT_HIGHLIGHT,
  });

  private active = false;

  @HostBinding('style.backgroundColor')
  get background(): string {
    return this.active ? this.appHighlight() : 'transparent';
  }

  @HostBinding('style.transition')
  readonly transition = 'background-color 0.15s ease';

  @HostBinding('style.padding')
  readonly padding = '0.15rem 0.35rem';

  @HostBinding('style.borderRadius')
  readonly radius = '0.3rem';

  @HostListener('mouseenter')
  onEnter(): void {
    this.active = true;
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.active = false;
  }
}
