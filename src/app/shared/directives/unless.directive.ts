import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Custom structural directive — opposite of &#64;if / *ngIf.
 * Renders the template when the condition is *false*.
 *
 * Usage: &lt;p *appUnless="hideHint"&gt;Visible while hideHint is false&lt;/p&gt;
 *
 * Under the hood: TemplateRef (the stamped HTML) + ViewContainerRef (where to put it).
 */
@Directive({
  selector: '[appUnless]',
  standalone: true,
})
export class UnlessDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private hasView = false;

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
