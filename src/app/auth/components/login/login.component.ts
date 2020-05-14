import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  token: string = null;
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

  getToken() {
    this.auth.token$.subscribe((token) => {
      this.token = token;
      console.log(token);
    });
  }
}
