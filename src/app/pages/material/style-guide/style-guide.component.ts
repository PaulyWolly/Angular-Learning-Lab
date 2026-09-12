import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CRUMB_HOME, CRUMB_MATERIAL } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import {
  BORDER_TOKENS,
  COLOR_GROUPS,
  COLOR_TOKENS,
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
  selector: 'app-style-guide',
  standalone: true,
  imports: [MatIconModule, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './style-guide.component.html',
  styleUrl: './style-guide.component.scss',
})
export class StyleGuideComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_MATERIAL, { label: 'Style Guide' }];

  readonly figma = FIGMA_SOURCE;
  readonly colorGroups = COLOR_GROUPS;
  readonly colors = COLOR_TOKENS;
  readonly typeTokens = TYPE_TOKENS;
  readonly spaceTokens = SPACE_TOKENS;
  readonly radiusTokens = RADIUS_TOKENS;
  readonly borderTokens = BORDER_TOKENS;
  readonly elevationTokens = ELEVATION_TOKENS;
  readonly iconTokens = ICON_TOKENS;
  readonly usageRules = USAGE_RULES;

  readonly colorsByGroup = colorsByGroup;

  readonly tokenImportTs = `import { COLOR_TOKENS, SPACE_TOKENS } from '../../../shared/tokens/style-tokens';

// Prefer tokens over raw hex:
const primary = COLOR_TOKENS.find((t) => t.id === 'teal')!.hex;
const cardPad = SPACE_TOKENS.find((t) => t.id === 'space-16')!.rem;`;

  readonly tokenCssTpl = `/* CSS already mirrors the tokens via :root in styles.scss */
.lesson__card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 0.75rem; /* radius-lg */
  color: var(--ink);
}`;
}
