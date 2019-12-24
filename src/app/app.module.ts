import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {  FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";


import { AppComponent } from "./app.component";

import { HeaderComponent } from "./header/header.component";

import { AppRoutingModule } from "./app-routing.module";

import { AuthInterceptor } from "./auth/auth-interceptor";
import { SetdataListComponent } from './setdata/setdata-list/setdata-list.component';
import { SetdataCreateComponent } from './setdata/setdata-create/setdata-create.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SetdataListComponent,
    SetdataCreateComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
