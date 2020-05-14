import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';
import { TodosModule } from './todos/todos.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/components';

import { GraphQLModule } from './graphql/graphql.module';

import { environment } from 'src/environments/environment';
import { LoginComponent } from './auth/components';

@NgModule({
  declarations: [AppComponent, NavComponent, UsersComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    GraphQLModule,
    HttpClientModule,
    TodosModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
