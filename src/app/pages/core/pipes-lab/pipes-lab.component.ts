import { CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '../../../shared/pipes/title-case.pipe';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-pipes-lab',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    TitleCasePipe,
    LessonBreadcrumbComponent,
    LessonSyntaxComponent,
  ],
  templateUrl: './pipes-lab.component.html',
  styleUrl: './pipes-lab.component.scss',
})
export class PipesLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Pipes' }];
  name = 'leanne graham';
  price = 1234.5;
  readonly now = new Date();
  ratio = 0.875;

  readonly inputsTpl = `<input [(ngModel)]="name" />
<input type="number" [(ngModel)]="price" />`;
  readonly inputsTs = `name = 'leanne graham';
price = 1234.5;
readonly now = new Date();
ratio = 0.875;`;

  readonly uppercaseTpl = `{{ name | uppercase }}`;
  readonly uppercaseTs = `// built-in UpperCasePipe — import from @angular/common
name = 'leanne graham';`;

  readonly titleCaseTpl = `{{ name | titleCase }}`;
  readonly titleCaseTs = `// custom pipe — implements PipeTransform
name = 'leanne graham';`;
  readonly titleCaseModal = `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titleCase', standalone: true })
export class TitleCasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim()) return '';
    return value
      .trim()
      .toLowerCase()
      .split(/\\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Component imports: [TitleCasePipe]
// Template: {{ name | titleCase }}`;

  readonly dateTpl = `{{ now | date: 'medium' }}`;
  readonly dateTs = `readonly now = new Date();
// DatePipe from @angular/common`;

  readonly currencyTpl = `{{ price | currency: 'USD' }}`;
  readonly currencyTs = `price = 1234.5;
// CurrencyPipe from @angular/common`;

  readonly numberTpl = `{{ ratio | number: '1.0-2' }}`;
  readonly numberTs = `ratio = 0.875;
// DecimalPipe (number) from @angular/common`;
}
