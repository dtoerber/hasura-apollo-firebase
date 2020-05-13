import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  token: string = null;
  constructor(public auth: AuthService) {}

  getToken() {
    this.auth.token$.subscribe((token) => {
      this.token = token;
      console.log(token);
    });
  }
}
