import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiscussionComponent } from '@main/discussion/discussion';
import { CreateDiscussionComponent } from '@main/discussion/create-discussion';

import { APP_CONST } from '@app/app.constant';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DiscussionComponent,
                data: {
                    animation: APP_CONST.routeAnimations.discussion
                },
            },
            {
                path: APP_CONST.routes.create,
                component: CreateDiscussionComponent,
                data: {
                    animation: APP_CONST.routeAnimations.createDiscussion,
                    isShowHeaderFooter: false
                },
            }
        ])
    ],
    exports: [RouterModule]
})
export class DiscussionRoutingModule { }
