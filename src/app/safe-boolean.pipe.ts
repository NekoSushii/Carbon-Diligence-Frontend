import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeBoolean'
})
export class SafeBooleanPipe implements PipeTransform {
  transform(value: any): boolean {
    return !!value;
  }
}
