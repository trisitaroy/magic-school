import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DocumentsComponent } from '@main/file/documents';
import { APP_CONST } from '@app/app.constant';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DocumentsComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ],
})
export class DocumentRoutingModule { }