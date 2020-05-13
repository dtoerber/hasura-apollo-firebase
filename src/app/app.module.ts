import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material/material.module';
import { TodosModule } from './todos/todos.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';

import { GraphQLOrigModule } from './graphql-orig/graphql-orig.module';
import { GraphQLModule } from './graphql/graphql.module';

import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, NavComponent, UsersComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    GraphQLModule,
    // GraphQLOrigModule,
    HttpClientModule,
    TodosModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
