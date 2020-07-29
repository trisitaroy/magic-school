import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from '@auth/login';
import { NotFoundComponent } from '@auth/not-found';

import { APP_CONST } from '@app/app.constant';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                redirectTo: APP_CONST.routes.login
            },
            {
                path: APP_CONST.routes.login,
                component: LoginComponent,
                data: {
                    animation: APP_CONST.routeAnimations.login
                },
            },
            {
                path: APP_CONST.routes.notFound,
                component: NotFoundComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule { }
