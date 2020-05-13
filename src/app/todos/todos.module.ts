import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from './todos.component';
import { TodosSubComponent } from './todos-sub/todos-sub.component';

@NgModule({
  declarations: [TodosComponent, TodosSubComponent],
  imports: [CommonModule],
})
export class TodosModule {}
