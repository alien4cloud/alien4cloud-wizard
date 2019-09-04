import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from '@app/shared';



@NgModule({
  declarations: [CatalogListComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule { }
