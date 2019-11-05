import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrientationComponent } from './components/screens/orientation/orientation.component';


const routes: Routes = [
  {
    path: '',
    component: OrientationComponent,
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
