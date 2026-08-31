import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * Parent shell for /routes/* — hosts child labs via &lt;router-outlet&gt;.
 * This is the nested-routing pattern: parent stays mounted, child pages swap.
 */
@Component({
  selector: 'app-routes-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './routes-shell.component.html',
  styleUrl: './routes-shell.component.scss',
})
export class RoutesShellComponent {
  readonly links = [
    { label: 'Overview', path: '/routes', exact: true },
    { label: 'Lazy', path: '/routes/lazy', exact: false },
    { label: 'Guards', path: '/routes/guards', exact: false },
    { label: 'Protected', path: '/routes/protected', exact: false },
    { label: 'Deactivate', path: '/routes/deactivate', exact: false },
  ] as const;
}
