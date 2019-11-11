import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrientationScreenComponent } from './components/screens/orientation-screen/orientation-screen.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigateButtonComponent } from './components/navigate-button/navigate-button.component';
import { InterestsScreenComponent } from './components/screens/interests-screen/interests-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    OrientationScreenComponent,
    HeaderComponent,
    NavigateButtonComponent,
    InterestsScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
