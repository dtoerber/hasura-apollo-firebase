import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, filter, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticated: boolean;
  authenticated$: Observable<boolean> = this.afAuth.authState.pipe(
    map((authState) => !!authState)
  );

  token$: Observable<string> = this.afAuth.idTokenResult.pipe(
    filter((authState) => !!authState),
    first(),
    map((idToken) => idToken.token)
  );

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((authState) => {
      if (authState) {
        this.afAuth.idTokenResult
          .pipe(
            first(),
            tap((token) => {
              console.log(token.token);
              const expires =
                new Date(token.expirationTime).toLocaleDateString() +
                ' ' +
                new Date(token.expirationTime).toLocaleTimeString();
              console.log(`token expires:`, expires);
            })
          )
          .subscribe((token) => {
            this.authenticated = true;
            console.log();
            // return localStorage.setItem('accessToken', token.token);
          });
      } else {
        this.authenticated = false;
        localStorage.removeItem('accessToken');
      }
    });
  }

  login() {
    const email = 'test@test.com';
    const password = 'password';
    this.afAuth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    this.afAuth.signOut();
  }
}
