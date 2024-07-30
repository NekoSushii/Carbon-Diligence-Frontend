import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeBooleanPipe } from './safe-boolean.pipe';

@NgModule({
  declarations: [SafeBooleanPipe],
  imports: [CommonModule],
  exports: [SafeBooleanPipe]
})
export class SharedModule {}
