import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

import { HBRoutes } from './app-routes';

import {CovidComponent} from '../app/main/covid';
import {QuizComponent} from '../app/main/quiz';
import {TopicsComponent} from '../app/main/topics';
import {QuestionComponent} from '../app/main/question';
import { AppComponent } from './app.component';
import { ResultComponent } from './main';
import {SchoolBotComponent} from '../app/main/schoolbot'
import {CreateQuizComponent} from '../app/main/create-quiz'
import{InboxComponent} from '../app/main/inbox';

import { ToastrModule } from 'ngx-toastr';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    CovidComponent,
    QuizComponent,
    CreateQuizComponent,
    TopicsComponent,
    QuestionComponent,
    ResultComponent,
    SchoolBotComponent,
    InboxComponent    
  ],
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule.forRoot(HBRoutes, { useHash: true }),
    SharedModule,    
    AccordionModule.forRoot(),
    ToastrModule.forRoot(),
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
