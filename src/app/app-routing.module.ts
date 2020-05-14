import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/components';
import { TodosComponent } from './todos/components';
import { LoginComponent } from './auth/components';
import { AuthGuardUserService } from './auth/services/auth-guard-user.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'users',
    canActivate: [AuthGuardUserService],
    component: UsersComponent,
  },
  {
    path: 'todos',
    canActivate: [AuthGuardUserService],
    component: TodosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
