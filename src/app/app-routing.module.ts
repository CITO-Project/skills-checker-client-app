import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationScreenComponent } from './components/screens/orientation-screen/orientation-screen.component';
import { CategoriesScreenComponent } from './components/screens/categories-screen/categories-screen.component';
import { InterestsScreenComponent } from './components/screens/interests-screen/interests-screen.component';
import { HowToScreenComponent } from './components/screens/how-to-screen/how-to-screen.component';
import { ScenariosScreenComponent } from './components/screens/scenarios-screen/scenarios-screen.component';
import { ResultsScreenComponent } from './components/screens/results-screen/results-screen.component';


const routes: Routes = [
  {
    path: '',
    component: OrientationScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: CategoriesScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'interests',
    component: InterestsScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'how-to',
    component: HowToScreenComponent,
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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes
    // , { enableTracing: true } // <-- debugging purposes only
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
