import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { User } from '../../../models';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = this.afAuth.authState.pipe(
    filter((authState) => !!authState),
    switchMap((_) => this.afs.collection<User>('users').valueChanges())
  );

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  ngOnInit(): void {}
}
