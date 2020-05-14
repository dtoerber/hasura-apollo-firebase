import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent, TodosSubComponent } from './components';

@NgModule({
  declarations: [TodosComponent, TodosSubComponent],
  imports: [CommonModule],
})
export class TodosModule {}
