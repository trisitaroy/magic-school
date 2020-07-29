import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DiscussionRoutingModule } from '@main/discussion/discussion.rouing.module';
import { DocumentModule } from '@main/file';
import { CreateDiscussionComponent } from '@main/discussion/create-discussion';
import { DiscussionComponent} from '@main/discussion/discussion';

@NgModule({
  declarations: [
    CreateDiscussionComponent,
    DiscussionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DiscussionRoutingModule,
    DocumentModule,
    ],
    exports: [
      CreateDiscussionComponent,
      DiscussionComponent
    ],
    entryComponents: []
})
export class DiscussionModule { }
