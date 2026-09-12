import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import {
  BORDER_TOKENS,
  COLOR_GROUPS,
  ELEVATION_TOKENS,
  FIGMA_SOURCE,
  ICON_TOKENS,
  RADIUS_TOKENS,
  SPACE_TOKENS,
  TYPE_TOKENS,
  USAGE_RULES,
  colorsByGroup,
} from '../../../shared/tokens/style-tokens';

@Component({
  selector: 'app-foundations-lab',
  standalone: true,
  imports: [MatIconModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './foundations-lab.component.html',
  styleUrl: './foundations-lab.component.scss',
})
export class FoundationsLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Style Guide' }];

  readonly figma = FIGMA_SOURCE;
  readonly colorGroups = COLOR_GROUPS;
  readonly typeTokens = TYPE_TOKENS;
  readonly spaceTokens = SPACE_TOKENS;
  readonly radiusTokens = RADIUS_TOKENS;
  readonly borderTokens = BORDER_TOKENS;
  readonly elevationTokens = ELEVATION_TOKENS;
  readonly iconTokens = ICON_TOKENS;
  readonly usageRules = USAGE_RULES;
  readonly colorsByGroup = colorsByGroup;

  readonly tokenImportTs = `import { COLOR_TOKENS, SPACE_TOKENS } from '../../../shared/tokens/style-tokens';

const primary = COLOR_TOKENS.find((t) => t.id === 'teal')!.hex;
const cardPad = SPACE_TOKENS.find((t) => t.id === 'space-16')!.rem;`;

  readonly tokenCssTpl = `/* Site chrome uses the same :root tokens as lesson cards */
.site-header {
  background: linear-gradient(180deg, #e0bb5f 0%, var(--bg) 100%);
}
.home__card,
.lesson__card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 0.75rem;
}`;
}
