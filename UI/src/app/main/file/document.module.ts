import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DocumentRoutingModule } from '@main/file/document.routing.module';
import { DocumentsComponent } from '@main/file/documents';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    DocumentsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DocumentRoutingModule
  ],
  exports: [
  ]
})
export class DocumentModule { }
