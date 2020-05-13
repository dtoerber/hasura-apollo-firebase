import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class NewTodoGQL extends Subscription {
  document = gql`
    subscription newTodo {
      todos {
        id
        title
      }
    }
  `;
}
