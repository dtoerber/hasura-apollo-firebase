import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';
import { takeUntil, tap, map, filter } from 'rxjs/operators';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardUserService implements CanActivate, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.idToken.pipe(
      takeUntil(this.destroy$),
      tap((token) => {
        if (!token) {
          this.router.navigate(['login']);
        }
      }),
      map((user) => !!user)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
