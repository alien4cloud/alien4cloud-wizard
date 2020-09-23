import { NgModule } from '@angular/core';
import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: CatalogListComponent
}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }

