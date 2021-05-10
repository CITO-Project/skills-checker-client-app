import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationScreenComponent } from './components/screens/orientation-screen/orientation-screen.component';
import { InterestsScreenComponent } from './components/screens/interests-screen/interests-screen.component';
import { ScenariosScreenComponent } from './components/screens/scenarios-screen/scenarios-screen.component';
import { ResultsScreenComponent } from './components/screens/results-screen/results-screen.component';
import { LocalizationScreenComponent } from './components/screens/localization-screen/localization-screen.component';
import { CourseScreenComponent } from './components/screens/course-screen/course-screen.component';


const routes: Routes = [
  {
    path: '',
    component: OrientationScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'interests',
    component: InterestsScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'scenarios',
    component: ScenariosScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'results',
    component: ResultsScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'localization',
    component: LocalizationScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'course/:courseid',
    component: CourseScreenComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes
// , { enableTracing: true } // <-- debugging purposes only
, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
