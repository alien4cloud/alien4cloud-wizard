import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@app/shared';
import {LoginComponent} from "@app/shared/components";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'application-dashboard',
    loadChildren: () => import('./features/application-dashboard/application-dashboard.module').then(mod => mod.ApplicationDashboardModule)
  },
  {
    path: 'new-wizard',
    loadChildren: () => import('./features/application-wizard/application-wizard.module').then(mod => mod.ApplicationWizardModule)
  },
  {
    path: 'app-wizard/:applicationId/:environmentId',
    loadChildren: () => import('./features/application-wizard/application-wizard.module').then(mod => mod.ApplicationWizardModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(mod => mod.SettingsModule)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./features/catalog/catalog.module').then(mod => mod.CatalogModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true } */)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [];
