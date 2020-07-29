import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from '@main/dashboard/dashboard.routing.module';
import { DiscussionModule } from '@main/discussion/discussion.module';
import { DashboardComponent } from '@main/dashboard/dashboard';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    SharedModule,
    DashboardRoutingModule,
    DiscussionModule
  ],
  entryComponents: []
})
export class DashboardModule { }
