import { Component, OnInit } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { Todo } from 'src/app/models';

@Component({
  selector: 'app-todos-sub',
  templateUrl: './todos-sub.component.html',
  styleUrls: ['./todos-sub.component.scss'],
})
export class TodosSubComponent implements OnInit {
  todos: Todo[];

  constructor(public todosService: TodosService) {}

  ngOnInit(): void {
    this.todosService.todosList$().subscribe((data) => (this.todos = data));
  }
}
