import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, filter } from 'rxjs/operators';
import { Apollo, Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { Todo } from '../../models';

export interface Response {
  todos: Todo[];
}

export const query = gql`
  query ListTodos {
    todos {
      id
      title
      status
      complete
    }
  }
`;

export const subscription = gql`
  subscription ListTodos {
    todos {
      id
      title
      status
      complete
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todos$: Observable<Todo[]> = this.apollo
    .watchQuery<any>({ query })
    .valueChanges.pipe(
      map((response) => response.data.todos),
      tap((res) => console.log(`Subscription`, res))
    );

  constructor(private apollo: Apollo) {}

  todosList$(): Observable<any> {
    return this.apollo
      .subscribe<any>({ query: subscription })
      .pipe(
        map((response) => response.data.todos),
        tap((res) => console.log(`Watch:`, res))
      );
  }
}
