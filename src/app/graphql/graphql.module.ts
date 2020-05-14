import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from 'src/environments/environment';
import { split, toPromise } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { OperationDefinitionNode } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { filter } from 'rxjs/operators';
@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(afAuth: AngularFireAuth, apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.hasura.http });

    // Configure a Subscription client that accesses the Firebase Token
    const wsClient = new SubscriptionClient(environment.hasura.ws, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        const idToken = await toPromise<any>(afAuth.idTokenResult as any);
        return {
          headers: {
            Authorization: `Bearer ${idToken.token}`,
          },
        };
      },
    });

    const ws = new WebSocketLink(wsClient);

    // If Error try refreshing token by reconnecting
    wsClient.onError(() => (ws as any).subscriptionClient.close(false, false));

    // Configure an HTTP auth context that accesses the Firebase Token
    const authContext = setContext(async (_, { headers }) => {
      const idToken = await toPromise<any>(
        afAuth.idTokenResult.pipe(filter((res) => !!res)) as any
      );
      const Authorization = `Bearer ${idToken.token}`;
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
