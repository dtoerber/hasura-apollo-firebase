import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todos: Todo[];

  constructor(private apollo: Apollo) {
    this.apollo
      .watchQuery<any>({ query })
      .valueChanges.pipe(
        tap((res) => console.log(res)),
        map((response) => response.data.todos),
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      )
      .subscribe((todos) => (this.todos = todos));
  }
}
