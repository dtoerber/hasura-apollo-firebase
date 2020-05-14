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

    // NEW
    // const wsClient = new SubscriptionClient(environment.hasura.ws, {
    //   lazy: true,
    //   reconnect: true,
    //   connectionParams: async () => {
    //     const idToken = await toPromise<any>(afAuth.idTokenResult as any);
    //     return {
    //       Authorization: `Bearer ${idToken.token}`,
    //     };
    //   },
    // });
    // ORIGINAL
    // const wsClient = new SubscriptionClient(environment.hasura.ws, {
    //   lazy: true,
    //   reconnect: true,
    //   connectionParams: async () => {
    //     const user = await afAuth.currentUser;
    //     return {
    //       Authorization: `Bearer ${await user.getIdToken()}`,
    //     };
    //   },
    // });

    // link: new WebSocketLink({
    //   uri: environment.graphqlUrl,
    //   options: {
    //     reconnect: true,
    //     connectionParams: {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem(
    //           'accessToken'
    //         )}`,
    //       },
    //     },
    //   },
    // }),
    const wsClient = new SubscriptionClient(environment.hasura.ws, {
      lazy: true,
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImZjMmM4YmIyNmE3OGM0M2JkODYzNzA1YjNkNzkyMWI0ZTY0MjVkNTQiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6IkQwSDZ0NjBxTkFTdmNWUExUNXB5VnJMSGhjdTIifSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2hhc3VyYS1hcG9sbG8tZmlyZWJhc2UiLCJhdWQiOiJoYXN1cmEtYXBvbGxvLWZpcmViYXNlIiwiYXV0aF90aW1lIjoxNTg5NDYzMDcyLCJ1c2VyX2lkIjoiRDBINnQ2MHFOQVN2Y1ZQTFQ1cHlWckxIaGN1MiIsInN1YiI6IkQwSDZ0NjBxTkFTdmNWUExUNXB5VnJMSGhjdTIiLCJpYXQiOjE1ODk0NjY3NjAsImV4cCI6MTU4OTQ3MDM2MCwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3RAdGVzdC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.sD0dLOHi2xPJdQ6tDWrvlGPcGJlx2L90gh6aKAgmPq5dHNFmoA4ZhQYzSOUKoWhCUtI7W-1oRoKRyh7gFwTkgDkrkIWp8Nt3Gb6gkVEXHa_byo9wlnqx5H-j57PyjS-T0GmOSc_4hf2d0P9NiqfRTi6ew_Odh43IFIEANopgkJujLSUuTUkZv7EeXOWb7SGxxxyjS9uHGCVActZvZ7p-vE8RdyDsvHb325V_O9VqDlOtkf20weUEJ7EIpuKTeZqC_Xt_mBqH8j9EjOYhY0IondNbkuAE7FrnnQJswgkQ6h5eZFIDUe7JCNP_d2JHokUexqlxeb60gzcl_tnCqPsS1w`,
        },
      },
    });

    const ws = new WebSocketLink(wsClient);

    // If Error try refreshing token by reconnecting
    wsClient.onError(() => (ws as any).subscriptionClient.close(false, false));

    const authContext = setContext(async (_, { headers }) => {
      const idToken = await toPromise<any>(
        afAuth.idTokenResult.pipe(filter((res) => !!res)) as any
      );
      const Authorization = `Bearer ${idToken.token}`;
      return {
        headers: new HttpHeaders().set('Authorization', Authorization),
      };
    });

    // ORIGINAL
    // const authContext = setContext(async (_, { headers }) => {
    //   let Authorization = '';
    //   const user = await afAuth.currentUser;
    //   console.log(`user`, user);
    //   if (user) {
    //     Authorization = `Bearer ${await user.getIdToken()}`;
    //   }
    //   return {
    //     headers: new HttpHeaders().set('Authorization', Authorization),
    //   };
    // });

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
