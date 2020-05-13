import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from 'src/environments/environment';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { OperationDefinitionNode } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(afAuth: AngularFireAuth, apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.hasura.http });

    const wsClient = new SubscriptionClient(environment.hasura.ws, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        const user = await afAuth.currentUser;
        return {
          Authorization: `Bearer ${await user.getIdToken()}`,
        };
      },
    });

    const ws = new WebSocketLink(wsClient);

    // If Error try refreshing token by reconnecting
    wsClient.onError(() => (ws as any).subscriptionClient.close(false, false));

    const authContext = setContext(async (_, { headers }) => {
      let Authorization = '';
      const user = await afAuth.currentUser;
      if (user) {
        Authorization = `Bearer ${await user.getIdToken()}`;
      }
      return {
        headers: new HttpHeaders().set('Authorization', Authorization),
      };
    });

    const splitLink = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    );

    apollo.create({
      link: authContext.concat(splitLink),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    });
  }
}
