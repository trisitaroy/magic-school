import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from '@main/dashboard/dashboard/dashboard.component';

import { APP_CONST } from '@app/app.constant';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
                data: {
                    animation: APP_CONST.routeAnimations.home
                },
            }
        ])
    ],
    exports: [
        RouterModule
    ],
})
export class DashboardRoutingModule { }
