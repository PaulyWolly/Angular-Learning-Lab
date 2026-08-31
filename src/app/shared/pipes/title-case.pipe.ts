import { Pipe, PipeTransform } from '@angular/core';

/** Demo custom pipe: "leanne graham" → "Leanne Graham" */
@Pipe({ name: 'titleCase', standalone: true })
export class TitleCasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim()) {
      return '';
    }
    return value
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
