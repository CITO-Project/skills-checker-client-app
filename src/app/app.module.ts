import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Ng5SliderModule } from 'ng5-slider';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OrientationScreenComponent } from './components/screens/orientation-screen/orientation-screen.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigateButtonComponent } from './components/navigate-button/navigate-button.component';
import { InterestsScreenComponent } from './components/screens/interests-screen/interests-screen.component';
import { HowToScreenComponent } from './components/screens/how-to-screen/how-to-screen.component';
import { ScenariosScreenComponent } from './components/screens/scenarios-screen/scenarios-screen.component';
import { ResultsScreenComponent } from './components/screens/results-screen/results-screen.component';
import { MediaComponent } from './components/media/media.component';
import { QuestionComponent } from './components/question/question.component';
import { CategoriesScreenComponent } from './components/screens/categories-screen/categories-screen.component';
import { LocalizationScreenComponent } from './components/screens/localization-screen/localization-screen.component';
import { CourseComponent } from './components/course/course.component';
// tslint:disable-next-line:max-line-length
import { ScenarioIntroductionScreenComponent } from './components/screens/scenario-introduction-screen/scenario-introduction-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    OrientationScreenComponent,
    HeaderComponent,
    NavigateButtonComponent,
    InterestsScreenComponent,
    HowToScreenComponent,
    ScenariosScreenComponent,
    ResultsScreenComponent,
    MediaComponent,
    QuestionComponent,
    CategoriesScreenComponent,
    LocalizationScreenComponent,
    CourseComponent,
    ScenarioIntroductionScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    Ng5SliderModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
