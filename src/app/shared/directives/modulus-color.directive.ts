import { Directive, HostBinding, input, effect } from '@angular/core';

/**
 * Attribute directive: color the host from a number’s parity (n % 2).
 * Even → green (teal), odd → red (danger).
 *
 * Usage: &lt;strong [appModulusColor]="score"&gt;{{ score }}&lt;/strong&gt;
 */
@Directive({
  selector: '[appModulusColor]',
  standalone: true,
})
export class ModulusColorDirective {
  /** The number whose modulus drives the color. */
  readonly appModulusColor = input.required<number>();

  @HostBinding('style.color')
  color = 'inherit';

  @HostBinding('style.fontWeight')
  readonly fontWeight = '700';

  @HostBinding('style.fontVariantNumeric')
  readonly tabular = 'tabular-nums';

  constructor() {
    effect(() => {
      const n = this.appModulusColor();
      // Even → teal, odd → danger (interview-friendly parity demo)
      this.color = n % 2 === 0 ? 'var(--teal)' : 'var(--danger)';
    });
  }
}
