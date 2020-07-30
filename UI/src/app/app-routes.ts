import { Routes } from '@angular/router';
import { APP_CONST } from './app.constant';
import { FullComponent,  BlankComponent, MyProfileComponent } from './shared';
import { CovidComponent } from './main/covid';
import { QuizComponent } from './main/quiz';
import { TopicsComponent } from './main/topics';
import { MyFeedOverlayComponent } from './shared/components/my-feed-overlay';
import { QuestionComponent } from './main/question/question.component';
import { ResultComponent } from './main/result';
import {AuthGuard} from '../app/guard/auth.guard'
import { SchoolBotComponent } from './main/schoolbot';
import { CreateQuizComponent } from './main';
import { InboxComponent } from './main/inbox';
import {VideocallComponent} from './main/videocall'
export const HBRoutes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      
      {
        path: APP_CONST.routes.home,
        loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: APP_CONST.routes.discussion,
        loadChildren: () => import('./main/discussion/discussion.module').then(m => m.DiscussionModule)
      },
      {
         path: APP_CONST.routes.document,
         loadChildren: () => import('./main/file').then(m => m.DocumentModule)
      },
      {
        path: APP_CONST.routes.quiz+'/:id',
        component: QuizComponent,
        data: {
          isShowHeaderFooter: false
        }
      },
      {
        path: APP_CONST.routes.question+'/:topicname/:quizname/:questionId',
        component: QuestionComponent,
        data: {
          isShowHeaderFooter: false
        }
      },
      {
        path: APP_CONST.routes.topics,
        component: TopicsComponent,
        data: {
          isShowHeaderFooter: false
        }     
      },
      {
        path: APP_CONST.routes.noty,
        component: MyFeedOverlayComponent,
        data: {
          isShowHeaderFooter: false
        }     
      },
      {
        path: APP_CONST.routes.createquiz+'/:id',
        component: CreateQuizComponent,
        data: {
          isShowHeaderFooter: false
        }     
      },
    {
      path: APP_CONST.routes.result,
      component: ResultComponent,
      data: {
        isShowHeaderFooter: false
      }     
    },
    {
      path: APP_CONST.routes.covid,
      component: CovidComponent,
      data: {
        isShowHeaderFooter: false
      }     
    },
    {
      path: APP_CONST.routes.schoolbot,
      component: SchoolBotComponent,
      data: {
        isShowHeaderFooter: false
      }     
    },
    {
      path: APP_CONST.routes.videocall,
      component: VideocallComponent,
      data: {
        isShowHeaderFooter: false
      }     
    },
      {
        path: APP_CONST.routes.profile,
        component: MyProfileComponent,
        pathMatch: 'full',
      },
      {
        path: APP_CONST.routes.inbox,
        component: InboxComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
