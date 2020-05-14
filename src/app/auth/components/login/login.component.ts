import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  token: string = null;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private fb: FormBuilder, public auth: AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['test@test.com', Validators.required],
      password: ['password', Validators.required],
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get form() {
    return this.loginForm.controls;
  }

  login() {
    this.auth.login(this.form.username.value, this.form.password.value);
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
