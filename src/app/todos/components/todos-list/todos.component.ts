import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { Todo } from '../../../models';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Observable<Todo[]>;
  todosSubscription: Todo[];

  constructor(public todosService: TodosService) {}

  ngOnInit(): void {
    this.todosService
      .todosList$()
      .subscribe((data) => (this.todosSubscription = data));
  }
}
