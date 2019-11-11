import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrientationScreenComponent } from './components/screens/orientation-screen/orientation-screen.component';
import { InterestsScreenComponent } from './components/screens/interests-screen/interests-screen.component';


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
