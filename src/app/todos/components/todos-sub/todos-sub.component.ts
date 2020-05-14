import { Component, OnInit } from '@angular/core';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos-sub',
  templateUrl: './todos-sub.component.html',
  styleUrls: ['./todos-sub.component.scss'],
})
export class TodosSubComponent implements OnInit {
  constructor(public todosService: TodosService) {}

  ngOnInit(): void {}
}
